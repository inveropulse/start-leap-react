import React, { PropsWithChildren } from "react";

export interface AuthLayoutProps extends PropsWithChildren {}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto p-8">
        {children}
      </div>
    </div>
  );
};