'use server';

/**
 * @fileOverview AI flow to generate a starting prompt for a fitness test.
 *
 * - generateFitnessPrompt - A function that generates a fitness test prompt.
 * - GenerateFitnessPromptInput - The input type for the generateFitnessPrompt function.
 * - GenerateFitnessPromptOutput - The return type for the generateFitnessPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFitnessPromptInputSchema = z.object({
  fitnessTestType: z
    .string()
    .describe('The type of fitness test to generate a prompt for (e.g., push-up test, squat test).'),
  userExperienceLevel: z
    .string()
    .describe('The user experience level with the fitness test (e.g., beginner, intermediate, advanced).'),
  environment: z
    .string()
    .describe('The environment where the fitness test will be performed (e.g., home, gym, outdoors).'),
});
export type GenerateFitnessPromptInput = z.infer<typeof GenerateFitnessPromptInputSchema>;

const GenerateFitnessPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated fitness test prompt.'),
});
export type GenerateFitnessPromptOutput = z.infer<typeof GenerateFitnessPromptOutputSchema>;

export async function generateFitnessPrompt(input: GenerateFitnessPromptInput): Promise<GenerateFitnessPromptOutput> {
  return generateFitnessPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFitnessPrompt',
  input: {schema: GenerateFitnessPromptInputSchema},
  output: {schema: GenerateFitnessPromptOutputSchema},
  prompt: `You are an AI assistant designed to generate starting prompts for fitness tests.

  Based on the fitness test type, user experience level, and environment, generate a prompt that provides clear instructions for the user on how to perform the test correctly, including ideal pose and setup.

  Fitness Test Type: {{{fitnessTestType}}}
  User Experience Level: {{{userExperienceLevel}}}
  Environment: {{{environment}}}

  Generated Prompt:`, 
});

const generateFitnessPromptFlow = ai.defineFlow(
  {
    name: 'generateFitnessPromptFlow',
    inputSchema: GenerateFitnessPromptInputSchema,
    outputSchema: GenerateFitnessPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
