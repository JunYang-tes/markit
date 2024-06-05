import type { MarkedItem } from "../share/types";
import { showWin } from './popup/state.svelte'

export function highlight(list: MarkedItem[]) {
  console.log(list)
  hightlightUnderNode(document.body, list)
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        observer.disconnect()
        for (const node of Array.from(mutation.addedNodes)) {
          hightlightUnderNode(node, list)
        }
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      }
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
export function hightlightUnderNode(node: Node, list: MarkedItem[]) {
  for (let child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.nodeValue ?? ""
      if (text.trim() !== "") {
        const matchItems: Array<{ startIdx: number, endIdx: number }> = []
        for (const item of list) {
          const idx = text.indexOf(item.content);
          if (idx >= 0) {
            matchItems.push({
              startIdx: idx,
              endIdx: idx + item.content.length
            })
          }
        }
        const items = deoverlap(matchItems)
        if (items.length > 0) {
          modifyDom(child, partionText(text, items))
        }
      }
    } else if (child.nodeType === Node.ELEMENT_NODE &&
      child.nodeName !== "STYLE" && child.nodeName !== "SCRIPT" &&
      (child as HTMLElement).getAttribute('data-markit_marked') == null
    ) {
      hightlightUnderNode(child, list)
    }
  }
}
export function cancelHighlight(node: Node, content: string) {
  for (let child of Array.from(node.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).getAttribute('data-markit_marked') != null
        && node.textContent === content
      ) {
        ; (node as HTMLElement).replaceWith(content)
      } else if (child.nodeName !== 'STYLE' && child.nodeName !== 'SCRIPT') {
        cancelHighlight(child, content)
      }
    }
  }
}

function deoverlap(input: Array<{ startIdx: number, endIdx: number }>) {
  if (input.length === 0) {
    return input
  }
  const sorted = input.toSorted((a, b) => a.startIdx - b.startIdx)
  const nooverlap = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    let last = nooverlap[nooverlap.length - 1];
    let curr = sorted[i];
    if (curr.startIdx >= last.endIdx) {
      nooverlap.push(curr)
    }
  }
  return nooverlap
}
function partionText(text: string, indexes: Array<{ startIdx: number, endIdx: number }>) {
  const ret: Array<{
    content: string,
    inRange: boolean
  }> = []
  let index = 0;
  for (let { startIdx, endIdx } of indexes) {
    if (index < startIdx) {
      const left = text.slice(index, startIdx);
      ret.push({
        content: left,
        inRange: false
      })
    }
    const middle = text.slice(startIdx, endIdx)
    ret.push({
      content: middle,
      inRange: true
    })
    index = endIdx;
  }
  if (index < text.length) {
    ret.push({
      content: text.slice(index),
      inRange: false
    })
  }
  return ret
}
function modifyDom(node: Node, items: Array<{ content: string, inRange: boolean }>) {
  const frag = document.createDocumentFragment()
  for (const item of items) {
    if (item.inRange) {
      const span = document.createElement('span')
      span.setAttribute('data-markit_marked', 'true')
      span.append(item.content)
      span.addEventListener('click', () => {
        const rect = span.getBoundingClientRect()
        showWin(item.content, rect.x, rect.y)
      })
      span.setAttribute('style', 'color:#d67200;text-decoration: underline wavy;cursor:pointer;text-underline-position: under;')
      frag.append(span)
    } else {
      const text = document.createTextNode(item.content);
      frag.append(text)
    }
  }
  const parent = node.parentNode!
  parent.replaceChild(frag, node)
}
