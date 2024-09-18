const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths
const frontendDir = path.join(__dirname, 'frontend');
const buildDir = path.join(frontendDir, 'build');
const rootDir = __dirname;
const nodeModulesDir = path.join(frontendDir, 'node_modules');

// Helper function to execute shell commands
function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { ...options, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${command}":\n`, stderr);
        reject(error);
      } else {
        console.log(`Command "${command}" executed successfully.`);
        resolve(stdout);
      }
    });
  });
}

(async () => {
  try {
    // Step 1: Navigate to the 'frontend' folder
    process.chdir(frontendDir);
    console.log(`Changed directory to ${frontendDir}`);

    // Step 2: Run 'npm install'
    console.log('Running npm install...');
    await runCommand('npm install');

    // Step 3: Run 'npm run build'
    console.log('Running npm run build...');
    await runCommand('npm run build');

    // Step 4: Delete 'node_modules' folder
    console.log('Deleting node_modules folder...');
    fs.rmSync(nodeModulesDir, { recursive: true, force: true });
    console.log('node_modules folder deleted.');

    // Step 5: Move 'build' folder to root directory
    console.log('Moving build folder to root directory...');
    const targetBuildDir = path.join(rootDir, 'build');
    fs.renameSync(buildDir, targetBuildDir);
    console.log('build folder moved to root directory.');

    console.log('All operations completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
