<script lang="ts">
  import { createClient } from "webdav";
  import browser from "webextension-polyfill";
  import {
    getWebdavAccount,
    saveWebdavAccount,
    isAutoSyncEnabled,
    setIsAutoSyncEnabled,
  } from "../../share/setting";
  import Sync from "./Sync.svelte";
  let url = $state("");
  let username = $state("");
  let password = $state("");
  let checkValidation = $state<
    | { kind: "idal" }
    | { kind: "invalid"; message: string }
    | { kind: "validating" }
    | { kind: "pass" }
  >({ kind: "idal" });
  getWebdavAccount().then((account) => {
    if (account) {
      url = account.url;
      username = account.username;
      password = account.password;
    }
  });

  async function checkThenSave() {
    if (await checkValid(url, username, password)) {
      saveWebdavAccount({ url, username, password });
    }
  }
  async function checkValid(url: string, username: string, password: string) {
    checkValidation = { kind: "validating" };
    const client = createClient(url, { username, password });
    try {
      await client.getDirectoryContents("/");
      checkValidation = {
        kind: "pass",
      };
      return true;
    } catch (err: any) {
      console.log(err);
      let message = (err as any).message;
      if (err.status == 401) {
        message = "用户名和密码是否正确？";
      }
      checkValidation = {
        kind: "invalid",
        message,
      };
      return false;
    }
  }

  let autoSyncEnabled = $state(null as null | boolean);
  isAutoSyncEnabled().then((enabled) => {
    autoSyncEnabled = enabled;
  });
  $effect(() => {
    if (autoSyncEnabled != null) {
      setIsAutoSyncEnabled(autoSyncEnabled);
    }
  });
</script>

<div>
  <section>
    <div> Webdav 设置 </div>
    <div>
      <input placeholder="服务器地址" bind:value={url} />
    </div>
    <div>
      <input placeholder="用户名" bind:value={username} />
    </div>
    <div>
      <input type="password" placeholder="密码" bind:value={password} />
    </div>
    <button onclick={checkThenSave}> 确定 </button>
    {#if checkValidation.kind === "validating"}
      <div>Checking</div>
    {/if}
    {#if checkValidation.kind === "invalid"}
      <div>{checkValidation.message}</div>
    {/if}
  </section>
  <section>
    <div>同步设置</div>
    {#if autoSyncEnabled != null}
      <input type="checkbox" bind:checked={autoSyncEnabled} />
    {/if}
  </section>
</div>
