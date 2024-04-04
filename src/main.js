const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { goFetch } = require("./puppie");

const basePath = app.getAppPath();
// const {menuTemplate} = require("./data/menu-template");
let mainWindow;
let db;

const menuTemplate = [
  {
    "label": "File",
    "submenu": [
      {
        "label": "New",
        "accelerator": "CmdOrCtrl+N",
        "click": "Handle 'New' action"
      },
      {
        "label": "Open",
        "accelerator": "CmdOrCtrl+O",
        "click": "Handle 'Open' action"
      },
      { "type": "separator" },
      { "label": "Exit", "role": "quit" }
    ]
  },
  {
    "label": "Config",
    "submenu": [
      { "label": "Undo", "accelerator": "CmdOrCtrl+Z", "role": "undo" },
      { "label": "Redo", "accelerator": "Shift+CmdOrCtrl+Z", "role": "redo" },
      { "type": "separator" },
      { "label": "Cut", "accelerator": "CmdOrCtrl+X", "role": "cut" },
      { "label": "Copy", "accelerator": "CmdOrCtrl+C", "role": "copy" },
      { "label": "Paste", "accelerator": "CmdOrCtrl+V", "role": "paste" }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Dialog',
        click: () => {
          // Show a dialog when the "Open Dialog" menu item is clicked
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Dialog',
            message: 'This is a dialog!',
            buttons: ['OK']
          });
        }
      },
      { type: 'separator' },
      { role: 'quit' } // Add a Quit menu item
    ]
  },
  {
    label: 'Open Dialog',
    click: () => {
      // Show a dialog when the "Open Dialog" menu item is clicked
      const dialogWindow = new BrowserWindow({
        width: 600,
        height: 400,
        modal: true, // Make the dialog modal
        parent: mainWindow, // Set the main window as the parent
        webPreferences: {
          nodeIntegration: true, // Enable Node.js integration in the dialog window
          preload: path.resolve(basePath, './src/dialogPreload.js') // Specify the preload script
        }
      });

      dialogWindow.webContents.openDevTools();
      // Load an HTML file or URL into the dialog window
      // dialogWindow.loadURL('https://www.google.com');
      dialogWindow.loadURL('file://' + path.resolve(basePath, './src/files/login.html'));
    }
  },
  {
    label: "mainToRenderer",
    submenu: [
      {
        click: () => mainWindow.webContents.send('update-counter', 1),
        label: 'Increment'
      },
      {
        click: () => mainWindow.webContents.send('update-counter', -1),
        label: 'Decrement'
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const init = () => {
  try {
    // Check if the file exists
    const dbPath = path.resolve(basePath, './src/data/savedx.db');
    fs.accessSync(dbPath, fs.constants.F_OK);
    return new sqlite3.Database(dbPath);
    // File exists, you can open it here
  } catch (err) {
    // File doesn't exist, handle the error
    console.error('File does not exist:', err);
  }
  return db;
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // preload:  path.resolve(basePath, './src/preload.js'),
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));
  // mainWindow.loadFile(path.resolve(basePath, './src/files/index.html'));
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow();
  db = init();
  if (!db) {
    mainWindow.webContents.send('db-init-problem', 'db file does not exist');
  }
  else {
    mainWindow.webContents.send('db-init-problem', 'db file DOES exist!');
  }
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('set-title', (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
})
ipcMain.on('form-data', (event, data) => {
  const webContents = event.sender;
  console.log("we got data from the form! ", JSON.stringify(data));
})
ipcMain.on('log-into-x', async (event, data) => {
  const webContents = event.sender;
  console.log("ready to log into X!");
  let result = await goFetch();
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
