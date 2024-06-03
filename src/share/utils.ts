
export function isBackground() {
  try {
    return globalThis.document == null
  } catch (e) {
    return false
  }
}
