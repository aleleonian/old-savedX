// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require("electron");

// ipcMain.on('pingFromRenderer', (event, arg) => {
//     // Respond to the message
//     event.sender.send('pongFromMain', 'Pong from main!');
// });

contextBridge.exposeInMainWorld("myApi", {
    pasternak: (data) => console.log("myApi, pasternak,data: " + JSON.stringify(data)),
    ping: () => ipcRenderer.invoke('ping')
}
);

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)).addListener,
  counterValue: (value) => ipcRenderer.send('counter-value', value)

})

// ipcRenderer.on('pongFromMain', (event, arg) => {
//     console.log(arg); // Prints "Pong from main!"
// });