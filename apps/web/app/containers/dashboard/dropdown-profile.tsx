import { AvatarFallback } from "@radix-ui/react-avatar";
import { PersonIcon } from "@radix-ui/react-icons";
import {
  ChevronDown,
  Cloud,
  CreditCard,
  Github,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  ReceiptText,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function DropdownProfile() {
  const { t } = useTranslation("dashboard");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="inline-flex focus:border-none border-none p-0.5"
        >
          <Avatar className="mr-2 bg-black">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback className="inline-flex text-white min-h-[40px] min-w-[40px] items-center justify-center">
              <PersonIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          {t("my_account.title", "My Account")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/account/profile">
              <User />
              <span>{t("profile.title", "Profile")}</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/account/billings">
              <ReceiptText />
              <span>{t("billings.title", "Billings")}</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/account/subscription">
              <CreditCard />
              <span>{t("subscription.title", "Subscription")}</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/account">
              <Settings />
              <span>{t("settings.title", "Settings")}</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Keyboard />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/team">
              <Users />
              <span>{t("team", "Team")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus />
              <span>{t("invite_users", "Invite users")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail />
                  <span>{t("invite.email", "Email")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare />
                  <span>{t("invite.message", "Message")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle />
                  <span>{t("invite.more", "More...")}</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* <DropdownMenuItem>
            <Plus />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/MrGlox/brick-mail"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <span>GitHub</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/MrGlox/brick-mail/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LifeBuoy />
            <span>{t("support", "Support")}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form method="POST" action="/auth/logout" className="w-full">
          <DropdownMenuItem asChild className="w-full">
            <button type="submit">
              <LogOut />
              <span>{t("logout", { ns: "common" })}</span>
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
