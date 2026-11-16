const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');

async function extractZip() {
  try {
    const directory = await unzipper.Open.file('MVCTD3.zip');
    
    for (const file of directory.files) {
      const fullPath = path.join(process.cwd(), file.path);
      
      if (file.type === 'Directory') {
        // Force-create the nested sub-folder structure recursively
        fs.mkdirSync(fullPath, { recursive: true });
      } else {
        // Ensure the parent directory exists before writing the nested file
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        
        // Write the file contents safely
        const content = await file.buffer();
        fs.writeFileSync(fullPath, content);
      }
    }
    console.log('✅ Success! All sub-folders and files have been extracted.');
  } catch (err) {
    console.error('❌ Error unzipping structure:', err);
  }
}

extractZip();
//call using node unzip.js