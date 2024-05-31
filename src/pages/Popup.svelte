<script lang="ts">
let c = $state(0)
console.log("Hello from the popup!");
function onclick() {
  c++;
}
</script>

<div>
  <img src="/icon-with-shadow.svg" alt="" />
  <h1>vite-plugin-web-extension</h1>
  <div>{c}</div>
  <button onclick={onclick}>
    Click
  </button>
  <p>
    Template: <code>svelte-ts</code>
  </p>
</div>

