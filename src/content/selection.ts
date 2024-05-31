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
    const rect = range.getClientRects()[0]
    const selected = text.substring(selection.anchorOffset, selection.focusOffset);
    if (selected.length === text.length) {
      handleSelection(selected, node.parentElement?.textContent ?? '',
        rect.x,
        rect.y
      )
    } else {
      handleSelection(selected, text,
        rect.x, rect.y
      )
    }

  }
})
