"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
} from "@nextui-org/navbar";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import dashify from "dashify";
import { useTheme } from "next-themes";
import CommandBar from "@/components/Navbar/CommandBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems: string[] = [
	// "About",
	// "Services",
	// "Articles",
	// "Gallery",
	// "Contact",
];

export default function SignedInNavbar() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
	const { theme: clientTheme, setTheme: setClientTheme } = useTheme();
	const [theme, setTheme] = useState<string>("dark");
	useEffect(() => {
		if (typeof globalThis.window !== "undefined") {
			setClientTheme(theme);
			setTheme(clientTheme ?? "dark");
		}
	}, [clientTheme, setClientTheme, theme, setTheme]);
	useEffect(() => {
		setClientTheme(theme);
	}, [theme, setClientTheme]);

	return (
		<Navbar>
			<NavbarContent className="lg:hidden max-w-fit" justify="start">
				<NavbarMenuToggle
					// onPress={() => setSidebarOpen(prev => !prev)}
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				/>
			</NavbarContent>
			<NavbarContent className="pr-3 lg:hidden" justify="center">
				{/* mobile */}
				<NavbarBrand>
					<Link href="/">ClassCentral</Link>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="hidden lg:flex max-w-fit" justify="start">
				<NavbarBrand className="h-full">
					<Link
						href="/"
						// underline="none"
						className="text-lg font-bold hover:opacity-100"
					>
						ClassCentral
					</Link>
				</NavbarBrand>
				<NavbarItem>
					<NavigationMenu>
						<NavigationMenuList>
							{menuItems.map((item, index) => {
								const isActive = pathname.startsWith(
									`/${dashify(item)}`
								);
								return (
									<NavigationMenuItem>
										<Link
											key={`${item}-${index}`}
											href={`/${dashify(item)}`}
											legacyBehavior
											passHref
										>
											<NavigationMenuLink
												className={navigationMenuTriggerStyle(
													{
														className: isActive
															? "text-primary"
															: "text-foreground",
													}
												)}
											>
												{item}
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</NavbarItem>
			</NavbarContent>
			{/* <div className="flex gap-8">
					{menuItems.map((item, index) => {
						const isActive = pathname.startsWith(
							`/${dashify(item)}`
						);
						return (
							<NavbarItem
								key={`${item}-${index}`}
								isActive={isActive}
							>
								<Link
									// size="md"
									color={isActive ? "primary" : "foreground"}
									className={
										isActive
											? ""
											: theme === "dark"
											? "text-gray-400"
											: "text-black"
									}
									href={`/${dashify(item)}`}
								>
									{item}
								</Link>
							</NavbarItem>
						);
					})}
				</div> */}
			<NavbarContent className="hidden lg:flex max-w-fit" justify="end">
				<NavbarItem>
					<CommandBar />
				</NavbarItem>
				<NavbarItem>
					<Avatar className="overflow-hidden rounded-full">
						<AvatarFallback className="w-full h-full animate-pulse">
							{/* <Skeleton className="rounded-full" /> */}
						</AvatarFallback>
					</Avatar>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
