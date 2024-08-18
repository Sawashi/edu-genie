import { runGemini } from "../utils/common";

export async function translateToEnglish(text: string): Promise<string> {
  const prefix = "translate to english: ";
  const response = await runGemini(prefix + text);
  return response;
}
export interface ResponseExam {
  question: string;
  options: string[];
  answer: string;
}
export async function generateMultipleChoiceQuestion(
  text: string,
  numberOfOptions: number
): Promise<ResponseExam | string> {
  const prefix = "generate a multiple choice questions: ";
  const question = await translateToEnglish(text);
  const suffix =
    " - have " + numberOfOptions + " options, each option is a word";
  const formatAnswer = ` and format the answer as {"question": "${question}", "options": [], "answer": ""}`;
  const response = await runGemini(prefix + question + suffix + formatAnswer);

  try {
    // Parse the response string into a ResponseExam object
    const parsedResponse: ResponseExam = JSON.parse(response);
    return parsedResponse;
  } catch (error) {
    console.error("Failed to parse response:", error);
    return "failed";
  }
}
