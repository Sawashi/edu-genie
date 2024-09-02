import { Typography, Button, Space, Modal, Spin, Result } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import React, { useState, useRef, use, useEffect } from "react";
import * as XLSX from "xlsx";
import UploadedStructure from "@components/cards/uploaded";
import Link from "next/link";
import { ExcelDataItem, InterfaceExam, StructuredExcel } from "src/interfaces";
import { Config } from "aws-sdk";
import ConfigQuestion from "@components/cards/configQuestion";
import ResultExam from "@components/cards/resultQuestion";

const { Title } = Typography;

const HomeList: React.FC = () => {
	const [excelData, setExcelData] = useState<any[]>([]);
	const [fileUploaded, setFileUploaded] = useState<boolean>(false); // State to track file upload
	const [constructedData, setConstructedData] = useState<StructuredExcel[]>([]); // State to store constructed data
	const [resultData, setResultData] = useState<InterfaceExam[]>([]); // State to store result data
	const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
	const [loading, setLoading] = useState<boolean>(false);
	// useEffect(() => {
	// 	setResultData([
	// 		{
	// 			typeOfKnowledge: "Pronounce",
	// 			questions: [
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Select the correct pronunciation of the underlined vowel in the word '**lunch**'.",
	// 					options: ["/ʌ/", "/u/", "/ʊ/"],
	// 					answer: "/ʌ/",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Which word below has the same vowel sound as the underlined vowel in **'puncture'**?",
	// 					options: ["putt", "put", "punch", "puck"],
	// 					answer: "puck",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question: "In which word is the H not pronounced?",
	// 					options: ["hospital", "hour", "honor"],
	// 					answer: "hospital",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Which of the following correctly identifies the H sound pronunciation in the word 'honor'?",
	// 					options: ["Silent H", "Aspirated H", "Glottal H", "Voiced H"],
	// 					answer: "Aspirated H",
	// 				},
	// 			],
	// 		},
	// 		{
	// 			typeOfKnowledge: "Reading",
	// 			paragraph:
	// 				"In 1831, English scientist Charles Darwin embarked on a five-year voyage aboard the HMS Beagle, which circumnavigated the globe. During this expedition, he meticulously observed and documented the diverse flora and fauna encountered in various regions, including South America, the Galapagos Islands, and Australia. Darwin's extensive research and observations laid the groundwork for his groundbreaking theory of evolution by natural selection, which revolutionized our understanding of life on Earth. The theory posits that species evolve over time through a gradual process of natural selection, where individuals with traits that enhance their survival and reproduction have a greater chance of passing on their genes to subsequent generations. Darwin's evolutionary theory has had a profound impact on scientific inquiry, challenging long-held beliefs and shaping our comprehension of the origins and diversity of life.",
	// 			questions: [
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Fill in the blank with the appropriate word: Darwin's expedition _____ the globe.",
	// 					options: ["circulated", "circumnavigated", "orbited"],
	// 					answer: "circumnavigated",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Which word best completes the sentence? In 1831, English scientist Charles Darwin embarked on a five-year voyage ____ the HMS Beagle, which circumnavigated the globe.",
	// 					options: ["across", "aboard", "around", "at"],
	// 					answer: "aboard",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"What was the primary goal of Charles Darwin's voyage on the HMS Beagle?",
	// 					options: [
	// 						"To search for new landmasses",
	// 						"To study the Earth's geology",
	// 						"To observe and document the diversity of life",
	// 						"To test his theory of evolution",
	// 					],
	// 					answer: "To observe and document the diversity of life",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"According to the passage, which of the following did Darwin NOT observe and document during his voyage on the HMS Beagle?",
	// 					options: [
	// 						"Flora of South America",
	// 						"Fauna of the Galapagos Islands",
	// 						"Climate patterns in Australia",
	// 						"Habitats of underwater species",
	// 					],
	// 					answer: "Habitats of underwater species",
	// 				},
	// 			],
	// 		},
	// 		{
	// 			typeOfKnowledge: "Vocabulary",
	// 			questions: [
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Which of the following words is NOT a synonym of 'ephemeral'?",
	// 					options: ["fleeting", "temporary", "permanent", "evanescent"],
	// 					answer: "permanent",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"Which of the following words is NOT a synonym of 'edacious'?",
	// 					options: ["ravenous", "voracious", "insatiable", "satiated"],
	// 					answer: "satiated",
	// 				},
	// 				{
	// 					typeOfQuestion: "Multiple choice",
	// 					question:
	// 						"It is time to test your vocabulary. Which word is the antonym of 'happy'?",
	// 					options: ["Sad", "Angry", "Excited", "Confused"],
	// 					answer: "Sad",
	// 				},
	// 			],
	// 		},
	// 	]);
	// }, []);
	// Assuming your JSON data is stored in a variable named `jsonData`
	function convertToStructuredExcel(data: ExcelDataItem[]): StructuredExcel[] {
		const result: StructuredExcel[] = [];

		data.forEach((item) => {
			// Find the group with the same typeOfKnowledge
			let group = result.find(
				(g) => g.typeOfKnowledge === item.typeOfKnowledge
			);

			// If the group doesn't exist, create it
			if (!group) {
				group = {
					typeOfKnowledge: item.typeOfKnowledge,
					typeOfSection: "",
					topicList: [],
				};
				result.push(group);
			}

			// Add the current item as a structuredRow to the group
			group.topicList.push({
				hint: "",
				typeOfTopic: "",
				topic: item.topic,
				recognize: item.recognize ?? "",
				understand: item.understand ?? "",
				apply: item.apply ?? "",
				highlyApplied: item.highlyApplied ?? "",
			});
		});

		return result;
	}
	const handleFileUpload = (file: File) => {
		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e.target && e.target.result) {
				const result = e.target.result;
				const workbook = XLSX.read(result as string, { type: "binary" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

				// Process merged cells to ensure they have the same value
				const mergedCells = worksheet["!merges"] || [];
				mergedCells.forEach((merge: XLSX.Range) => {
					const { s, e } = merge;
					const startRowIndex = s.r;
					const endRowIndex = e.r;
					const startColIndex = s.c;
					const endColIndex = e.c;
					const mergedValue = (data as any[][])[startRowIndex][
						startColIndex
					] as string; // Explicitly type mergedValue as string
					for (let i = startRowIndex; i <= endRowIndex; i++) {
						for (let j = startColIndex; j <= endColIndex; j++) {
							(data as any[][])[i][j] = mergedValue; // Explicitly type data as any[][]
						}
					}
				});

				const slice = data.slice(1);
				let excelDataConvert: ExcelDataItem[] = slice.map((row) => {
					if (Array.isArray(row)) {
						return {
							typeOfKnowledge: row[0] as string,
							topic: row[1] as string,
							recognize: row[2]?.toString() ?? "0",
							understand: row[3]?.toString() ?? "0",
							apply: row[4]?.toString() ?? "0",
							highlyApplied: row[5]?.toString() ?? "0",
						};
					} else {
						throw new Error("Row is not an array");
					}
				});
				//exclude first row of excelData

				const structuredExcel = convertToStructuredExcel(excelDataConvert);

				setConstructedData(structuredExcel);
				setFileUploaded(true); // Set fileUploaded to true after successful upload
				if (fileInputRef.current) {
					fileInputRef.current.value = ""; // Reset file input value after successful upload
				}
				setExcelData(data);
			}
		};

		reader.readAsBinaryString(file);
	};
	// Function to programmatically trigger file upload
	const triggerFileUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Function to download Excel template
	const downloadExcelTemplate = () => {
		// Create data for the template (just one record as an example)
		const templateData = [
			{
				"Type of Knowledge": "Pronounce",
				Topic: "Vowel pronunciation",
				"Recognize (easy)": "5",
				"Understand (normal)": "4",
				"Apply (hard)": "2",
				"Highly Applied (very hard)": "1",
			},
		];

		// Create a new workbook
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet("English Test Template");

		// Define column headers
		sheet.columns = [
			{ header: "Type of Knowledge", key: "Type of Knowledge" },
			{ header: "Topic", key: "Topic" },
			{ header: "Recognize (easy)", key: "Recognize (easy)" },
			{ header: "Understand (normal)", key: "Understand (normal)" },
			{ header: "Apply (hard)", key: "Apply (hard)" },
			{
				header: "Highly Applied (very hard)",
				key: "Highly Applied (very hard)",
			},
		];

		// Add data to the sheet
		templateData.forEach((record) => {
			sheet.addRow(record);
		});

		// Generate Excel file
		workbook.xlsx.writeBuffer().then((buffer) => {
			// Convert buffer to Blob
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			// Save the Blob as a file
			saveAs(blob, "English_Test_Template.xlsx");
		});
	};

	// Function to handle remove file
	const handleRemoveFile = () => {
		Modal.confirm({
			title: "Are you sure you want to remove the uploaded file?",
			onOk() {
				setExcelData([]);
				setFileUploaded(false);
			},
			onCancel() {},
		});
	};

	return (
		<>
			<Title level={2}>Build your own English test!</Title>
			<br />
			<div>
				If you are new, click <Link href="/help">here</Link> for video guide
			</div>
			<br />
			<Space direction="vertical">
				<div>
					<div>
						<input
							type="file"
							accept=".xlsx, .xls"
							ref={fileInputRef}
							onChange={(e) => handleFileUpload(e.target.files![0])}
							style={{ display: "none" }}
							id="excel-upload"
						/>
						<Space>
							<Button
								icon={<DownloadOutlined />}
								onClick={downloadExcelTemplate}
							>
								Download Excel Template
							</Button>
							<Button icon={<UploadOutlined />} onClick={triggerFileUpload}>
								Upload Excel File
							</Button>
						</Space>
					</div>
				</div>
				<div>
					{excelData.length > 0 && (
						<UploadedStructure
							excelData={excelData}
							fileUploaded={fileUploaded}
							handleRemoveFile={handleRemoveFile}
						/>
					)}
				</div>
				<div>
					{excelData.length > 0 && (
						<ConfigQuestion
							dataSource={constructedData}
							setDataSource={setConstructedData}
							setLoading={setLoading}
							setResultData={setResultData}
						/>
					)}
				</div>
				{/* <div>
					{constructedData.map((data, index) => (
						<div key={index}>{JSON.stringify(data)}</div>
					))}
				</div> */}
				{loading && <Spin />}
				{resultData.length > 0 && <ResultExam dataSource={resultData} />}
			</Space>
		</>
	);
};

export default HomeList;
