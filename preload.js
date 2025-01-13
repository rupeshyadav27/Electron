const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openTerminal: () => ipcRenderer.invoke('open-terminal')
});