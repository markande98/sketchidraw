"use client";

import { User } from "@/hooks/use-e2e-websocket";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";

type UsersShareIconProps = {
  users: User[];
};

export const UsersShareIcon = ({ users }: UsersShareIconProps) => {
  const { currentUser } = useCurrentUser();
  if (!currentUser) return null;

  return (
    <div className="absolute right-24 top-7 z-[100] flex items-center gap-2">
      {users.map(
        (u) =>
          u.id !== currentUser.id && (
            <Tooltip key={u.id}>
              <TooltipTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-green-300 flex items-center justify-center text-black font-extrabold">
                  {u.username.charAt(0).toUpperCase()}
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="bg-black text-white p-2"
                side="bottom"
                sideOffset={5}
              >
                <span className="font-semibold">{u.username}</span>
              </TooltipContent>
            </Tooltip>
          )
      )}
    </div>
  );
};
