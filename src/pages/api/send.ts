import { env as _env } from "cloudflare:workers";
import type { APIRoute } from "astro";

const env = _env as unknown as Env;

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

export const POST: APIRoute = async ({ request }) => {
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
				from: "AlanHG2.link <notifications@alanhg2.link>",
				to: [destinationEmail],
				subject: `Mensaje de contacto de ${nombre}`,
				html: `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			background-color: #f4f4f5;
			margin: 0;
			padding: 0;
		}
		.container {
			max-width: 600px;
			margin: 40px auto;
			background-color: #ffffff;
			border-radius: 12px;
			overflow: hidden;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
			border: 1px solid #e4e4e7;
		}
		.header {
			background-color: #18181b;
			color: #ffffff;
			padding: 24px 32px;
			display: flex;
			align-items: center;
			gap: 16px;
		}
		.header img {
			width: 48px;
			height: 48px;
			border-radius: 50%;
			border: 2px solid #3f3f46;
		}
		.header h2 {
			margin: 0;
			font-size: 20px;
			font-weight: 600;
			letter-spacing: -0.025em;
		}
		.content {
			padding: 32px;
		}
		.field {
			margin-bottom: 24px;
		}
		.label {
			font-size: 12px;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: #71717a;
			font-weight: 600;
			margin-bottom: 4px;
		}
		.value {
			font-size: 16px;
			color: #27272a;
			margin: 0;
		}
		.message-box {
			background-color: #f4f4f5;
			border-radius: 8px;
			padding: 16px;
			margin-top: 8px;
			font-size: 15px;
			line-height: 1.6;
			color: #27272a;
			white-space: pre-wrap;
			border: 1px solid #e4e4e7;
		}
		.footer {
			background-color: #fafafa;
			padding: 16px 32px;
			text-align: center;
			font-size: 13px;
			color: #a1a1aa;
			border-top: 1px solid #e4e4e7;
		}
		.tag {
			display: inline-block;
			background-color: #2563eb;
			color: #ffffff;
			font-size: 12px;
			font-weight: 600;
			padding: 4px 12px;
			border-radius: 9999px;
			margin-bottom: 24px;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<img src="https://github.com/alanhg2.png" alt="Alan HG2" />
			<h2>AlanHG2.link</h2>
		</div>
		<div class="content">
			<span class="tag">Nuevo Contacto</span>
			
			<div class="field">
				<div class="label">Nombre</div>
				<div class="value">${nombre}</div>
			</div>
			
			<div class="field">
				<div class="label">Email</div>
				<div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
			</div>
			
			<div class="field">
				<div class="label">Teléfono</div>
				<div class="value">${telefono || "No proporcionado"}</div>
			</div>
			
			<div class="field">
				<div class="label">Mensaje</div>
				<div class="message-box">${mensaje}</div>
			</div>
		</div>
		<div class="footer">
			Este mensaje fue enviado desde el formulario de contacto de tu portafolio.
		</div>
	</div>
</body>
</html>`,
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
