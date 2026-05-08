import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const [theme, setThemeState] = useState<"light" | "dark">("dark");

	useEffect(() => {
		// La clase .light contiene los estilos del tema claro
		const isLightMode = document.documentElement.classList.contains("light");
		setThemeState(isLightMode ? "light" : "dark");
	}, []);

	const toggleTheme = async () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setThemeState(newTheme);

		if (!("startViewTransition" in document)) {
			document.documentElement.classList[
				newTheme === "light" ? "add" : "remove"
			]("light");
			return;
		}

		const transition = (
			document as Document & {
				startViewTransition: (cb: () => void) => { ready: Promise<void> };
			}
		).startViewTransition(() => {
			document.documentElement.classList[
				newTheme === "light" ? "add" : "remove"
			]("light");
		});

		await transition.ready;

		document.documentElement.animate(
			{ clipPath: ["inset(0 0 100% 0)", "inset(0)"] },
			{ pseudoElement: "::view-transition-new(root)", duration: 600 },
		);
	};

	return (
		<Button variant="outline" size="icon" onClick={toggleTheme}>
			<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all light:scale-0 light:-rotate-90" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all light:scale-100 light:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
