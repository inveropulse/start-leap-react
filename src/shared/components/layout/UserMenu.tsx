import React, { useState } from "react";
import { PortalType } from "@/shared/types";
import { PortalConfig } from "@/routes/types";
import { useLogoutRequest } from "@/api/auth/logout";
import { useAuth } from "@/shared/services/auth/hooks";
import { LogOut, ChevronDown, Check } from "lucide-react";

export interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const logoutRequest = useLogoutRequest();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    logoutRequest.mutate();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* User Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 border-l border-white/20 hover:bg-white/10 rounded-md p-2 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-medium">
          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>
        <div className="hidden md:block text-sm text-left">
          <div className="font-medium text-white">{user?.fullName}</div>
          <div className="text-xs text-white/70">{user?.email}</div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-white/70 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          role="menu"
          aria-label="User menu"
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {user?.fullName}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Portal Switching Section */}
          <PortalSwitcher setIsOpen={setIsOpen} />

          {/* Actions Section */}
          <div className="px-4 py-2">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left flex items-center gap-3 rounded-md hover:bg-red-50 text-red-600 transition-colors"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
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

interface PortalSwitcherProps {
  setIsOpen: (value: boolean) => void;
}

function PortalSwitcher({ setIsOpen }: PortalSwitcherProps) {
  const { currentPortal, availablePortals, switchPortal, hasPortalAccess } =
    useAuth();

  const handlePortalSwitch = (portalId: PortalType) => {
    const portal = availablePortals.find((p) => p.key === portalId);
    if (portal && hasPortalAccess(portal.key)) {
      switchPortal(portal.key);
      window.location.assign(portal.basePath);
      setIsOpen(false);
    }
  };

  if (availablePortals.length <= 1) return;

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Switch Portal
        </div>

        <div className="space-y-1" role="group" aria-label="Portal selection">
          {availablePortals.map((portal: PortalConfig) => (
            <button
              key={portal.key}
              onClick={() => handlePortalSwitch(portal.key)}
              disabled={portal.key === currentPortal}
              className={`w-full px-3 py-2 text-left flex items-center gap-3 rounded-md transition-colors ${
                portal.key === currentPortal
                  ? "bg-blue-50 text-blue-700 cursor-not-allowed"
                  : "hover:bg-gray-50 text-gray-900"
              }`}
              role="menuitem"
              aria-current={portal.key === currentPortal ? "true" : undefined}
            >
              <span className="text-lg">{portal.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{portal.name}</div>
              </div>
              {portal.key === currentPortal && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
