// const { ipcRenderer } = require("electron");

// ipcRenderer.on('pongFromMain', (event, arg) => {
//   console.log(arg); // Prints "Pong from main!"
// });

const func = async () => {
  const response = await window.myApi.ping();
  console.log(response) // prints out 'pong'
  window.electronAPI.setTitle("SavedX: Twitter Bookmark Manager")
}



func()

const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue.toString()
  window.electronAPI.counterValue(newValue)
})