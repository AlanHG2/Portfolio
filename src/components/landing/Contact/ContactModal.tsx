import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ContactFormValues, contactFormSchema } from "./schema";

export function ContactModal() {
	const [open, setOpen] = useState(false);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			nombre: "",
			email: "",
			telefono: "",
			mensaje: "",
		},
	});

	useEffect(() => {
		const handleOpenModal = () => setOpen(true);
		document.addEventListener("open-contact-modal", handleOpenModal);
		return () => {
			document.removeEventListener("open-contact-modal", handleOpenModal);
		};
	}, []);

	function onSubmit(data: ContactFormValues) {
		// Do something with the form values.
		console.log(data);
	}

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
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle className="text-2xl sm:text-3xl">Contacto</DialogTitle>
						<DialogDescription className="text-base sm:text-lg">
							Envíame un mensaje y te responderé lo antes posible.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="py-4 sm:py-6">
						<Controller
							name="nombre"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name} className="text-base">
										Nombre
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="Tu nombre"
										autoComplete="name"
										className="text-base h-10 sm:h-12 mt-1 sm:mt-2"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name} className="text-base">
										Email
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="email"
										aria-invalid={fieldState.invalid}
										placeholder="tu@email.com"
										autoComplete="email"
										className="text-base h-10 sm:h-12 mt-1 sm:mt-2"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="telefono"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name} className="text-base">
										Teléfono
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="tel"
										aria-invalid={fieldState.invalid}
										placeholder="10 dígitos"
										autoComplete="tel"
										className="text-base h-10 sm:h-12 mt-1 sm:mt-2"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="mensaje"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name} className="text-base">
										Mensaje
									</FieldLabel>
									<Textarea
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="¿En qué puedo ayudar?"
										maxLength={150}
										className="text-base min-h-24 sm:min-h-32 mt-1 sm:mt-2 resize-none"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<DialogFooter>
						<DialogClose
							render={
								<Button
									type="button"
									variant="outline"
									className="text-base h-10 sm:h-12 px-4 sm:px-6"
								>
									Cancelar
								</Button>
							}
						/>
						<Button
							type="submit"
							className="text-base h-10 sm:h-12 px-4 sm:px-8 text-secondary"
						>
							Enviar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
