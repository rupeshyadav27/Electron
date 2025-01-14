// Initial content load
document.addEventListener('DOMContentLoaded', () => {
    loadContent('code');
});

// Content loading function
function loadContent(section) {
    const mainContent = document.getElementById('mainContent');
    
    // Update button states
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');

    if (section === 'code') {
        mainContent.innerHTML = `
            <div id="code-section" class="content-section active">
                <div class="buttons-grid">
                    <button class="run-button" onclick="runScript(1)">Machine 1</button>
                    <button class="run-button" onclick="runScript(2)">Machine 2</button>
                    <button class="run-button" onclick="runScript(3)">Machine 3</button>
                    <button class="run-button" onclick="runScript(4)">Machine 4</button>
                    <button class="run-button" onclick="runScript(5)">Machine 5</button>
                    <button class="run-button" onclick="runScript(6)">Machine 6</button>
                    <button class="run-button" onclick="runScript(7)">Machine 7</button>
                    <button class="run-button" onclick="runScript(8)">Machine 8</button>
                    <button class="run-button" onclick="runScript(9)">Machine 9</button>
                </div>
            </div>`;
    } else if (section === 'camera') {
        mainContent.innerHTML = `
            <div id="camera-section" class="content-section active">
                <h1>Camera</h1>
                <p>Camera functionality will be implemented here.</p>
            </div>`;
    }
}

async function runScript(machineNumber) {
    try {
        await window.electron.runPythonScript();
        console.log(`Machine ${machineNumber} script executed`);
    } catch (error) {
        console.error(`Error running machine ${machineNumber}:`, error);
    }
}