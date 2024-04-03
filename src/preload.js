// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("myApi", {
    pasternak: (data) => console.log("myApi, pasternak,data: " + JSON.stringify(data)),
    ping: () => ipcRenderer.invoke('ping')
}
);