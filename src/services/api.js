// api.js  —  drop this in your frontend src/ folder
// Handles HuggingFace cold-start wake-up + retry logic

// ─────────────────────────────────────────
// PUT YOUR HUGGING FACE BACKEND URL HERE
// e.g. "https://your-username-renovision.hf.space"
// ─────────────────────────────────────────
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ahmad3351-renovision.hf.space";

const WAKE_TIMEOUT_MS  = 90_000;   // max 90s to wait for HF cold start
const WAKE_POLL_MS     = 4_000;    // ping every 4 seconds
const ANALYZE_TIMEOUT  = 120_000;  // 2 min timeout for analyze (YOLO is slow)


// ─────────────────────────────────────────
// Wake up the HF backend and wait until ready
// Shows a progress callback so your UI can
// display "Waking up backend... 12s"
// ─────────────────────────────────────────
export async function wakeBackend(onProgress) {
  const start = Date.now();

  while (Date.now() - start < WAKE_TIMEOUT_MS) {
    const elapsed = Math.round((Date.now() - start) / 1000);
    if (onProgress) onProgress(elapsed);

    try {
      const res = await fetch(`${BACKEND_URL}/wake`, {
        method: "GET",
        signal: AbortSignal.timeout(8000),  // 8s per ping
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ready === true) {
          return { success: true };
        }
        // Server is up but still loading model — keep polling
      }
    } catch (err) {
      // Server still sleeping — keep polling
    }

    await new Promise(resolve => setTimeout(resolve, WAKE_POLL_MS));
  }

  return { 
    success: false, 
    error: "Backend took too long to wake up. Please try again in a minute." 
  };
}


// ─────────────────────────────────────────
// POST /analyze  with full cold-start handling
// ─────────────────────────────────────────
export async function analyzeRoom({ file, budget, style, token, userPrompt, onStatus }) {
  
  // STEP 1 — Quick health check first
  onStatus?.("Checking backend connection...");
  
  let isReady = false;
  try {
    const healthRes = await fetch(`${BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(8000),
    });
    if (healthRes.ok) {
      const health = await healthRes.json();
      isReady = health.ready === true;
    }
  } catch {
    // Backend is sleeping — will wake below
    isReady = false;
  }

  // STEP 2 — If not ready, wake it up
  if (!isReady) {
    onStatus?.("Backend is waking up (free tier)...");
    
    const wakeResult = await wakeBackend((elapsed) => {
      onStatus?.(`Waking up backend... ${elapsed}s (free tier cold start, ~30-60s)`);
    });

    if (!wakeResult.success) {
      return {
        success: false,
        error: wakeResult.error,
      };
    }
  }

  // STEP 3 — Actually call /analyze
  onStatus?.("Analyzing your room...");

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("budget", String(budget));
    formData.append("style", style);
    formData.append("token", token);
    formData.append("user_prompt", userPrompt || "");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT);

    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok) {
      // Backend returned 503 — still warming up, retry once
      if (res.status === 503 && data.error === "warming_up") {
        onStatus?.("Model still loading, waiting 15s...");
        await new Promise(r => setTimeout(r, 15000));

        // One retry
        const retryRes = await fetch(`${BACKEND_URL}/analyze`, {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(ANALYZE_TIMEOUT),
        });
        const retryData = await retryRes.json();
        if (!retryRes.ok) {
          return { success: false, error: retryData.error || "Analysis failed" };
        }
        return { success: true, data: retryData };
      }

      return { 
        success: false, 
        error: data.error || data.message || `Server error ${res.status}` 
      };
    }

    return { success: true, data };

  } catch (err) {
    if (err.name === "AbortError") {
      return { 
        success: false, 
        error: "Request timed out. The backend may be busy. Please try again." 
      };
    }
    return { 
      success: false, 
      error: `Connection error: ${err.message}` 
    };
  }
}


// ─────────────────────────────────────────
// Auth helpers
// ─────────────────────────────────────────

export async function registerUser({ name, email, password }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);

  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function googleAuth({ name, email, google_uid }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("google_uid", google_uid);

  const res = await fetch(`${BACKEND_URL}/auth/google`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${BACKEND_URL}/auth/users`);
  return res.json();
}