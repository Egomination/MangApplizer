const electron = require('electron'),
    url = require('url'),
    path = require('path'),
    { app, BrowserWindow, Menu, dialog, ipcMain, webContents } = electron;

// SET ENVIRONMENT FOR DEV TOOLS
process.env.NODE_ENV = 'dev';

let mainWin;
let nwin;

// Creation
// It creates a main window from mainWin html.
app.on('ready', function() {
    mainWin = new BrowserWindow({
        width: 1200,
        height: 800
    });
    //Load html for the view.
    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true //This is just passing the path.
    }));

    // Quit app when the main window is closed!
    mainWin.on('closed', function() {
        app.quit();
    });

    // Build from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemp);
    // Inserting the menu: Files, Options View kinda thing
    Menu.setApplicationMenu(mainMenu)
});

/*
// For logging the errors in the program
electron.dialog.showErrorBox = (title, content) => {
    console.log(`${title}\n${content}`);
};*/

// Creating the menu template
const mainMenuTemp = [{
    label: 'File',
    submenu: [{
        label: 'Quit!',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', // If it's mac platform name is darwin, win win32, linux same.
        click() {
            app.quit();
        }
    }],
}, ];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemp.unshift({}); //Unshift adds item begining of the array.
}

// Event for opening viewer
ipcMain.on('open-viewer', (event, fileName, data) => {
    nwin = new BrowserWindow({
        width: 1600,
        height: 1200
    });
    console.log("data is:" + data);
    nwin.loadURL(`file://${__dirname}/src/components/` + fileName + `.html`);
    nwin.webContents.on('dom-ready', function() {
        nwin.webContents.send('send-to-viewer', data);
        nwin.show();
    });
})

// Add dev tools
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemp.push({
        label: 'Dev Tools',
        submenu: [{
                label: 'Toggle Dev tool on',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}