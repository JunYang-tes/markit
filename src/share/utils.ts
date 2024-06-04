
export function isBackground() {
  console.log("isBackground",globalThis.window == null)
  return globalThis.window == null
}
