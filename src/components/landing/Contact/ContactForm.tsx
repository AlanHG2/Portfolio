import { Turnstile } from "@marsidev/react-turnstile";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "./useContactForm";

interface ContactFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function ContactForm({ onSuccess, onCancel }: ContactFormProps) {
	const {
		form,
		status,
		errorMessage,
		turnstileRef,
		setTurnstileToken,
		setStatus,
		setErrorMessage,
		onSubmit,
	} = useContactForm({ onSuccess });

	return (
		<form onSubmit={onSubmit}>
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
								className="text-base min-h-20 sm:min-h-24 mt-1 sm:mt-2 resize-none"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{/* Turnstile verification widget */}
				<div className="flex flex-col gap-2 mt-4">
					<span className="text-sm font-medium text-muted-foreground">
						Verificación de seguridad
					</span>
					<div className="w-full flex justify-center py-2">
						<Turnstile
							ref={turnstileRef}
							siteKey={
								import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ||
								"1x00000000000000000000AA"
							}
							onSuccess={(token) => setTurnstileToken(token)}
							onError={() => {
								setTurnstileToken(null);
								setStatus("error");
								setErrorMessage(
									"Error de conexión con Turnstile. Inténtalo de nuevo.",
								);
							}}
							onExpire={() => setTurnstileToken(null)}
						/>
					</div>
				</div>

				{status === "error" && (
					<p className="text-sm text-destructive font-medium mt-2">
						{errorMessage}
					</p>
				)}
				{status === "success" && (
					<p className="text-sm text-emerald-500 font-medium mt-2">
						¡Mensaje enviado con éxito!
					</p>
				)}
			</FieldGroup>
			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					disabled={status === "loading"}
					onClick={onCancel}
					className="text-base h-10 sm:h-12 px-4 sm:px-6"
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					disabled={status === "loading"}
					className="text-base h-10 sm:h-12 px-4 sm:px-8 text-secondary"
				>
					{status === "loading" ? "Enviando..." : "Enviar"}
				</Button>
			</DialogFooter>
		</form>
	);
}
