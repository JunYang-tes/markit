import { getWebdavAccount, isAutoSyncEnabled, getMinSyncInterval } from "../../share/setting"
import { syncFromJournal, uploadJournal } from "./im-export"

const state = {
  lastSyncTime: 0
}

export async function run() {
  const enabled = await isAutoSyncEnabled()
  const account = await getWebdavAccount()
  if (!enabled || !account) {
    return
  }
  const escapedTime = Date.now() - state.lastSyncTime
  const minSyncTimeInterval = await getMinSyncInterval()
  console.log("last Sync:", state.lastSyncTime)
  console.log("Escaped time", escapedTime)
  if (escapedTime > minSyncTimeInterval) {
    console.log("Will sync")
    await uploadJournal(account)
      .catch(e => console.error("Failed to upload journal", e))
    await syncFromJournal(account)
      .catch(e => console.error("Failed to apply journal", e))
    state.lastSyncTime = Date.now()
  }
}
