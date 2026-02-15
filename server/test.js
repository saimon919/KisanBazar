console.log('Diagnostic test: Node is running correctly.');
console.log('Current Directory:', process.cwd());
const fs = require('fs');
console.log('Files in current directory:', fs.readdirSync('.'));
