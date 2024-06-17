import type { WebdavAccount } from "../../share/setting";
import { exportDb } from "../db/utils";
import { createClient } from 'webdav'


export async function exportToWebdav(account: WebdavAccount) {
  const data = JSON.stringify(await exportDb());
  const client = createClient(account.url, {
    username: account.username,
    password: account.password
  })
  await client.putFileContents("markit.full.json", data)
}
