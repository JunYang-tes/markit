<script lang="ts">
  import browser from "webextension-polyfill";
</script>

<div>
  <a target="_blank" href={browser.runtime.getURL("html/viewer.html")}>Viewer </a>
  <a target="_blank" href={browser.runtime.getURL("html/index.html")}>Control Center </a>
</div>

<style>
</style>
