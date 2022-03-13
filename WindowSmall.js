const { BrowserWindow } = require('electron')

// default window settings
const defaultProps = {
  height: 480,
  width: 350,
  resizable: false,
  autoHideMenuBar: true,
  show: false,
  devTools: false,
  backgroundColor: "#66CD00",
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
}

class WindowSmall extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    // load the html and open devtools
    this.loadFile(file)
    // this.webContents.openDevTools()

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = WindowSmall
