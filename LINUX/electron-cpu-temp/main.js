const electron = require("electron");
const url = require("url");
const path = require("path");
const si = require('systeminformation');

//CPU temp
const osxTemp = require('osx-temperature-sensor');

let temperature = osxTemp.cpuTemperature();
console.log('CPU-Information: ' + temperature);


const{app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
//let addWindow;
//Listen for app to be ready
app.on('ready', function() {
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true
        }
    }
 );
    //Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    //Exit app when main window closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle create about window
function createAboutWindow(){
    //create new window
    aboutWindow = new BrowserWindow({
        width: 640,
        height:480,
        webPreferences: {
            nodeIntegration:true
        },
        title:'About This Application'
    });
    //Load html file into window
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'aboutWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // Garbage collection handle
    aboutWindow.on('close', function(){
        addWindow = null;
    });
   }

//Catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    aboutWindow.close();
});

const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {
                label:'About',
                click(){
                    createAboutWindow();
                }
            },
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'Reload'

            }
        ]
    }
];