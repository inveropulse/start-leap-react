import React, { PropsWithChildren } from "react";

export interface AuthLayoutProps extends PropsWithChildren {}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="mx-auto p-8 min-h-screen flex items-center justify-center">
      <div className="w-full">{children}</div>
    </div>
  );
};
