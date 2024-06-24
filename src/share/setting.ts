import { nanoid } from "nanoid";
import browser from "webextension-polyfill";
export type WebdavAccount = {
  url: string,
  username: string,
  password: string
}

export async function getWebdavAccount() {
  const data = await browser.storage.sync.get("webdav")
  if (data.webdav) {
    return data.webdav as WebdavAccount
  }
  return null
}

export async function saveWebdavAccount(data: WebdavAccount) {
  browser.storage.sync.set({
    webdav: data
  })
}

export async function getId() {
  let id = (await browser.storage.local.get("id"))?.id
  if (id) {
    return id
  } else {
    id = nanoid();
    await browser.storage.local.set({ id })
    return id
  }
}

/*how many days journals will be keep
 * */
export async function journalLifetime() {
  const life = await browser.storage.sync.get("journalLifetime")
  if (life.journalLifetime) {
    return life.journalLifetime
  }
  return 7
}

export async function isAutoSyncEnabled() {
  return (await browser.storage.sync.get("autoSync")).autoSync as boolean ?? false
}
export async function setIsAutoSyncEnabled(enabled: boolean) {
  await browser.storage.sync.set({ autoSync: enabled })
}
/**
 * Unit minutes
 * */
export async function minSyncInterval() {
  return (await browser.storage.sync.get("minSyncInterval")).minSyncInterval as number ?? 3600
}
export async function setMinSyncInterval(min: number) {
  await browser.storage.sync.set({ minSyncInterval: min })
}

