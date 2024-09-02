import { Button, Card, Typography, Select, Input } from "antd";
import { useEffect } from "react";
import { InterfaceExam } from "src/interfaces";
import { runGemini } from "src/utils/common";

const { Option } = Select;
const { Title, Paragraph } = Typography;

interface ResultExamProps {
	dataSource: InterfaceExam[];
}

const ResultExam: React.FC<ResultExamProps> = ({ dataSource }) => {
	useEffect(() => {
		console.log("ResultExam");
		console.log(dataSource);
	}, [dataSource]);

	// Helper function to convert index to letter (A, B, C, D, ...)
	const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

	return (
		<Card
			style={{
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
				borderRadius: "8px",
				padding: "20px",
			}}
		>
			<Title level={3}>Exam Results</Title>

			{/* Loop through the exam data */}
			{dataSource.map((knowledgeItem, index) => (
				<Card key={index} style={{ marginBottom: "20px" }}>
					{/* Print the typeOfKnowledge as a title */}
					<Title level={4}>{knowledgeItem.typeOfKnowledge}</Title>

					{/* Check if the paragraph exists and display it */}
					{knowledgeItem.paragraph && (
						<Paragraph>{knowledgeItem.paragraph}</Paragraph>
					)}

					{/* Loop through questions */}
					{knowledgeItem.questions.map((questionItem, qIndex) => (
						<div key={qIndex} style={{ marginBottom: "15px" }}>
							{/* Print the question with a number */}
							<Paragraph>
								<strong>{`${qIndex + 1}. ${questionItem.question}`}</strong>
							</Paragraph>

							{/* Print options only if the typeOfQuestion is not 'Fill in' */}
							{questionItem.typeOfQuestion !== "Fill in" && (
								<ul style={{ paddingLeft: "20px", listStyleType: "none" }}>
									{questionItem.options.map((option, optIndex) => (
										<li key={optIndex}>
											<strong>{`${getOptionLetter(optIndex)}.`}</strong>{" "}
											{option}
										</li>
									))}
								</ul>
							)}
						</div>
					))}
				</Card>
			))}
		</Card>
	);
};

export default ResultExam;
