import { zodResolver } from "@hookform/resolvers/zod";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { type ContactFormValues, contactFormSchema } from "./schema";

interface UseContactFormProps {
	onSuccess?: () => void;
}

export function useContactForm({ onSuccess }: UseContactFormProps = {}) {
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const turnstileRef = useRef<TurnstileInstance>(null);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			nombre: "",
			email: "",
			telefono: "",
			mensaje: "",
		},
	});

	async function onSubmit(data: ContactFormValues) {
		if (!turnstileToken) {
			setStatus("error");
			setErrorMessage("Por favor, completa la verificación de seguridad.");
			return;
		}

		setStatus("loading");
		setErrorMessage("");

		try {
			const response = await fetch("/api/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					token: turnstileToken,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.error || "Ocurrió un error al enviar el mensaje.",
				);
			}

			setStatus("success");
			form.reset();
			setTurnstileToken(null);
			turnstileRef.current?.reset();
			setTimeout(() => {
				onSuccess?.();
				setStatus("idle");
			}, 2000);
		} catch (error: unknown) {
			setStatus("error");
			const message =
				error instanceof Error ? error.message : "Error al enviar el correo.";
			setErrorMessage(message);
			turnstileRef.current?.reset();
			setTurnstileToken(null);
		}
	}

	return {
		form,
		status,
		errorMessage,
		turnstileRef,
		setTurnstileToken,
		setStatus,
		setErrorMessage,
		onSubmit: form.handleSubmit(onSubmit),
	};
}
