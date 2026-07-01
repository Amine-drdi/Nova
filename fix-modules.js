import { readFileSync, writeFileSync } from 'fs';

const fixes = [
  {
    file: 'api/kimi/auth.ts',
    replacements: [
      {
        from: '@contracts/constants',
        to: '../../src/contracts/constants.js'
      },
      {
        from: '@contracts/errors',
        to: '../../src/contracts/errors.js'
      }
    ]
  },
  {
    file: 'api/queries/connection.ts',
    replacements: [
      {
        from: '@db/schema',
        to: '../../db/schema.js'
      },
      {
        from: '@db/relations',
        to: '../../db/relations.js'
      }
    ]
  },
  {
    file: 'api/queries/users.ts',
    replacements: [
      {
        from: '@db/schema',
        to: '../../db/schema.js'
      }
    ]
  }
];

for (const fix of fixes) {
  try {
    let content = readFileSync(fix.file, 'utf-8');
    let modified = false;
    
    for (const replacement of fix.replacements) {
      if (content.includes(replacement.from)) {
        content = content.replaceAll(replacement.from, replacement.to);
        modified = true;
        console.log(`✅ Remplaced: ${replacement.from} -> ${replacement.to}`);
      }
    }
    
    if (modified) {
      writeFileSync(fix.file, content);
      console.log(`✅ Updated: ${fix.file}`);
    } else {
      console.log(`ℹ️ No changes needed: ${fix.file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${fix.file}:`, error.message);
  }
}

console.log('✅ Done!');