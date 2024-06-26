import { isAfter, subDays } from "date-fns";
import { getId, journalLifetime, type WebdavAccount } from "../../share/setting";
import type { DbJournal, SyncInfo } from "../../share/types";
import { dict, journal, markers, syncInfo } from "../db";
import { exportDb, importDb } from "../db/utils";
import { createClient, type FileStat, type WebDAVClient } from 'webdav'
import { noop } from "lodash-es";

async function getWebdavClient(account: WebdavAccount, ensurePath?: string) {
  const client = createClient(account.url, {
    username: account.username,
    password: account.password
  })
  if (ensurePath && !(await client.exists(ensurePath))) {
    await client.createDirectory(ensurePath)
  }
  return client
}

async function readJson(client: WebDAVClient, path: string) {
  const data = await client.getFileContents(path) as ArrayBuffer
  return JSON.parse(
    new TextDecoder().decode(data)
  )
}

export async function exportToWebdav(account: WebdavAccount) {
  const data = JSON.stringify(await exportDb());
  const client = await getWebdavClient(account, '/markit-sync')
  await client.putFileContents("/markit-sync/markit.full.json", data, {})
}

export async function importFromWebdav(account: WebdavAccount) {
  const client = createClient(account.url, {
    username: account.username,
    password: account.password
  })
  const data = (await client.getFileContents('/markit-sync/markit.full.json')) as ArrayBuffer
  const content = new TextDecoder().decode(data);
  const db = JSON.parse(content);
  await importDb(db)
  return (db?.markers?.length ?? 0) as number
}


export async function uploadJournal(account: WebdavAccount) {
  const data = await journal.toArray();
  if (data.length === 0) {
    return
  }
  const client = await getWebdavClient(account, '/markit-sync/journal')
  const id = await getId();
  const path = `/markit-sync/journal/${id}`
  const stale = await client.exists(path)
    ? (await readJson(client, path)) as Array<DbJournal>
    : [];
  const lifetime = await journalLifetime()
  const deadline = subDays(Date.now(), lifetime);
  await client.deleteFile(path);// make sure file modified date will be updated
  await client.putFileContents(path,
    JSON.stringify([...stale.filter(item => {
      return isAfter(item.date, deadline)
    })
      , ...data]))
  await journal.clear()
}
export async function syncFromJournal(account: WebdavAccount) {
  const id = await getId();
  const client = await getWebdavClient(account);
  const dir = await client.getDirectoryContents(`/markit-sync/journal/`) as FileStat[]
  const promises = [];
  for (const item of dir) {
    if (item.basename !== id // ensure this journal comes from other device
    ) {
      const info = await syncInfo.get(item.basename)
      if (info == null || item.etag == null) {
        promises.push(
          applyJournal(client, item.filename)
            .then(() => syncInfo.put({
              deviceId: item.basename,
              lastAppliedEtag: item.etag ?? '',
              lastAppliedDate: Date.now()
            }))
            .catch(e => {
              console.error(`Failed to sync ${item.filename}`, e)
            })
        )
      } else if (info.lastAppliedEtag !== item.etag) {
        // journal is updated since last sync
        promises.push(
          applyJournal(client, item.filename, info)
            .then(() => syncInfo.put({
              deviceId: item.basename,
              lastAppliedEtag: item.etag ?? '',
              lastAppliedDate: Date.now()
            }))
            .catch(e => {
              console.error(`Failed to sync ${item.filename}`, e)
            })
        )
      }
    }
  }
  await Promise.all(promises)
}
export async function deleteJournal(account:WebdavAccount,item:FileStat) {
  const client =await getWebdavClient(account)
  await client.deleteFile(item.filename)
}
async function applyJournal(client: WebDAVClient, path: string, info?: SyncInfo) {
  const stores = {
    markers,
    dict
  }
  const data = await readJson(client, path) as DbJournal[]
  if (data.length > 0) {
    const last = data[data.length - 1]
    const newJournal = info
      ? data.filter(i => i.date > info.lastAppliedDate)
      : data;
    if (newJournal.length > 0) {
      await Promise.all(newJournal.map(async i => {
        const store = stores[i.storeName as 'markers' | 'dict']
        switch (i.operation.kind) {
          case 'add':
            await store.add(i.operation.data)
              .catch(noop) // this may exists in store, just ignore it
            break
          case 'update':
            await store.put(i.operation.data)
              .catch(noop)
            break
          case 'delete':
            await store.delete(i.operation.key)
              .catch(noop)
            break
        }
      }))
    }
  }

}

export async function getJournalList(account: WebdavAccount) {
  const id = await getId();
  const client = await getWebdavClient(account);
  const dir = await client.getDirectoryContents(`/markit-sync/journal/`) as FileStat[]
  return dir
}
export async function getJournalContent(account: WebdavAccount, file: FileStat) {
  const client = await getWebdavClient(account);
  return readJson(client, file.filename)
}
