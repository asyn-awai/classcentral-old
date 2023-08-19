import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";

export default function Home() {
	return (
		<main className="flex flex-col items-center w-full">
			<section className="grid w-full place-items-center min-h-rem-screen">
				<div className="flex flex-col items-center justify-center w-full p-8 md:w-5/6 gap-y-8 h-5/6">
					<h1 className="inline max-w-6xl text-5xl font-bold tracking-tight text-center lg:text-6xl">
						Gamified learning and classroom tools,{" "}
						<span className="text-transparent bg-clip-text from-cyan-400 to-blue-500 bg-gradient-to-b">
							all in one place
						</span>
					</h1>
					<h2 className="max-w-3xl text-lg leading-relaxed text-center lg:text-2xl text-foreground-500">
						Streamline your workflow and make learning fun with our
						suite of tools and games.
					</h2>
					<div className="flex flex-col items-center gap-y-4">
						{/* <label
							htmlFor="sign-up-options"
							className="text-foreground-500"
						>
							I am a:
						</label> */}
						<div
							id="sign-up-options"
							className="flex flex-row flex-wrap justify-center gap-8"
						>
							<Link href="/sign-up?as=student">
								<Button size="lg">Students</Button>
							</Link>
							<Link href="/sign-up?as=teacher">
								<Button size="lg">Teachers</Button>
							</Link>
							<Link href="/sign-up?as=parent">
								<Button size="lg">Parents</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
