#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Bundle all TypeScript files from src folder into a single file
 * with file names as separators
 */

const SRC_DIR = path.join(__dirname, '..', 'src');
const OUTPUT_FILE = path.join(__dirname, '..', 'bundled-code.txt');

/**
 * Recursively get all TypeScript files from a directory
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulated file list
 * @returns {string[]} - List of file paths
 */
function getAllTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Create a bundle of all TypeScript files
 */
function createBundle() {
  console.log('Starting bundle process...');
  console.log(`Source directory: ${SRC_DIR}`);
  console.log(`Output file: ${OUTPUT_FILE}`);

  // Get all TypeScript files
  const files = getAllTypeScriptFiles(SRC_DIR);
  
  if (files.length === 0) {
    console.error('No TypeScript files found in src directory');
    process.exit(1);
  }

  console.log(`Found ${files.length} TypeScript files`);

  // Create bundle content
  let bundleContent = '';
  bundleContent += '='.repeat(80) + '\n';
  bundleContent += 'BUNDLED CODE - All TypeScript files from src folder\n';
  bundleContent += `Generated at: ${new Date().toISOString()}\n`;
  bundleContent += `Total files: ${files.length}\n`;
  bundleContent += '='.repeat(80) + '\n\n';

  // Sort files for consistent output
  files.sort();

  files.forEach((filePath, index) => {
    const relativePath = path.relative(SRC_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    bundleContent += '\n';
    bundleContent += '/' + '='.repeat(78) + '\\\n';
    bundleContent += `| File ${index + 1}/${files.length}: ${relativePath}\n`;
    bundleContent += '\\' + '='.repeat(78) + '/\n';
    bundleContent += '\n';
    bundleContent += content;
    bundleContent += '\n';
  });

  bundleContent += '\n';
  bundleContent += '='.repeat(80) + '\n';
  bundleContent += 'END OF BUNDLE\n';
  bundleContent += '='.repeat(80) + '\n';

  // Write bundle to file
  fs.writeFileSync(OUTPUT_FILE, bundleContent, 'utf-8');

  console.log(`\nBundle created successfully!`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`Total size: ${(bundleContent.length / 1024).toFixed(2)} KB`);
}

// Run the bundle process
try {
  createBundle();
} catch (error) {
  console.error('Error creating bundle:', error);
  process.exit(1);
}
