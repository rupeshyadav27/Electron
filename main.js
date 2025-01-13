const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    // For debugging
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Add IPC handler for script execution
ipcMain.handle('run-script', async (event, data) => {
    console.log('Main process: Received run-script request:', data);
    
    return new Promise((resolve, reject) => {
        try {
            const pythonProcess = spawn('python', ['main.py'], {
                cwd: data.path,
                shell: true
            });

            let output = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error('Script error:', data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(output || 'Script completed successfully');
                } else {
                    reject(new Error(`Script failed with code ${code}`));
                }
            });

        } catch (error) {
            reject(error);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
