import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function fixImports(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  
  // Ajouter .js aux imports relatifs
  content = content.replace(
    /from\s+['"](\.[^'"]+)['"]/g,
    (match, path) => {
      if (!path.endsWith('.js') && !path.endsWith('.ts') && !path.includes('@')) {
        return `from '${path}.js'`;
      }
      return match;
    }
  );
  
  writeFileSync(filePath, content);
  console.log(`✅ Fixed: ${filePath}`);
}

function walkDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist'].includes(file)) {
        walkDir(fullPath);
      }
    } else if (file.endsWith('.ts')) {
      fixImports(fullPath);
    }
  }
}

walkDir('api');