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
