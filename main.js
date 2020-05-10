const electron = require("electron");
const url = require("url");
const path = require("path");

const{app, BrowserWindow, Menu} = electron;

//SET ENV
//process.env.NODE_ENV = 'production';

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

//Handle create add window
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
                label:'About'
            }
        ]
    }
];