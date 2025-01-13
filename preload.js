const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    runScript: (data) => {
        console.log('Preload: Calling runScript with:', data);
        return ipcRenderer.invoke('run-script', data);
    }
});