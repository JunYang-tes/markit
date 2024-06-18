import type { WebdavAccount } from "../../share/setting";
import { exportDb, importDb } from "../db/utils";
import { createClient } from 'webdav'


export async function exportToWebdav(account: WebdavAccount) {
  const data = JSON.stringify(await exportDb());
  const client = createClient(account.url, {
    username: account.username,
    password: account.password
  })
  if (!client.exists("/markit-sync")) {
    await client.createDirectory('/markit-sync')
  }
  await client.putFileContents("/markit-sync/markit.full.json", data,{})
}

export async function importFromWebdav(account:WebdavAccount) {
  const client = createClient(account.url, {
    username: account.username,
    password: account.password
  })
  const data =(await client.getFileContents('/markit-sync/markit.full.json')) as ArrayBuffer
  const content = new TextDecoder().decode(data);
  const db = JSON.parse(content);
  await importDb(db)
  return (db?.markers?.length ?? 0) as number
}
