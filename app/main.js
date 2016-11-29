var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var app = electron.app;
var ipc = electron.ipcMain;

function toggleWindow(whichWindow) {
  if (whichWindow.isVisible()) {
    whichWindow.hide();
  } else {
    whichWindow.show();
  }
}

app.on('ready', function() {
  var appWindow, infoWindow, allJobsWindow;
  appWindow = new BrowserWindow({
    width: 1920,
    width: 1080,
    show: false
  }); //appWindow

  appWindow.loadURL('file://' + __dirname + '/index.html');

  infoWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    show: false,
    frame: false
  }); //infoWindow

  infoWindow.loadURL('file://' + __dirname + '/info.html');

  allJobsWindow = new BrowserWindow({
    width: 1920,
    width: 1080,
    show: false
  }); //allJobsWindow
  allJobsWindow.setMenu(null);

  allJobsWindow.loadURL('file://' + __dirname + '/allJobs.html');

  allJobsWindow.once('ready-to-show', function() {
    allJobsWindow.show();
  }); //ready-to-show

  appWindow.once('ready-to-show', function() {
    appWindow.show();
  }); //ready-to-show

  ipc.on('updatedJobsData', function(event, arg){
    allJobsWindow.reload();
    event.returnValue='';
    // appWindow.reload();
  }); //updatedData

  ipc.on('updatedCompletedData', function(event, arg){
    // allJobsWindow.reload();
    // event.returnValue='';
    // appWindow.reload ();
  }); //updatedData

  ipc.on('openAllJobsWindow', function(event, arg){
    if (!allJobsWindow.isVisible()) allJobsWindow.show();
  });//Open allJobsWindow if not open

  ipc.on('openInfoWindow', function(event, arg){
    event.returnValue='';
    infoWindow.show();
  }); //OpenInfoWindow

  ipc.on('closeInfoWindow', function(event, arg){
    event.returnValue='';
    infoWindow.hide();
  }); //closeInfoWindow


}); //app is ready
