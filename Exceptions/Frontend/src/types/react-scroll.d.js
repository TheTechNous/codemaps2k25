declare module 'react-scroll' {
  import { ReactNode } from 'react';

  export interface LinkProps {
    to: string;
    smooth?: boolean;
    duration?: number;
    offset?: number;
    activeClass?: string;
    spy?: boolean;
    exact?: boolean;
    delay?: number;
    className?: string;  
    children: ReactNode;
  }

  export const Link: React.FC<LinkProps>;
}
