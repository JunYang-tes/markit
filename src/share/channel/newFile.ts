import { isBackground } from "./background";

if (isBackground()) {
  browser.runtime.onConnect.addListener(port => {
    console.log("port connected:", port.name);
    if (port.name.startsWith("channel")) {
      port.onMessage.addListener(onMessage);
    }
  });
} else {
}

