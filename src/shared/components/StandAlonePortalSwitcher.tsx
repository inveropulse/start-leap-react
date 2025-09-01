import { PortalType } from "../types";
import React, { useState } from "react";
import { PortalConfig } from "@/routes/types";
import { useAuth } from "@/shared/services/auth/hooks";

export interface PortalSwitcherProps {
  className?: string;
  showHistory?: boolean;
}

export const StandAlonePortalSwitcher: React.FC<PortalSwitcherProps> = ({
  className = "",
}) => {
  const { currentPortal, availablePortals, hasPortalAccess, switchPortal } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const currentPortalInfo = availablePortals.find(
    (p) => p.key === currentPortal
  );

  const handlePortalSwitch = (portalId: PortalType) => {
    const portal = availablePortals.find((p) => p.key === portalId);
    if (portal && hasPortalAccess(portal.key)) {
      switchPortal(portalId);
      window.location.assign(portal.basePath);
      setIsOpen(false);
    }
  };

  if (availablePortals.length <= 1) {
    return null; // Don't show if user only has access to one portal
  }

  return (
    <div className={`relative ${className}`}>
      {/* Current Portal Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Portal switcher"
      >
        <span className="text-lg">{currentPortalInfo?.icon}</span>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {currentPortalInfo?.name}
          </div>
          <div className="text-xs text-gray-500">Switch Portal</div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          role="menu"
          aria-label="Available portals"
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Available Portals
          </div>
          {availablePortals.map((portal: PortalConfig) => (
            <button
              key={portal.key}
              onClick={() => handlePortalSwitch(portal.key)}
              disabled={portal.key === currentPortal}
              className={`w-full px-4 py-2 text-left flex items-center space-x-3 ${
                portal.key === currentPortal
                  ? "bg-blue-50 text-blue-700 cursor-not-allowed"
                  : "hover:bg-gray-50 text-gray-900"
              }`}
              role="menuitem"
              aria-current={portal.key === currentPortal ? "true" : undefined}
            >
              <span className="text-lg">{portal.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {portal.name}
                  {portal.key === currentPortal && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
