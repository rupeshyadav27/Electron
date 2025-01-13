const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    runScript: (data) => ipcRenderer.invoke('run-script', data)
});