import { CubeIcon, MixIcon, PersonIcon } from "@radix-ui/react-icons";
import { UserStatus } from "@repo/database";

export const userStatuses = new Map<UserStatus, string>([
  [
    "ACTIVE",
    "bg-success/10 text-success-foreground border border-success-foreground/10",
  ],
  [
    "INVITED",
    "bg-warning text-warning-foreground border border-warning-foreground/10",
  ],
  [
    "PENDING",
    "bg-warning/20 text-warning-foreground border border-warning-foreground/10",
  ],
  [
    "SUSPENDED",
    "bg-destructive-foreground text-destructive border border-destructive/50",
  ],
  [
    "DELETED",
    "bg-destructive-foreground text-destructive border border-destructive/50",
  ],
]);

export const userTypes = [
  {
    label: "Owner",
    value: "OWNER",
    icon: MixIcon,
    color: "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  },
  {
    label: "Builder",
    value: "BUILDER",
    icon: CubeIcon,
    color: "bg-neutral-300/40 border-neutral-300",
  },
  {
    label: "User",
    value: "USER",
    icon: PersonIcon,
    color: "bg-neutral-300/40 border-neutral-300",
  },
] as const;
