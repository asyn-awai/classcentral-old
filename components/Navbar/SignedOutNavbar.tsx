"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { Avatar } from "@nextui-org/avatar";
import { User } from "@nextui-org/user";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	DropdownSection,
} from "@nextui-org/dropdown";
import { useTheme } from "next-themes";
import dashify from "dashify";
import { HiSun, HiMoon } from "react-icons/hi";
import NextLink from "next/link";
import Link from "@/components/Link";
// import Image from "@/components/Image";
import Image from "next/image";

const menuItems: string[] = [
	// "About", "Services", "Articles", "Gallery", "Contact"
	"Dashboard",
];

const mobileMenuAvailable = ["/", "/sign-in", "/sign-up"];

export default function SignedOutNavbar({
	solid = true,
	name = "",
	role,
}: {
	solid?: boolean;
	name?: string;
	role?: string | undefined;
}) {
	const router = useRouter();
	const pathname = usePathname();
	// const { sidebarOpen, setSidebarOpen } = useGlobalContext();
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
	const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);

	return (
		<Navbar
			isBordered
			isMenuOpen={isMenuOpen && mobileMenuAvailable.includes(pathname)}
			onMenuOpenChange={setIsMenuOpen}
			className={`z-50 ${!solid ? "fixed" : ""}`}
			classNames={{
				wrapper: "max-w-[90rem]",
				brand: "h-full",
			}}
		>
			<NavbarContent className="lg:hidden max-w-fit" justify="start">
				<NavbarMenuToggle
					// onPress={() => setSidebarOpen(prev => !prev)}
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				/>
			</NavbarContent>

			<NavbarContent className="pr-3 lg:hidden" justify="center">
				{/* mobile */}
				<NavbarBrand className="h-full">
					<NextLink href="/">ClassCentral</NextLink>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden lg:flex max-w-fit" justify="start">
				<NavbarBrand className="h-full mr-12">
					<NextLink
						href="/"
						// underline="none"
						className="text-3xl font-bold hover:opacity-100"
					>
						ClassCentral
					</NextLink>
				</NavbarBrand>
				<div className="flex gap-8">
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
									size="md"
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
				</div>
			</NavbarContent>

			<NavbarContent justify="end" className="flex gap-8 max-w-fit">
				<NavbarItem className="hidden sm:flex">
					{name ? (
						<Button
							as={Link}
							href="/dashboard"
							size="md"
							color="primary"
							variant="flat"
						>
							Dashboard
						</Button>
					) : (
						<></>
					)}
				</NavbarItem>
				<NavbarItem>
					{name ? (
						<Dropdown showArrow>
							<DropdownTrigger>
								<Avatar
									name={name}
									isBordered
									as="button"
									className="transition-transform"
									classNames={{
										base: "border-primary",
									}}
								/>
							</DropdownTrigger>
							<DropdownMenu disabledKeys={["profile", "account"]}>
								<DropdownSection
									aria-label="Profile"
									showDivider
								>
									<DropdownItem
										isReadOnly
										key="profile"
										className="h-16 py-4 opacity-100"
									>
										<User
											name={name}
											description={role}
											classNames={{
												base: "border-primary",
												name: "text-sm",
												description:
													"text-xs first-letter:capitalize text-primary",
											}}
											avatarProps={{
												size: "lg",
											}}
										/>
									</DropdownItem>
									<DropdownItem key="view-profile">
										<Link
											className="w-full h-full"
											href="/profile"
										>
											View Profile
										</Link>
									</DropdownItem>
									<DropdownItem key="account">
										<Link
											className="w-full h-full"
											href="/account"
										>
											Account
										</Link>
									</DropdownItem>
								</DropdownSection>
								<DropdownSection aria-label="Actions">
									<DropdownItem
										color="danger"
										className="group"
									>
										<Button
											onPress={async () => {
												// await supabase.auth.signOut();
												router.push("/");
												router.refresh();
												// setRerenderCount(
												// 	prev => prev + 1
												// );
											}}
											className="justify-start w-full h-full pl-0 bg-transparent"
										>
											<p className="group-hover:text-white text-danger">
												Sign Out
											</p>
										</Button>
									</DropdownItem>
								</DropdownSection>
							</DropdownMenu>
						</Dropdown>
					) : (
						// <Link href="/profile">{name}</Link>
						<Button
							variant="flat"
							color="primary"
							as={Link}
							href="/sign-in"
						>
							Sign In
						</Button>
					)}
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{/* mobile */}
				{menuItems.map((item, index) => {
					const isActive = pathname.startsWith(`/${dashify(item)}`);
					return (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								className="w-full py-2"
								color={isActive ? "primary" : "foreground"}
								href={`/${dashify(item)}`}
								size="lg"
							>
								{item}
							</Link>
						</NavbarMenuItem>
					);
				})}
				<Switch
					size="lg"
					color="primary"
					startContent={<HiMoon />}
					endContent={<HiSun />}
					isSelected={theme === "dark"}
					onValueChange={selected =>
						setTheme(selected ? "dark" : "light")
					}
					className="block py-2 lg:hidden"
				/>
			</NavbarMenu>
		</Navbar>
	);
}
