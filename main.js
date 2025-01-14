const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Handle Python script execution
ipcMain.handle('run-python-script', async (event) => {
    const pythonPath = 'C:/Users/Rupesh/AppData/Local/Programs/Python/Python313/python.exe';
    const scriptPath = 'c:/Users/Rupesh/python/main.py';
    
    console.log(`Running script: ${scriptPath} with Python: ${pythonPath}`);
    
    return new Promise((resolve, reject) => {
        const command = `"${pythonPath}" "${scriptPath}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution failed: ${stderr || error.message}`);
                reject(`Error: ${stderr || error.message}`);
                return;
            }
            console.log(`Execution output: ${stdout}`);
            resolve(stdout || 'Script executed successfully');
        });
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