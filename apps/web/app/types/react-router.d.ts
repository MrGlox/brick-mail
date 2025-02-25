import type { LucideProps } from "lucide-react";
import { ReactNode } from "react";

declare module "react-router-dom" {
  interface OutletProps {
    context?: unknown;
  }

  export function Outlet(props: OutletProps): ReactNode;
}

declare module "lucide-react" {
  export interface IconProps extends LucideProps {}

  export const ArrowRightIcon: React.FC<IconProps>;
  // Add other icons as needed
}

declare module "@repo/database" {
  export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PENDING = "PENDING",
  }
}
