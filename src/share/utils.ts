
export function isBackground() {
  if (typeof browser.tabs !== 'undefined') {
    return true
  }
  return false
}
