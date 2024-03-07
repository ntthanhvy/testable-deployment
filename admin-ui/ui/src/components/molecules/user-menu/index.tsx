import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAdminDeleteSession, useAdminGetSession } from "medusa-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import Avatar from "../../atoms/avatar";
import Button from "../../fundamentals/button";
import GearIcon from "../../fundamentals/icons/gear-icon";
import SignOutIcon from "../../fundamentals/icons/log-out-icon";
import { ChevronUpDown } from "@medusajs/icons";

const UserMenu: React.FC = () => {
	const navigate = useNavigate();

	const { user, isLoading, remove } = useAdminGetSession();
	const { mutate } = useAdminDeleteSession();

	const notification = useNotification();

	const logOut = () => {
		mutate(undefined, {
			onSuccess: () => {
				remove();
				navigate("/login");
			},
			onError: (err) => {
				notification("Failed to log out", getErrorMessage(err), "error");
			},
		});
	};
	return (
		<div className="h-auto w-full">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild disabled={isLoading}>
					<div className="w-full flex items-center justify-start">
						<div className="h-2xlarge w-2xlarge cursor-pointer">
							<Avatar
								user={{ ...user }}
								isLoading={isLoading}
								color="bg-purple-800"
							/>
						</div>
						<span className="ml-3 text-white text-sm">
							{user?.first_name} {user?.last_name}
						</span>

            <div className="ml-auto">
              <ChevronUpDown className="h-5 text-white" />
            </div>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					sideOffset={12}
					side="bottom"
					className="ml-large rounded-rounded border-grey-20 bg-grey-0 p-xsmall shadow-dropdown z-30 min-w-[200px] border"
				>
					<DropdownMenu.Item className="mb-1 outline-none">
						<Button
							variant="ghost"
							size="small"
							className={"w-full justify-start"}
							onClick={() => navigate("/a/settings")}
						>
							<GearIcon />
							Settings
						</Button>
					</DropdownMenu.Item>
					<DropdownMenu.Item className="outline-none">
						<Button
							variant="ghost"
							size="small"
							className={"w-full justify-start text-rose-50"}
							onClick={() => logOut()}
						>
							<SignOutIcon size={20} />
							Sign out
						</Button>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	);
};

export default UserMenu;
