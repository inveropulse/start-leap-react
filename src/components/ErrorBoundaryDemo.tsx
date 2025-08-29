// src/components/ErrorBoundaryDemo.tsx
import React, { useState } from "react";
import {
  SectionErrorBoundary,
  ComponentErrorBoundary,
  useErrorReporter,
} from "../shared/components/Error";
import { useLogger } from "../hooks/useLogger";

// Component that throws errors for testing
const ErrorThrowingComponent: React.FC<{
  shouldError: boolean;
  errorType: string;
}> = ({ shouldError, errorType }) => {
  if (shouldError) {
    switch (errorType) {
      case "render":
        throw new Error("Intentional render error for testing");
      case "async":
        throw new Error("Intentional async error for testing");
      case "null":
        const obj: any = null;
        return <div>{obj.property}</div>; // This will throw
      default:
        throw new Error("Unknown error type");
    }
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <h3 className="text-green-800 font-medium">
        Component is working correctly!
      </h3>
      <p className="text-green-600 text-sm mt-1">No errors detected.</p>
    </div>
  );
};

export const ErrorBoundaryDemo: React.FC = () => {
  const logger = useLogger({ feature: "error-boundary-demo" });
  const { reportError } = useErrorReporter();

  const [componentError, setComponentError] = useState(false);
  const [sectionError, setSectionError] = useState(false);
  const [errorType, setErrorType] = useState("render");
  const [resetKey, setResetKey] = useState(0);

  const handleManualError = () => {
    try {
      // Simulate some operation that fails
      throw new Error("Manually reported error");
    } catch (error) {
      reportError(error as Error, {
        feature: "manual-error-reporting",
        action: "test-manual-error",
      });
      logger.info("Manual error reported through error context");
    }
  };

  const resetErrors = () => {
    setComponentError(false);
    setSectionError(false);
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Error Boundary Demo</h1>
        <p className="text-gray-600">
          Test different error boundary scenarios and recovery mechanisms
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Controls</h2>

        <div className="flex flex-wrap gap-4">
          <select
            value={errorType}
            onChange={(e) => setErrorType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="render">Render Error</option>
            <option value="async">Async Error</option>
            <option value="null">Null Reference Error</option>
          </select>

          <button
            onClick={() => setComponentError(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Trigger Component Error
          </button>

          <button
            onClick={() => setSectionError(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Trigger Section Error
          </button>

          <button
            onClick={handleManualError}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Report Manual Error
          </button>

          <button
            onClick={resetErrors}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset All ({resetKey})
          </button>
        </div>
      </div>

      {/* Section Error Boundary Demo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Section Error Boundary</h2>
        <SectionErrorBoundary resetKeys={[resetKey]}>
          <ErrorThrowingComponent
            shouldError={sectionError}
            errorType={errorType}
          />
        </SectionErrorBoundary>
      </div>

      {/* Component Error Boundary Demo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Component Error Boundaries
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ComponentErrorBoundary resetKeys={[resetKey]}>
            <ErrorThrowingComponent
              shouldError={componentError}
              errorType={errorType}
            />
          </ComponentErrorBoundary>

          <ComponentErrorBoundary>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="text-blue-800 font-medium">Safe Component</h3>
              <p className="text-blue-600 text-sm mt-1">
                This component is isolated and won't be affected by errors in
                other components.
              </p>
            </div>
          </ComponentErrorBoundary>
        </div>
      </div>

      {/* Multiple Nested Error Boundaries */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Nested Error Boundaries</h2>
        <SectionErrorBoundary>
          <div className="p-4 border rounded space-y-4">
            <p className="text-gray-600">
              Section boundary protects this area:
            </p>

            <ComponentErrorBoundary>
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                Component boundary protects this specific component
              </div>
            </ComponentErrorBoundary>

            <ComponentErrorBoundary>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                Another protected component
              </div>
            </ComponentErrorBoundary>
          </div>
        </SectionErrorBoundary>
      </div>

      {/* Error Boundary Features */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Error Boundary Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">✅ Implemented Features:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Automatic error logging with context</li>
              <li>
                • Multiple error boundary levels (Page, Section, Component)
              </li>
              <li>• Error recovery and reset mechanisms</li>
              <li>• Development vs production error displays</li>
              <li>• Error context for manual error reporting</li>
              <li>• Specialized error boundaries for different use cases</li>
              <li>• Error isolation to prevent cascading failures</li>
              <li>• Reset on prop changes or key changes</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">🔧 Configuration Options:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Custom fallback components</li>
              <li>• Error severity levels</li>
              <li>• Auto-reset functionality</li>
              <li>• Isolation modes</li>
              <li>• Custom error handlers</li>
              <li>• Reset triggers</li>
              <li>• Error context propagation</li>
              <li>• Development debugging tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
