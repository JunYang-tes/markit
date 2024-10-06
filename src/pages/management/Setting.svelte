<script lang="ts">
  import { createClient } from "webdav";
  import browser from "webextension-polyfill";
  import {
    getWebdavAccount,
    saveWebdavAccount,
    isAutoSyncEnabled,
    setIsAutoSyncEnabled,
    getMinSyncInterval,
    setMinSyncInterval,
    journalLifetime,
    setJournalLifetime,
  } from "../../share/setting";
  import { marker } from "../../content/marker";
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
      if (autoSyncEnabled) {
        marker.runSync();
      }
    }
  });
  let minSyncInterval = $state(0);
  getMinSyncInterval().then((min) => {
    minSyncInterval = min;
  });
  $effect(() => {
    if (minSyncInterval !== 0) {
      setMinSyncInterval(minSyncInterval);
    }
  });

  let journalLifetimeDays = $state(0);
  journalLifetime().then((days) => {
    journalLifetimeDays = days;
  });
  $effect(() => {
    if (journalLifetimeDays !== 0) {
      setJournalLifetime(journalLifetimeDays);
    }
  });
</script>

<div>
  <section>
    <h3 class="title is-4">Webdav 设置</h3>
    <div class="field">
      <div class="label">服务器地址</div>
      <input class="input is-primary" placeholder="服务器地址" bind:value={url} />
    </div>
    <div class="field">
      <div class="label">用户名</div>
      <input class="input is-primary" placeholder="用户名" bind:value={username} />
    </div>
    <div class="field">
      <div class="label">密码</div>
      <input
        class="input"
        type="password"
        placeholder="密码"
        bind:value={password}
      />
    </div>
    <button class="button" onclick={checkThenSave}> 确定 </button>
    {#if checkValidation.kind === "validating"}
      <div class="help">Checking</div>
    {/if}
    {#if checkValidation.kind === "invalid"}
      <div class="help error">{checkValidation.message}</div>
    {/if}
  </section>
  <section>
    <h3 class="title is-4">同步设置</h3>
    {#if autoSyncEnabled != null}
      <div class="field">
        <label class="checkbox">
          自动同步
          <input type="checkbox" bind:checked={autoSyncEnabled} />
        </label>
      </div>
    {/if}
    <div class="field">
      <div class="label">最小同步间隔（分钟）</div>
      <input class="input is-primary" type="number" bind:value={minSyncInterval} />
    </div>
    <div class="field">
      <div class="label">日志保留时长(天)</div>
      <input class="input is-primary" type="number" bind:value={journalLifetimeDays} />
    </div>
  </section>
</div>

<style>
  section {
    margin-block: var(--markit-space-m);
  }
  .is-primary.input {
    --bulma-input-border-l:87%;
  }
</style>
