const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openTerminal: (data) => ipcRenderer.invoke('open-terminal', data)
});