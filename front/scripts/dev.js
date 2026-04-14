/**
 * Discover Karabakh - Unified Dev Orchestrator
 * This script runs all 3 apps synchronously but only shows the main entry point (Port 5174).
 */
const { spawn, execSync } = require('child_process');
const path = require('path');

const apps = [
  { name: 'web',    command: 'npm run dev:web',    port: 5174, master: true },
  { name: 'vendor', command: 'npm run dev:vendor', port: 5175, master: false },
  { name: 'admin',  command: 'npm run dev:admin',  port: 5176, master: false },
];

function killOnPort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = output.split('\n').filter(line => line.includes('LISTENING'));
      lines.forEach(line => {
        const pid = line.trim().split(/\s+/).pop();
        if (pid) execSync(`taskkill /F /PID ${pid}`);
      });
    } else {
      execSync(`lsof -t -i:${port} | xargs kill -9`);
    }
  } catch (e) {
    // Port not in use, ignore
  }
}

console.log('\x1b[36m%s\x1b[0m', '➜ Discover Karabakh - Vahid İnkişaf Mühiti rəsimləşdirilir...\n');

// Clean ports
apps.forEach(app => killOnPort(app.port));

// Start sub-apps in background
apps.filter(app => !app.master).forEach(app => {
  const child = spawn(app.command, { 
    shell: true, 
    stdio: 'ignore' // This should keep it in the same window on Windows
  });
});

// Start master app and pipe output
const master = apps.find(app => app.master);
const web = spawn(master.command, { shell: true, stdio: 'inherit' });

web.on('exit', () => {
  console.log('\n\x1b[31m%s\x1b[0m', '➜ Dev mühiti dayandırıldı.');
  process.exit();
});

// Help the user understand what happened
setTimeout(() => {
  console.log('\n\x1b[32m%s\x1b[0m', '➜ Bütün tətbiqlər arxa fonda işləyir.');
  console.log('\x1b[33m%s\x1b[0m', '➜ Əsas Giriş: http://localhost:5174/');
  console.log('\x1b[33m%s\x1b[0m', '➜ Vendor:     http://localhost:5174/vendor/');
  console.log('\x1b[33m%s\x1b[0m', '➜ Admin:      http://localhost:5174/admin/');
  console.log('\x1b[90m%s\x1b[0m', '(Siz yalnız Web loqlarını görürsünüz, qalanları səssiz işləyir)\n');
}, 3000);
