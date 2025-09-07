import { useEffect, useState } from "react";
import { clsx } from "clsx";

export function FocusIndicator() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => setIsKeyboardUser(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    // Apply focus-visible class to body for CSS targeting
    document.body.classList.toggle('keyboard-user', isKeyboardUser);
  }, [isKeyboardUser]);

  return null; // This component only manages global state
}