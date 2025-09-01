import { Check } from "lucide-react";
import { PortalType } from "@/shared/types";
import { PortalConfig } from "@/routes/types";
import { useAuth } from "@/shared/services/auth/hooks";

export interface PortalSwitcherProps {
  closeMenu: () => void;
}

export default function PortalSwitcher({ closeMenu }: PortalSwitcherProps) {
  const { currentPortal, availablePortals, switchPortal, hasPortalAccess } =
    useAuth();

  if (availablePortals.length <= 1) return;

  const handlePortalSwitch = (portalId: PortalType) => {
    const portal = availablePortals.find((p) => p.key === portalId);
    if (portal && hasPortalAccess(portal.key)) {
      // Set flag for portal switch detection
      sessionStorage.setItem('portalSwitch', 'true');
      
      switchPortal(portal.key);
      window.location.assign(portal.basePath);
      closeMenu();
    }
  };

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
