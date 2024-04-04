const { ipcRenderer, contextBridge } = require("electron");

// preload.js
contextBridge.exposeInMainWorld("myApi", {
    pasternak: (data) => console.log("myApi, pasternak,data: " + JSON.stringify(data)),
    ping: () => ipcRenderer.invoke('ping')
});