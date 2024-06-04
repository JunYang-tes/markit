import { exportDb } from "./db/utils";
import browser from 'webextension-polyfill'

export async function downloadDb() {
  const data = JSON.stringify(await exportDb());
  const blob = new Blob([new TextEncoder().encode(data)], {
    type: 'application/json'
  })
  const read = new FileReader();
  read.readAsDataURL(blob)
  read.addEventListener("load", () => {

    browser.downloads.download({
      url: read.result as string,
      filename: 'data.json'
    })
  })
}
