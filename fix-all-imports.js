import { readFileSync, writeFileSync } from 'fs';

const fixes = [
  {
    file: 'api/context.ts',
    replacements: [
      { from: '@db/schema', to: '../db/schema.js' }
    ]
  },
  {
    file: 'api/client-router.ts',
    replacements: [
      { from: '@/../db/schema', to: '../db/schema.js' }
    ]
  },
  {
    file: 'api/seo-task-router.ts',
    replacements: [
      { from: '@/../db/schema', to: '../db/schema.js' }
    ]
  },
  {
    file: 'api/keyword-router.ts',
    replacements: [
      { from: '@/../db/schema', to: '../db/schema.js' }
    ]
  },
  {
    file: 'api/page-seo-router.ts',
    replacements: [
      { from: '@/../db/schema', to: '../db/schema.js' }
    ]
  },
  {
    file: 'api/mission-router.ts',
    replacements: [
      { from: '@/../db/schema', to: '../db/schema.js' }
    ]
  },
  {
    file: 'api/backlink-router.ts',
    replacements: [
      { from: '@/../db/schema', to: '../db/schema.js' }
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
        console.log(`✅ Replaced: ${replacement.from} -> ${replacement.to} in ${fix.file}`);
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