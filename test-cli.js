#!/usr/bin/env node

// Simple test to verify CLI option parsing
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing CLI option parsing...\n');

// Test 1: Help command
console.log('1. Testing --help:');
const helpTest = spawn('node', ['dist/index.js', '--help'], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'pipe']
});

helpTest.stdout.on('data', (data) => {
  console.log(data.toString());
});

helpTest.stderr.on('data', (data) => {
  console.error(data.toString());
});

helpTest.on('close', (code) => {
  console.log(`Help test completed with code: ${code}\n`);
  
  // Test 2: Options parsing test (this will fail due to missing credentials, but we can see if options parse correctly)
  console.log('2. Testing option parsing (expect authentication error):');
  const optionTest = spawn('node', ['dist/index.js', 
    '-p', 'test-project',
    '-c', '5',
    '-d', '30', 
    '-b', '1.0.0',
    '-l'
  ], {
    cwd: __dirname,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  optionTest.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  optionTest.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  optionTest.on('close', (code) => {
    console.log(`Option parsing test completed with code: ${code}`);
    console.log('If you see authentication error, that means option parsing worked correctly!');
  });
});
