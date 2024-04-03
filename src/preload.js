// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require("electron");

ipcRenderer.on('nothing-surprises-me', () => {

});

contextBridge.exposeInMainWorld("pedro", {
    pasternak: (data) => console.log("pedro, pasternak,data: " + JSON.stringify(data)),
});