'use server';

/**
 * @fileOverview AI flow for analyzing fitness metrics and providing personalized insights.
 *
 * - analyzeFitnessMetrics - A function that analyzes fitness metrics and provides personalized insights.
 * - AnalyzeFitnessMetricsInput - The input type for the analyzeFitnessMetrics function.
 * - AnalyzeFitnessMetricsOutput - The return type for the analyzeFitnessMetrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFitnessMetricsInputSchema = z.object({
  testType: z.string().describe('The type of fitness test performed (e.g., push-up test, squat test).'),
  metrics: z.record(z.number()).describe('A record of fitness metrics captured during the test.'),
  userProfile: z.object({
    age: z.number().describe('The user\'s age.'),
    gender: z.string().describe('The user\'s gender.'),
    fitnessLevel: z.string().describe('The user\'s current fitness level (e.g., beginner, intermediate, advanced).'),
  }).describe('The user profile information.'),
});
export type AnalyzeFitnessMetricsInput = z.infer<typeof AnalyzeFitnessMetricsInputSchema>;

const AnalyzeFitnessMetricsOutputSchema = z.object({
  overallAssessment: z.string().describe('An overall assessment of the user\'s performance on the fitness test.'),
  strengths: z.array(z.string()).describe('A list of the user\'s strengths based on the fitness test results.'),
  areasForImprovement: z.array(z.string()).describe('A list of areas where the user can improve their fitness.'),
  recommendations: z.array(z.string()).describe('Personalized recommendations for improving fitness based on the test results and user profile.'),
});
export type AnalyzeFitnessMetricsOutput = z.infer<typeof AnalyzeFitnessMetricsOutputSchema>;

export async function analyzeFitnessMetrics(input: AnalyzeFitnessMetricsInput): Promise<AnalyzeFitnessMetricsOutput> {
  return analyzeFitnessMetricsFlow(input);
}

const analyzeFitnessMetricsPrompt = ai.definePrompt({
  name: 'analyzeFitnessMetricsPrompt',
  input: {schema: AnalyzeFitnessMetricsInputSchema},
  output: {schema: AnalyzeFitnessMetricsOutputSchema},
  prompt: `You are a certified fitness trainer providing personalized insights and recommendations based on fitness test metrics.

  Analyze the following fitness test data and user profile to provide an overall assessment, identify strengths and areas for improvement, and offer personalized recommendations.

  Test Type: {{{testType}}}
  Metrics: {{#each (metrics)}}{{{@key}}}: {{{this}}} {{/each}}
  User Profile: Age: {{{userProfile.age}}}, Gender: {{{userProfile.gender}}}, Fitness Level: {{{userProfile.fitnessLevel}}}

  Provide a concise and actionable report.
  `,
});

const analyzeFitnessMetricsFlow = ai.defineFlow(
  {
    name: 'analyzeFitnessMetricsFlow',
    inputSchema: AnalyzeFitnessMetricsInputSchema,
    outputSchema: AnalyzeFitnessMetricsOutputSchema,
  },
  async input => {
    const {output} = await analyzeFitnessMetricsPrompt(input);
    return output!;
  }
);
