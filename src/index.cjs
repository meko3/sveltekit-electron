const { app, BrowserWindow } = require('electron');
const path = require('path');
const serve = require("electron-serve");

const loadURL = serve({directory: "."});
const port = process.env.PORT || 3001;
const isdev = !app.isPackaged || (process.env.NODE_ENV == "development");
let win;

function loadApp(port) {
    win.loadURL(`http://127.0.0.1:${port}`).catch((err) => {
      setTimeout(() => { loadApp(port); }, 200);
    });
}

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if(isdev) {
    loadApp(port);
  } else {
    loadURL(win);
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})