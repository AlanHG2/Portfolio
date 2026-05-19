import * as z from "zod";

export const contactFormSchema = z.object({
	nombre: z
		.string()
		.min(1, "El nombre es requerido.")
		.min(3, "El nombre debe tener al menos 3 caracteres.")
		.max(50, "El nombre debe tener máximo 50 caracteres."),
	email: z.email("Debe ingresar un correo electrónico válido."),
	telefono: z
		.string()
		.min(1, "El teléfono es requerido.")
		.regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos."),
	mensaje: z
		.string()
		.min(1, "El mensaje es requerido.")
		.min(10, "El mensaje debe tener al menos 10 caracteres.")
		.max(150, "El mensaje no debe exceder los 150 caracteres."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
