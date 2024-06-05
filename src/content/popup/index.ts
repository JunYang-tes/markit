import { mount } from 'svelte'
import { hide } from './state.svelte'
import MarkButton from './MarkButton.svelte'
import OpenWithMarkit from './OpenInViewer.svelte'
import css  from '../../style.css?raw'


const mountPoint = document.createElement('div')
mountPoint.setAttribute('style', `
position: fixed;
left:0;
top:0;
height:0;
z-index:1000;
`)

const root = mountPoint.attachShadow({ mode: 'open' })
root.innerHTML=`
<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css';
${css}
</style>
`
document.body.append(mountPoint)

function showFloatingMarkButton() {
  function hideWhenClickedOutside(e: Event) {
    if (e.target !== mountPoint) {
      hide()
    }
  }
  document.body.addEventListener("mousedown", hideWhenClickedOutside);
  document.body.addEventListener("touchstart", hideWhenClickedOutside);
  mount(MarkButton, { target: root })
}
function showOpenInViewer() {
  mount(OpenWithMarkit, { target: root })
}

const isViewingPdf = location.origin === "file://" &&
  location.pathname
    .toLowerCase()
    .endsWith("pdf")

if (isViewingPdf) {
  showOpenInViewer()
} else {
  showFloatingMarkButton()
}


