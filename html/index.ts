import { mount } from 'svelte'
import Management from '../src/pages/Management.svelte'
mount(
  Management,
  { target: document.body.querySelector('#root')! }
)

