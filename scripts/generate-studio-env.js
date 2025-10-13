#!/usr/bin/env node
/**
 * Wrapper script that loads .env and auto-generates SANITY_STUDIO_* variables
 * Usage: node scripts/generate-studio-env.js -- sanity dev
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load dotenv manually
const rootEnvPath = path.join(__dirname, '../.env');

if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (!match) return;
    
    const [, key, value] = match;
    process.env[key] = value;
    
    // Auto-generate SANITY_STUDIO_* from base variables
    if (key === 'SANITY_PROJECT_ID') {
      process.env.SANITY_STUDIO_PROJECT_ID = value;
    } else if (key === 'SANITY_DATASET') {
      process.env.SANITY_STUDIO_DATASET = value;
    }
  });
}

// Auto-generate SANITY_STUDIO_* if they don't exist but base vars do
if (!process.env.SANITY_STUDIO_PROJECT_ID && process.env.SANITY_PROJECT_ID) {
  process.env.SANITY_STUDIO_PROJECT_ID = process.env.SANITY_PROJECT_ID;
}
if (!process.env.SANITY_STUDIO_DATASET && process.env.SANITY_DATASET) {
  process.env.SANITY_STUDIO_DATASET = process.env.SANITY_DATASET;
}

// Get the command to run (everything after --)
const dashIndex = process.argv.indexOf('--');
const command = dashIndex !== -1 ? process.argv.slice(dashIndex + 1) : process.argv.slice(2);

if (command.length === 0) {
  console.error('Usage: node scripts/generate-studio-env.js -- <command>');
  process.exit(1);
}

// Run the command with the augmented environment
const child = spawn(command[0], command.slice(1), {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
