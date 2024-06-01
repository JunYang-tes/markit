import Popup from './pages/Popup.svelte'
import { mount } from 'svelte'
import * as pdfjsLib from 'pdfjs-dist'
import * as Viewer from 'pdfjs-dist/web/pdf_viewer.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc='//mozilla.github.io/pdf.js/build/pdf.worker.mjs'
console.log(Viewer)


mount(Popup, { target: document.body })
