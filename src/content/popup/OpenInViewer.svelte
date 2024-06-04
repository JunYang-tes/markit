<script lang="ts">
  import browser from "webextension-polyfill";
</script>

<a
  href={`${browser.runtime.getURL("html/viewer.html")}?path=${location.pathname}`}
  target="_blank"
>
  Open with Markit
</a>
