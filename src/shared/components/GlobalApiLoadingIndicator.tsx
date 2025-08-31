import { useAxiosClient } from "../providers/AxiosClientProvider";

export function GlobalApiLoadingIndicator() {
  const { isLoading } = useAxiosClient();

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
      <div
        className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
      <span className="text-sm text-gray-700 font-medium">Processing...</span>
    </div>
  );
}
