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
});

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)).addListener,
  counterValue: (value) => ipcRenderer.send('counter-value', value),
  logIntoX: () => ipcRenderer.send('log-into-x'),

})

// ipcRenderer.on('pongFromMain', (event, arg) => {
//     console.log(arg); // Prints "Pong from main!"
// });

// Listen for 'databaseError' messages from the main process
ipcRenderer.on('db-init-problem', (event, errorMessage) => {
  // Handle the error message
  console.error('Database communication message:', errorMessage);
  // Display the error message to the user (e.g., in the UI)
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = errorMessage;
});