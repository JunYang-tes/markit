import { mount } from 'svelte'
import {hide} from './state.svelte'
import MarkButton from './MarkButton.svelte'
const mountPoint = document.createElement('div')
mountPoint.setAttribute('style', `
position: fixed;
left:0;
top:0;
height:0;
z-index:1000;
`)
document.body.append(mountPoint)

function hideWhenClickedOutside(e: Event) {
  if (e.target !== mountPoint) {
    hide()
  }
}
document.body.addEventListener("mousedown", hideWhenClickedOutside);
document.body.addEventListener("touchstart", hideWhenClickedOutside);



const root = mountPoint.attachShadow({ mode: 'open' })
mount(MarkButton, { target: root })
