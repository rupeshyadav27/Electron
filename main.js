const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Track running processes
const runningProcesses = new Map();

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
}

app.whenReady().then(createWindow);

ipcMain.handle('run-script', async (event, data) => {
    console.log('Received run-script request:', data);
    
    return new Promise((resolve, reject) => {
        try {
            // Validate path exists
            if (!fs.existsSync(data.path)) {
                throw new Error(`Path does not exist: ${data.path}`);
            }

            // Kill existing process if running
            if (runningProcesses.has(data.path)) {
                const oldProcess = runningProcesses.get(data.path);
                oldProcess.kill();
                runningProcesses.delete(data.path);
            }

            // Extract python script name
            const scriptName = path.basename(data.script).replace('python ', '');
            const scriptPath = path.join(data.path, scriptName);

            // Validate script exists
            if (!fs.existsSync(scriptPath)) {
                throw new Error(`Script not found: ${scriptPath}`);
            }

            const pythonProcess = spawn('python', [scriptName], {
                cwd: data.path,
                shell: true,
                windowsHide: true
            });

            // Store reference to process
            runningProcesses.set(data.path, pythonProcess);

            let output = '';
            let errorOutput = '';
            let timeout = setTimeout(() => {
                pythonProcess.kill();
                reject(new Error('Script execution timed out (30s)'));
            }, 30000);

            pythonProcess.stdout.on('data', (data) => {
                const message = data.toString();
                console.log('Script output:', message);
                output += message;
            });

            pythonProcess.stderr.on('data', (data) => {
                const error = data.toString();
                console.error('Script error:', error);
                errorOutput += error;
            });

            pythonProcess.on('close', (code) => {
                clearTimeout(timeout);
                runningProcesses.delete(data.path);
                console.log('Process exited with code:', code);
                
                if (code === 0) {
                    resolve(output || 'Script completed successfully');
                } else {
                    reject(new Error(`Process failed (code ${code}): ${errorOutput || output}`));
                }
            });

            pythonProcess.on('error', (error) => {
                clearTimeout(timeout);
                runningProcesses.delete(data.path);
                console.error('Failed to start process:', error);
                reject(new Error(`Failed to start process: ${error.message}`));
            });

        } catch (error) {
            console.error('Error spawning process:', error);
            reject(error);
        }
    });
});

// Clean up processes on app quit
app.on('before-quit', () => {
    for (const [path, process] of runningProcesses) {
        process.kill();
    }
    runningProcesses.clear();
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