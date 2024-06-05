<script lang="ts">
  import browser from "webextension-polyfill";
</script>

<ul class="menu menu-list">
  <li>
    <a target="_blank" href={browser.runtime.getURL("html/viewer.html")}>
      Pdf 阅读器
    </a>
  </li>
  <li>
    <a target="_blank" href={browser.runtime.getURL("html/index.html")}>
      管理
    </a>
  </li>
</ul>

<style>
</style>
