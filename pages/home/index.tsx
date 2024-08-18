import { Typography, Button, Space, Modal } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import UploadedStructure from "@components/cards/uploaded";
import Link from "next/link";
import { ExcelDataItem } from "src/interfaces";

const { Title } = Typography;

const HomeList: React.FC = () => {
	const [excelData, setExcelData] = useState<any[]>([]);
	const [fileUploaded, setFileUploaded] = useState<boolean>(false); // State to track file upload
	const [constructedData, setConstructedData] = useState<ExcelDataItem[]>([]); // State to store constructed data
	const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element

	// Assuming your JSON data is stored in a variable named `jsonData`

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

				setExcelData(data);
				const excelData: ExcelDataItem[] = (data.slice(1) as unknown[][]).map(
					(row) => {
						if (Array.isArray(row)) {
							return {
								typeOfKnowledge: row[0] as string,
								topic: row[1] as string,
								recognize: row[2]?.toString() ?? null,
								understand: row[3]?.toString() ?? null,
								apply: row[4]?.toString() ?? null,
								highlyApplied: row[5]?.toString() ?? null,
							};
						} else {
							throw new Error("Row is not an array");
						}
					}
				);
				setConstructedData(excelData);
				setFileUploaded(true); // Set fileUploaded to true after successful upload
				if (fileInputRef.current) {
					fileInputRef.current.value = ""; // Reset file input value after successful upload
				}
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
			</Space>
		</>
	);
};

export default HomeList;
