import { mount } from 'svelte'
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
const root = mountPoint.attachShadow({ mode: 'open' })
mount(MarkButton, { target: root })
