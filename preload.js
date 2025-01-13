const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    runScript: async (data) => {
        console.log('preload: runScript called with:', data);
        // Validate input data
        if (!data || !data.path || !data.script) {
            throw new Error('Invalid script parameters');
        }

        try {
            const result = await ipcRenderer.invoke('run-script', data);
            if (!result) {
                throw new Error('No output received from script');
            }
            console.log('preload: runScript result:', result);
            return result;
        } catch (error) {
            console.error('preload: runScript error:', error);
            throw error;
        }
    }
});