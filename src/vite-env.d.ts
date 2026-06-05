/// <reference types="vite/client" />

declare module 'web-toolkit' {
  import * as React from 'react';

  type AnyProps = Record<string, unknown> & { children?: React.ReactNode; className?: string };
  export const Box: React.ComponentType<AnyProps>;
  export const Button: React.ComponentType<AnyProps & React.ButtonHTMLAttributes<HTMLButtonElement>>;
  export const Checkbox: React.ComponentType<AnyProps>;
  export const Dropdown: React.ComponentType<AnyProps>;
  export const Frame: React.ComponentType<AnyProps>;
  export const HeaderBar: React.ComponentType<AnyProps> & {
    Title: React.ComponentType<AnyProps & { subtitle?: React.ReactNode; fill?: boolean }>;
    Controls: React.ComponentType<AnyProps>;
  };
  export const InfoBar: React.ComponentType<AnyProps>;
  export const Input: React.ComponentType<AnyProps & React.InputHTMLAttributes<HTMLInputElement>> & {
    Group: React.ComponentType<AnyProps>;
  };
  export const Paned: React.ComponentType<AnyProps>;
  export const Spinner: React.ComponentType<AnyProps>;
  export const Switch: React.ComponentType<AnyProps>;
}
