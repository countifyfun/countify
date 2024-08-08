import { cn } from "@/lib/cn";
import Image from "next/image";

const profiles: Record<
  string,
  {
    author: string;
    avatar: string;
    bot?: boolean;
    verified?: boolean;
    roleColor?: string;
  }
> = {
  countify: {
    author: "Countify",
    avatar: "/logo.png",
    bot: true,
    verified: false,
    roleColor: "#fde047",
  },
  toasted: {
    author: "ToastedToast",
    avatar: "https://avatars.githubusercontent.com/u/50563138?v=4",
  },
  user: {
    author: "User",
    avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
  },
};

export function Discord({ children }: { children: React.ReactNode }) {
  return (
    // eslint-disable-next-line prettier/prettier
    <div className="no-prose font-discord flex flex-col bg-white py-2 dark:bg-[#36393e]">
      {children}
    </div>
  );
}

export function Message({
  children,
  profile = "user",
  command,
  ephemeral,
}: {
  children: React.ReactNode;
  profile?: string;
  command?: {
    name: string;
    profile?: string;
  };
  ephemeral?: boolean;
}) {
  const profileData = profiles[profile];
  const commandProfileData = command
    ? profiles[command.profile ?? "user"]
    : null;

  return (
    <div
      className={cn(
        "not-prose px-4 py-1",
        ephemeral
          ? "border-l-[2px] border-[rgb(88,101,242)] bg-[rgba(88,101,242,0.05)]"
          : "hover:bg-[rgba(4,4,5,0.07)]"
      )}
    >
      {command && (
        <div className="user-select-none relative mb-[4px] ml-[56px] flex items-center pt-[2px] text-[0.875rem] leading-[1.125rem] text-[#b9bbbe] before:absolute before:bottom-0 before:left-[-36px] before:right-[100%] before:top-[50%] before:mb-[-2px] before:ml-[-1px] before:mr-[4px] before:mt-[-1px] before:rounded-tl-[6px] before:border-b-0 before:border-l-[2px] before:border-r-0 before:border-t-[2px] before:border-[#4f545c] before:content-['']">
          <img
            src={
              commandProfileData?.avatar ??
              "https://cdn.discordapp.com/embed/avatars/0.png"
            }
            alt={commandProfileData?.author ?? command.profile}
            width={16}
            height={16}
            className="mr-[0.25rem] rounded-full"
          />
          <span className="mr-1 flex-shrink-0 cursor-pointer font-medium text-foreground opacity-[0.64] hover:underline">
            {commandProfileData?.author ?? command.profile}
          </span>
          used
          <span className="ml-1 cursor-pointer font-medium text-[#00aff4] [text-overflow:ellipsis] hover:underline">
            /{command.name}
          </span>
        </div>
      )}
      <div className="relative flex flex-[0_0_auto]">
        <div className="mr-[16px] mt-[5px] min-w-[40px] flex-shrink-0">
          <Image
            src={
              profileData?.avatar ??
              "https://cdn.discordapp.com/embed/avatars/0.png"
            }
            alt={profileData?.author ?? profile}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="w-full pt-[2px] font-normal leading-[160%]">
          <span
            className="mr-[0.25rem] inline-flex items-center font-medium"
            style={{ color: profileData?.roleColor ?? "white" }}
          >
            <p className="cursor-pointer hover:underline">
              {profileData?.author ?? profile}
            </p>
            <div className="ml-[4px] mt-[0.075em] flex h-[0.9375rem] items-center rounded-[0.1875rem] bg-[#5865f2] p-[0_0.275rem] text-[0.625em] leading-[100%] text-white">
              BOT
            </div>
          </span>
          <span className="ml-[3px] text-[12px] dark:text-[#72767d]">
            {new Date().toLocaleDateString()}
          </span>
          <div className="font-normal">{children}</div>
          {ephemeral && (
            <div className="mt-[4px] text-[12px] font-normal leading-none text-[rgb(114,118,125)]">
              <svg
                className="mr-[4px] inline-block [vertical-align:text-bottom]"
                aria-hidden="false"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z"
                ></path>
                <path
                  fill="currentColor"
                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                ></path>
              </svg>
              {" Only you can see this • "}
              <span
                role="button"
                className="cursor-pointer font-medium text-[rgb(0,175,244)] hover:underline"
              >
                Dismiss message
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Mention({ children }: { children: React.ReactNode }) {
  return (
    <span className="cursor-pointer rounded-[3px] bg-[hsla(235,85.6%,64.7%,0.3)] p-[0_2px] font-medium text-[#e3e7f8] transition-[background-color_50ms_ease-out,_color_50ms_ease-out] hover:bg-[hsl(235,85.6%,64.7%)] hover:text-white">
      {children}
    </span>
  );
}
