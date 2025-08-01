import z from "zod";
import { generateObject } from "ai";
import { getSimilarArticles } from "./get-context";
import { google } from "@ai-sdk/google";
import { DAILY_TOKEN_LIMIT } from "./constants";

export const model = google("gemini-2.0-flash");

export const schema = z.object({
  path: z
    .string()
    .describe(
      "The path name to navigate to. Must be one of: 'contact', 'projects' (which is for all projects), or one of the project article slugs."
    ),
  response: z
    .string()
    .describe(
      "A short message to the user, answering their question with something like : 'This article might be able to answer your question.' or 'I couldn't find any relevant articles, but you can contact me for more information.', or anything else from the context that might be relevant."
    ),
});

export const getAIRoute = async (
  message: string
): Promise<{ object: z.infer<typeof schema>; tokens: number }> => {
  try {
    let system = "You're Tudor, the owner of the portfolio website. You have some articles about projects I worked on and other pages on this site. Try to answer the user's question based on the context provided, by redirecting them to the specific article that is most relevant.\n";
    const { context, tokens: contextTokens } = await getSimilarArticles(message);
    if (context && context !== "") {
      system += `Context: ${context}\n`;
    }
    const { object, usage } = await generateObject({
      model,
      schema,
      system,
      messages: [
        { role: "user" as const, content: message },
      ],
      maxTokens: Math.floor(DAILY_TOKEN_LIMIT / 2),
    });
    const totalTokens = contextTokens + usage.totalTokens;
    return { object, tokens: totalTokens };
  } catch (error) {
    console.error("Error in getAIRoute:", error);
    throw error;
  }
};
