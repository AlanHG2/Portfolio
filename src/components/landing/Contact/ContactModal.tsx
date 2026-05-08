import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactModal() {
	return (
		<Dialog>
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
				<form>
					<DialogHeader>
						<DialogTitle className="text-2xl sm:text-3xl">Contacto</DialogTitle>
						<DialogDescription className="text-base sm:text-lg">
							Envíame un mensaje y te responderé lo antes posible.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="py-4 sm:py-6">
						<Field>
							<Label htmlFor="nombre" className="text-base">
								Nombre
							</Label>
							<Input
								id="nombre"
								name="nombre"
								placeholder="Tu nombre"
								required
								className="text-base h-10 sm:h-12 mt-1 sm:mt-2"
							/>
						</Field>
						<Field>
							<Label htmlFor="email" className="text-base">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="tu@email.com"
								required
								className="text-base h-10 sm:h-12 mt-1 sm:mt-2"
							/>
						</Field>
						<Field>
							<Label htmlFor="telefono" className="text-base">
								Teléfono
							</Label>
							<Input
								id="telefono"
								name="telefono"
								type="tel"
								placeholder="+123456789"
								className="text-base h-10 sm:h-12 mt-1 sm:mt-2"
							/>
						</Field>
						<Field>
							<Label htmlFor="mensaje" className="text-base">
								Mensaje
							</Label>
							<Textarea
								id="mensaje"
								name="mensaje"
								placeholder="¿En qué te puedo ayudar?"
								maxLength={150}
								required
								className="text-base min-h-24 sm:min-h-32 mt-1 sm:mt-2 resize-none"
							/>
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose>
							<Button
								type="button"
								variant="outline"
								className="text-base h-10 sm:h-12 px-4 sm:px-6"
							>
								Cancelar
							</Button>
						</DialogClose>
						<Button
							type="submit"
							className="text-base h-10 sm:h-12 px-4 sm:px-6"
						>
							Enviar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
