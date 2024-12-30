import { debounce } from 'lodash-es'
import { showMarkerButton } from './popup/state.svelte'


const handleSelection = debounce(showMarkerButton, 500, { trailing: true, leading: false })

document.addEventListener("selectionchange", (e) => {
  const selection = document.getSelection();
  if (!selection) {
    return
  }
  const node = selection?.anchorNode
  const text = node?.nodeValue
  if (!node || !text) { return }

  if (node?.nodeType === Node.TEXT_NODE &&
    !selection.isCollapsed
  ) {
    const range = selection.getRangeAt(0)
    const halfHeight = window.innerHeight / 2
    const rects = range.getClientRects()
    if (rects.length === 0) {
      return
    }
    const rect = rects[0]
    const dy = rect.y > halfHeight
      ? -30
      : rect.height

    const selectedText = selection.toString();
    if(selectedText.length > 0){
      handleSelection(selectedText, text, rect.x, rect.y + dy)
    }
  }
})