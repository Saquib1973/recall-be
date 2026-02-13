const fs = require('fs');
const path = require('path');

// Configuration
const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'code_bundle.txt');

// Only bundle these file types
const allowedExtensions = ['.ts', '.js', '.json']; 

let bundledContent = '';

function bundleFiles(directory) {
    // Read all items in the current directory
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively read subdirectories (e.g., controllers, routes)
            bundleFiles(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(item);
            
            // Check if it's a file type we want to include
            if (allowedExtensions.includes(ext)) {
                // Get the relative path to print as the file name header
                const relativePath = path.relative(__dirname, fullPath);
                
                // Read the file's content
                const fileContent = fs.readFileSync(fullPath, 'utf8');

                // Format the output with clear separators and file names
                bundledContent += `\n\n// ==========================================\n`;
                bundledContent += `// File: ${relativePath}\n`;
                bundledContent += `// ==========================================\n\n`;
                bundledContent += fileContent;
            }
        }
    }
}

try {
    // Start fresh by removing the old bundle if it exists
    if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile); 
    }
    
    console.log('Bundling files from src folder...');
    bundleFiles(srcDir);
    
    // Write the compiled string to our output file
    fs.writeFileSync(outputFile, bundledContent.trim(), 'utf8');
    
    console.log(`✅ Successfully bundled all files into: ${outputFile}`);
} catch (error) {
    console.error('❌ Error bundling files:', error);
}