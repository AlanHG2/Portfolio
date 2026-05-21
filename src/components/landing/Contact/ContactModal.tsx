import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

export function ContactModal() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const handleOpenModal = () => setOpen(true);
		document.addEventListener("open-contact-modal", handleOpenModal);
		return () => {
			document.removeEventListener("open-contact-modal", handleOpenModal);
		};
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<button
					type="button"
					className="contact-cta bg-transparent border-none p-0 cursor-pointer text-left focus:outline-none"
				>
					<span className="word-hablemos">HABLEMOS</span>
					<ArrowUpRight className="pointer-icon" />
				</button>
			</DialogTrigger>
			<DialogContent className="w-[95vw] sm:max-w-lg max-h-[90dvh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl sm:text-3xl">Contacto</DialogTitle>
					<DialogDescription className="text-base sm:text-lg">
						Envíame un mensaje y te responderé lo antes posible.
					</DialogDescription>
				</DialogHeader>
				<ContactForm
					onSuccess={() => setOpen(false)}
					onCancel={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
