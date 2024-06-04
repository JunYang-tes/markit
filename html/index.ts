import { mount } from 'svelte'
import Control from '../src/pages/Control.svelte'
mount(
  Control,
  { target: document.body.querySelector('#root')! }
)

