import browser from "webextension-polyfill";
import './background/db'
import { domParser } from './background/dom-parser'
import { makeChannel } from "./share/channel";
import {init} from './background/marker'
import { installSyllable } from "./background/install/syllable";
import {run as runAutoSync} from './background/sync/auto-sync'
init()
runAutoSync()

browser.runtime.onStartup.addListener(() => {
  console.log("onStartup()")
})

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
  installSyllable()
});

