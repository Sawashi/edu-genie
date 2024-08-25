import { InterfaceExam, StructuredExcel, StructuredRow } from "src/interfaces";
import { runGemini } from "../utils/common";

export async function translateToEnglish(text: string): Promise<string> {
	const prefix = "translate to english: ";
	const response = await runGemini(prefix + text);
	return response;
}

// export async function generateMultipleChoiceQuestion(
//   text: string,
//   numberOfOptions: number
// ): Promise<ResponseExam | string> {
//   const prefix = "generate a multiple choice questions: ";
//   const question = await translateToEnglish(text);
//   const suffix =
//     " - have " + numberOfOptions + " options, each option is a word";
//   const formatAnswer = ` and format the answer as {"question": "${question}", "options": [], "answer": ""}`;
//   const response = await runGemini(prefix + question + suffix + formatAnswer);

//   try {
//     // Parse the response string into a ResponseExam object
//     const parsedResponse: ResponseExam = JSON.parse(response);
//     return parsedResponse;
//   } catch (error) {
//     console.error("Failed to parse response:", error);
//     return "failed";
//   }
// }

export async function generateSingleQuestion(
	typeOfKnowledge: string,
	topic: string,
	hint: string,
	level: string,
	numberOfQuestions: string,
	typeOfQuestion: string
) {
	//delay 1s
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const prefix =
		"Create for me " +
		numberOfQuestions +
		" " +
		typeOfQuestion +
		" question about ";
	const content =
		`"` +
		typeOfKnowledge +
		`"` +
		" with topic " +
		`"` +
		topic +
		`"` +
		", the question must include " +
		`"` +
		hint +
		`"` +
		" at level " +
		`"` +
		level +
		`"`;
	const suffix =
		". The answer must be an array with each element have format: ";
	const formatAnswer = `{
    question: string;
    options: string[];
    answer: string;
  }`;
	const promt = prefix + content + suffix + formatAnswer;
	console.log("My prompt: ");
	console.log(promt);
}
export async function generateParagraph(hints: string[]) {
	console.log("Hints: " + hints);
	console.log(hints.length);
	const prefix = "Create for me a random paragraph";
	let content = "";
	if (hints.length > 0) {
		content = " that have following requirements " + hints.join(", ");
	}
	const suffix = ". The answer must be a string about 7 sentences or 200 words";
	const promt = prefix + content + suffix;
	console.log("My prompt: ");
	console.log(promt);
}
export async function generateParagraphQuestion(
	paragraph: string,
	typeOfTopic: string,
	topic: string,
	hint: string,
	recognize: string,
	understand: string,
	apply: string,
	highlyApplied: string
) {
	//delay 1s
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const prefix = "Read the following paragraph and do the requests: ";
	let content =
		"\n Requests: Create for me " +
		`"` +
		typeOfTopic +
		`"` +
		" question about " +
		topic;
	if (hint != "") {
		content += " that " + `"` + hint + `"` + ".";
	}
	content += ". You have to create ";
	if (parseInt(recognize) > 0) {
		content += recognize + " question easy, ";
	}
	if (parseInt(understand) > 0) {
		content += understand + " question medium, ";
	}
	if (parseInt(apply) > 0) {
		content += apply + " question hard, ";
	}
	if (parseInt(highlyApplied) > 0) {
		content += highlyApplied + " question very hard, ";
	}
	const suffix = ". ";
	const promt = prefix + `"` + paragraph + `"` + content + suffix;
	console.log("My prompt: ");
	console.log(promt);
}

export async function generateExam(dataSource: StructuredExcel[]) {
	for (const item of dataSource) {
		if (item.typeOfSection == "Single question combination") {
			//Generate single questions
			for (const topic of item.topicList) {
				const recognize = parseInt(topic.recognize);
				const understand = parseInt(topic.understand);
				const apply = parseInt(topic.apply);
				const highlyApplied = parseInt(topic.highlyApplied);
				//const hintEnglish = await translateToEnglish(topic.hint);
				const hintEnglish = topic.hint;
				//Generate question for recognize
				if (recognize > 0) {
					await generateSingleQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"easy",
						recognize.toString(),
						topic.typeOfTopic
					);
				}
				//Generate question for understand
				if (understand > 0) {
					await generateSingleQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"medium",
						understand.toString(),
						topic.typeOfTopic
					);
				}
				//Generate question for apply
				if (apply > 0) {
					await generateSingleQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"hard",
						apply.toString(),
						topic.typeOfTopic
					);
				}
				//Generate question for highly applied
				if (highlyApplied > 0) {
					await generateSingleQuestion(
						item.typeOfKnowledge,
						topic.topic,
						hintEnglish,
						"very hard",
						highlyApplied.toString(),
						topic.typeOfTopic
					);
				}
			}
		} else {
			//Generate paragraph questions
			//Get all hints, if hints is empty then dont get
			let hints: string[] = [];
			hints = item.topicList
				.map((topic) => {
					if (topic.hint != "") {
						return topic.hint;
					}
				})
				.filter((hint) => hint !== undefined) as string[];
			//Generate paragraph
			console.log("Generate paragraph");
			await generateParagraph(hints);
			//Generate question for paragraph
		}
	}
}
