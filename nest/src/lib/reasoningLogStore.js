const STORAGE_KEY = 'nest.reasoningLogs.v1';
const MAX_LOGS = 20;

export function saveReasoningLog({ scriptId, script }) {
  try {
    const existing = readAll();
    const filtered = existing.filter((log) => log.scriptId !== scriptId);
    const updated = [{ scriptId, script, savedAt: Date.now() }, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, MAX_LOGS)));
    return true;
  } catch {
    return false;
  }
}

export function getReasoningLog(scriptId) {
  try {
    return readAll().find((log) => log.scriptId === scriptId) ?? null;
  } catch {
    return null;
  }
}

export function listReasoningLogs() {
  try {
    return readAll();
  } catch {
    return [];
  }
}

export function deleteReasoningLog(scriptId) {
  try {
    const filtered = readAll().filter((log) => log.scriptId !== scriptId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Persistence is optional; storage failures must not interrupt planning.
  }
}

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.sort((a, b) => b.savedAt - a.savedAt);
}
