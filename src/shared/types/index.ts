// Main shared types index - new domain-driven structure
// Re-export all domain types and shared kernel
export * from './domains';
export * from './shared-kernel';
export * from './infrastructure';

// Backward compatibility exports - only export types that don't conflict
export * from './common';
export * from './ui';
export * from './filters';
