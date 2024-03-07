import clsx from "clsx";
import React, { useCallback } from "react";
import Collapsible from "react-collapsible";
import { NavLink } from "react-router-dom";
import Badge from "../../fundamentals/badge";

type SidebarMenuSubitemProps = {
	pageLink: string;
	text: string;
};

type SidebarMenuItemProps = {
	pageLink: string;
	text: string;
	icon: JSX.Element;
	triggerHandler: () => any;
	subItems?: SidebarMenuSubitemProps[];
	isNew?: boolean;
	suffix?: JSX.Element;
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> & {
	SubItem: (props: SidebarMenuSubitemProps) => JSX.Element;
} = ({
	pageLink,
	icon,
	text,
	triggerHandler,
	subItems = [],
	isNew,
	suffix,
}: SidebarMenuItemProps) => {
	// const styles =
	// 	"group py-2 my-0.5 rounded-rounded flex text-grey-50 hover:bg-[#00000025] items-center px-2 text-white";
	// const activeStyles = "bg-[#0000005C] is-active";
	// const classNameFn = useCallback(
	// 	({ isActive }) => (isActive ? `${styles} ${activeStyles}` : styles),
	// 	[]
	// );

	return (
		<Collapsible
			transitionTime={150}
			transitionCloseTime={150}
			{...triggerHandler()}
			trigger={
				<NavLink
					className={({ isActive }) =>
						clsx(
							"group py-2 px-4 my-0.5 rounded-rounded flex hover:bg-[#00000025] items-center text-white",
							isActive && "bg-[#0000005C] is-active"
						)
					}
					to={pageLink}
				>
					<span className="items-start">{icon}</span>
					<span className=" ml-3">{text}</span>
					{isNew && (
						<Badge variant={"new-feature"} className="ml-auto">
							New
						</Badge>
					)}

					{suffix && <span className="ml-auto">{suffix}</span>}
				</NavLink>
			}
		>
			{subItems?.length > 0 &&
				subItems.map(({ pageLink, text }) => (
					<SubItem pageLink={pageLink} text={text} />
				))}
		</Collapsible>
	);
};

const SubItem = ({ pageLink, text }: SidebarMenuSubitemProps) => {
	const styles = "py-0.5 px-1 my-0.5 rounded-base flex hover:bg-grey-10";
	const activeStyles = "bg-grey-10 font-semibold";
	const classNameFn = useCallback(
		({ isActive }: { isActive: boolean }) =>
			isActive ? `${styles} ${activeStyles}` : styles,
		[]
	);

	return (
		<NavLink className={classNameFn} to={pageLink}>
			<span className="text-grey-90 text-small ml-3">{text}</span>
		</NavLink>
	);
};

SidebarMenuItem.SubItem = SubItem;

export default SidebarMenuItem;
