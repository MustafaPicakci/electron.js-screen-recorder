const electron=require("electron");
const url=require("url");
const path=require("path");

const { app,BrowserWindow } = electron;

const createWindow=()=>{
    // Create the browser window.
    const mainWindow=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true,   
        }
    });

    mainWindow.loadFile(path.join(__dirname,'index.html'))

    //open the DevTools
    mainWindow.webContents.openDevTools();
}

app.on('ready',createWindow);


app.on('windows-all-closed',()=>{
   if (process.platform !== 'darwin'){
       app.quit();
   }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });