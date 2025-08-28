#!/usr/bin/env node

/**
 * Hook Generator for Enterprise React Starter
 * 
 * Usage: node tools/scripts/generators/hook.js hookName
 */

const fs = require('fs');
const path = require('path');

const hookName = process.argv[2];

if (!hookName) {
  console.error('❌ Please provide a hook name (without "use" prefix)');
  console.log('Usage: node tools/scripts/generators/hook.js hookName');
  console.log('Example: node tools/scripts/generators/hook.js LocalStorage');
  process.exit(1);
}

// Ensure hook name starts with lowercase for file naming
const fileName = hookName.charAt(0).toLowerCase() + hookName.slice(1);
const hookNamePascal = hookName.charAt(0).toUpperCase() + hookName.slice(1);

const hooksDir = path.join(__dirname, '../../../apps/web/src/hooks');
const hookFile = path.join(hooksDir, `use${hookNamePascal}.tsx`);

const template = `import { useState, useEffect } from 'react';
import { logger } from '@company/utils';

export interface Use${hookNamePascal}Options {
  // Add configuration options here
  enabled?: boolean;
}

export interface ${hookNamePascal}State {
  // Define your state interface here
  data: any;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for ${hookName.toLowerCase()} functionality
 * 
 * @param options - Configuration options
 * @returns ${hookName} state and handlers
 */
export const use${hookNamePascal} = (options: Use${hookNamePascal}Options = {}) => {
  const { enabled = true } = options;

  const [state, setState] = useState<${hookNamePascal}State>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;

    logger.debug('use${hookNamePascal} hook initialized', {
      hook: 'use${hookNamePascal}',
      options
    });

    // Your hook logic here
    setState(prev => ({ ...prev, loading: true }));

    // Example async operation
    const handleOperation = async () => {
      try {
        // Replace with your actual logic
        const result = await Promise.resolve('Hello from use${hookNamePascal}!');
        
        setState(prev => ({
          ...prev,
          data: result,
          loading: false,
          error: null
        }));

        logger.info('use${hookNamePascal} operation completed', {
          hook: 'use${hookNamePascal}',
          success: true
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState(prev => ({
          ...prev,
          loading: false,
          error: err
        }));

        logger.error('use${hookNamePascal} operation failed', err, {
          hook: 'use${hookNamePascal}'
        });
      }
    };

    handleOperation();
  }, [enabled]);

  // Helper functions
  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  };

  const refetch = () => {
    // Trigger refetch logic
    setState(prev => ({ ...prev, loading: true, error: null }));
    // Add refetch implementation
  };

  return {
    ...state,
    reset,
    refetch,
  };
};

export default use${hookNamePascal};
`;

// Create hooks directory if it doesn't exist
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

// Write hook file
fs.writeFileSync(hookFile, template);

console.log(`✅ Generated hook: use${hookNamePascal}`);
console.log(`📁 Location: ${hookFile}`);
console.log(`💡 Usage example:`);
console.log(`   import { use${hookNamePascal} } from '@/hooks/use${hookNamePascal}';`);
console.log(`   `);
console.log(`   const { data, loading, error } = use${hookNamePascal}({ enabled: true });`);