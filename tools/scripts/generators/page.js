#!/usr/bin/env node

/**
 * Page Generator for Enterprise React Starter
 * 
 * Usage: node tools/scripts/generators/page.js PageName
 */

const fs = require('fs');
const path = require('path');

const pageName = process.argv[2];

if (!pageName) {
  console.error('❌ Please provide a page name');
  console.log('Usage: node tools/scripts/generators/page.js PageName');
  process.exit(1);
}

const pagesDir = path.join(__dirname, '../../../apps/web/src/pages');
const pageFile = path.join(pagesDir, `${pageName}.tsx`);

const template = `import { logger } from '@company/utils';

const ${pageName} = () => {
  logger.info('${pageName} page mounted', {
    component: '${pageName}',
    action: 'page_mount'
  });

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-enterprise-primary to-enterprise-secondary bg-clip-text text-transparent">
            ${pageName}
          </h1>
          
          <div className="bg-card rounded-xl shadow-elegant border border-border p-8">
            <p className="text-muted-foreground">
              Welcome to the ${pageName} page. This page was generated using the enterprise React starter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${pageName};
`;

// Create pages directory if it doesn't exist
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// Write page file
fs.writeFileSync(pageFile, template);

console.log(`✅ Generated page: ${pageName}`);
console.log(`📁 Location: ${pageFile}`);
console.log(`💡 Add route to apps/web/src/App.tsx:`);
console.log(`   <Route path="/${pageName.toLowerCase()}" element={<${pageName} />} />`);
console.log(`💡 Don't forget to import: import ${pageName} from './pages/${pageName}';`);