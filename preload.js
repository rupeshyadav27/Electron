const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld('electron', {
    runPythonScript: () => ipcRenderer.invoke('run-python-script'),
});
