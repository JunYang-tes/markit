<script lang="ts">
  import browser from "webextension-polyfill";
  let content = $state("");
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id != null) {
      browser.tabs
        .sendMessage(tabs[0].id, {
          action: "query",
        })
        .then((response) => {
          content = response.content;
        });
    }
  });
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
  <li>
    <button
      onclick={() => {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            if (tabs[0].id != null) {
              browser.tabs.sendMessage(tabs[0].id, {
                action: "callMark",
              });
            }
          });
      }}
    >
      标记 {content}
    </button>
  </li>
</ul>

<style>
</style>
