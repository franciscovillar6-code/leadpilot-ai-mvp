import { createServerFn } from "@tanstack/react-start";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";

import { SCORING_RUBRIC, type LeadAnalysis } from "./scoring";

const InquiryInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(255).optional().default(""),
  phone: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(10).max(4000),
});

export type InquiryInput = z.infer<typeof InquiryInput>;

const analysisSchema = z.object({
  score: z.number(),
  priority: z.enum(["high", "medium", "low"]),
  intentLevel: z.enum(["high", "medium", "low"]),
  intent: z.string(),
  destination: z.string(),
  travelers: z.number(),
  tripType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  customerInfo: z.string(),
  scoreReason: z.string(),
  scoreFactors: z.array(
    z.object({
      criterion: z.string(),
      impact: z.enum(["positive", "negative"]),
      points: z.number(),
      detail: z.string(),
    }),
  ),
  missingInfo: z.array(z.string()),
  nextAction: z.string(),
  suggestedResponse: z.string(),
});

export type AnalyzedInquiry = LeadAnalysis & { tripType: string };

export const analyzeInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InquiryInput.parse(input))
  .handler(async ({ data }): Promise<AnalyzedInquiry> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Falta LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key, undefined, {
      structuredOutputs: true,
    });

    const today = new Date().toISOString().slice(0, 10);

    const prompt = `Fecha de hoy: ${today}

Analizá la siguiente consulta comercial recibida por una agencia de viajes.

Nombre: ${data.name}
Email: ${data.email || "no informado"}
Teléfono: ${data.phone || "no informado"}
Consulta: """${data.message}"""

${SCORING_RUBRIC}

Instrucciones adicionales:
- Extraé destino, cantidad de viajeros, fechas (formato YYYY-MM-DD) y presupuesto estimado en USD desde el texto.
- Si un dato no está informado: destino "Sin definir", travelers 0, budget 0, fechas "" (string vacío).
- tripType: una etiqueta corta (Familia, Luna de miel, Corporativo, Aventura, Grupo, Individual, etc.).
- intent: una frase de 2 a 5 palabras que describa la intención (ej. "Listo para reservar", "Explorando opciones").
- scoreReason: 1 a 3 oraciones explicando el score.
- missingInfo: lista de datos concretos que faltan para avanzar (máximo 5 ítems, texto breve).
- nextAction: una acción comercial concreta.
- suggestedResponse: mensaje listo para enviar al cliente, en español, tono profesional y cálido, máximo 100 palabras.
- Respondé siempre en español.`;

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        output: Output.object({ schema: analysisSchema }),
        prompt,
      });

      const output = await result.output;

      return {
        ...output,
        score: Math.max(0, Math.min(100, Math.round(output.score))),
        travelers: Math.max(0, Math.round(output.travelers)),
        budget: Math.max(0, Math.round(output.budget)),
        missingInfo: output.missingInfo.slice(0, 5),
        scoreFactors: output.scoreFactors.slice(0, 8),
      };
    } catch (error) {
      console.error("[analyzeInquiry]", error);
      if (NoObjectGeneratedError.isInstance(error)) {
        console.error("[analyzeInquiry] raw text:", error.text);
        throw new Error("La IA no devolvió un análisis válido. Intentá nuevamente.");
      }
      throw error;
    }
  });
