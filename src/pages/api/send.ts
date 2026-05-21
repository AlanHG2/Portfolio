import type { APIRoute } from "astro";

interface ContactRequestBody {
	nombre: string;
	email: string;
	telefono?: string;
	mensaje: string;
	token: string;
}

interface TurnstileVerifyResponse {
	success: boolean;
	"error-codes"?: string[];
}

interface ResendErrorResponse {
	message: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		// 1. Validar el cuerpo de la petición
		let body: ContactRequestBody;
		try {
			body = (await request.json()) as ContactRequestBody;
		} catch {
			return new Response(
				JSON.stringify({
					error: "El cuerpo de la petición no es JSON válido.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const { nombre, email, telefono, mensaje, token } = body;

		if (!nombre || !email || !mensaje || !token) {
			return new Response(
				JSON.stringify({
					error: "Faltan campos obligatorios o el token de seguridad.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Acceder a las variables de entorno via runtime de Cloudflare
		// En @astrojs/cloudflare las env vars se exponen en locals.runtime.env
		const env =
			(locals as { runtime?: { env?: Record<string, string> } }).runtime?.env ??
			{};

		// 2. Validar el token contra Cloudflare Turnstile
		const TURNSTILE_SECRET_KEY =
			env.TURNSTILE_SECRET_KEY ??
			import.meta.env.TURNSTILE_SECRET_KEY ??
			"1x00000000000000000000000000000000";
		const ip = request.headers.get("CF-Connecting-IP") ?? "";

		const turnstileVerifyResponse = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					secret: TURNSTILE_SECRET_KEY,
					response: token,
					remoteip: ip,
				}),
			},
		);

		const turnstileResult =
			(await turnstileVerifyResponse.json()) as TurnstileVerifyResponse;

		if (!turnstileResult.success) {
			return new Response(
				JSON.stringify({
					error: "La verificación de seguridad de Turnstile falló.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// 3. Enviar el email usando Resend
		const RESEND_API_KEY = env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;

		if (!RESEND_API_KEY) {
			console.warn("RESEND_API_KEY no configurado. Simulando envío exitoso.");
			return new Response(
				JSON.stringify({
					success: true,
					mock: true,
					message: "Email simulado con éxito (RESEND_API_KEY no definido).",
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);
		}

		const destinationEmail =
			env.TO_EMAIL ?? import.meta.env.TO_EMAIL ?? "alanhg.public@gmail.com";

		const resendResponse = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: "Contacto Portfolio <onboarding@resend.dev>",
				to: [destinationEmail],
				subject: `Mensaje de contacto de ${nombre}`,
				html: `
					<h2>Nuevo mensaje de contacto desde tu Portfolio</h2>
					<p><strong>Nombre:</strong> ${nombre}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Teléfono:</strong> ${telefono ?? "No proporcionado"}</p>
					<p><strong>Mensaje:</strong></p>
					<p style="white-space: pre-wrap;">${mensaje}</p>
				`,
			}),
		});

		const resendResult = await resendResponse.json();

		if (!resendResponse.ok) {
			const errorMsg =
				(resendResult as ResendErrorResponse).message ??
				"Error al enviar el email con Resend.";
			return new Response(JSON.stringify({ error: errorMsg }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify({ success: true, data: resendResult }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Error interno del servidor.";
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
