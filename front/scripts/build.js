/**
 * Discover Karabakh - Unified Build Orchestrator
 * This script builds all 3 apps and organizes them into a single dist folder.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Define apps and their workspaces
const apps = [
  { name: 'web',    workspace: 'web',    outDirRelative: '.' },
  { name: 'vendor', workspace: 'vendor', outDirRelative: 'vendor' },
  { name: 'admin',  workspace: 'admin',  outDirRelative: 'admin' },
];

function runBuild(app) {
  console.log(`\n\x1b[36m➜ Building ${app.name}...\x1b[0m`);
  
  // Build to its own directory
  const targetDir = path.join(distDir, app.outDirRelative);
  
  // Ensure target directory exists if it's sub-path
  if (app.outDirRelative !== '.') {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Use Vite's --outDir to specify exactly where to puts files
  // Note: we use path.relative because Vite expects paths relative to the project root
  const outPath = path.resolve(distDir, app.outDirRelative);
  
  try {
    execSync(`npm run build --workspace=${app.workspace} -- --outDir ${outPath} --emptyOutDir`, {
      stdio: 'inherit',
      cwd: rootDir
    });
    console.log(`\x1b[32m✔ ${app.name} build complete.\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✘ ${app.name} build failed.\x1b[0m`);
    process.exit(1);
  }
}

// Main execution
console.log('\x1b[35m%s\x1b[0m', '➜ Discover Karabakh - Prodakşn üçün "build" emalı başlayır...\n');

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Build each app
// Note: order matters, web should be built first if it builds to root
runBuild(apps[0]); // web
runBuild(apps[1]); // vendor
runBuild(apps[2]); // admin

console.log('\n\x1b[32m%s\x1b[0m', '➜ Bütün tətbiqlər build olundu və "front/dist" qovluğunda toplandı!');
console.log('➜ Artıq backend bu qovluğu static olaraq serve edə bilər.\n');
