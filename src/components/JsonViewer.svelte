<script lang="ts">
  import { mount, onMount } from "svelte";
  let { data } = $props();
</script>

<div>
  <pre>
    {JSON.stringify(data, null, 2)}
  </pre>
</div>
