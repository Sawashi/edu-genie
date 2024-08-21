import { Button, Card, Table, Typography, Select, Input } from "antd";
import { useState, useEffect } from "react";
import { StructuredExcel, StructuredRow } from "src/interfaces";
const { Option } = Select;
const { Title } = Typography;

interface ConfigQuestionProps {
	dataSource: StructuredExcel[];
}

const ConfigQuestion: React.FC<ConfigQuestionProps> = (props) => {
	const [typeOfKnowledgeConfig, setTypeOfKnowledgeConfig] = useState<
		{ typeOfKnowledge: string; typeOfSection: string }[]
	>([]);
	const [topicConfig, setTopicConfig] = useState<StructuredExcel[]>(
		props.dataSource
	);

	useEffect(() => {
		// Initialize typeOfKnowledgeConfig with data from props
		const initialConfig = props.dataSource.map((item) => ({
			typeOfKnowledge: item.typeOfKnowledge,
			typeOfSection: item.typeOfSection || "Select", // default value if empty
		}));
		setTypeOfKnowledgeConfig(initialConfig);
	}, [props.dataSource]);

	function logData() {
		console.log("typeOfKnowledgeConfig");
		console.log(typeOfKnowledgeConfig);
		console.log("topicConfig");
		console.log(topicConfig);
	}

	const handleTypeOfSectionChange = (
		value: string,
		record: StructuredExcel
	) => {
		setTypeOfKnowledgeConfig((prev) => {
			const index = prev.findIndex(
				(item) => item.typeOfKnowledge === record.typeOfKnowledge
			);

			if (index !== -1) {
				const updatedConfig = [...prev];
				updatedConfig[index] = {
					...updatedConfig[index],
					typeOfSection: value,
				};
				return updatedConfig;
			}

			return prev;
		});
		const sectionMapping: { [key: string]: string } =
			typeOfKnowledgeConfig.reduce((acc, item) => {
				acc[item.typeOfKnowledge] = item.typeOfSection;
				return acc;
			}, {} as { [key: string]: string });

		// Update topicConfig
		const updatedArray2 = topicConfig.map((item) => ({
			...item,
			typeOfSection: sectionMapping[item.typeOfKnowledge] || item.typeOfSection,
		}));
		setTopicConfig(updatedArray2);
	};

	const handleTopicTypeChange = (
		value: string,
		record: StructuredRow,
		parentIndex: number
	) => {
		const newData = [...topicConfig];
		newData[parentIndex].topicList = newData[parentIndex].topicList.map(
			(item) =>
				item.topic === record.topic ? { ...item, typeOfTopic: value } : item
		);
		setTopicConfig(newData);
	};

	const handleHintChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		record: StructuredRow,
		parentIndex: number
	) => {
		const newData = [...topicConfig];
		newData[parentIndex].topicList = newData[parentIndex].topicList.map(
			(item) =>
				item.topic === record.topic ? { ...item, hint: e.target.value } : item
		);
		setTopicConfig(newData);
	};

	const typeOfKnowledgeColumns = [
		{
			title: "Type of knowledge",
			dataIndex: "typeOfKnowledge",
			key: "typeOfKnowledge",
		},
		{
			title: "Type of section",
			key: "typeOfSection",
			render: (_: any, record: StructuredExcel) => (
				<Select
					value={
						typeOfKnowledgeConfig.find(
							(item) => item.typeOfKnowledge === record.typeOfKnowledge
						)?.typeOfSection || "Select"
					}
					style={{ width: 200 }}
					onChange={(value) => handleTypeOfSectionChange(value, record)}
				>
					<Option value="Paragraph">Paragraph</Option>
					<Option value="Single question combination">
						Single question combination
					</Option>
				</Select>
			),
		},
	];

	const topicColumns = (parentIndex: number) => [
		{
			title: "Topic name",
			dataIndex: "topic",
			key: "topic",
		},
		{
			title: "Topic type",
			key: "typeOfTopic",
			render: (_: any, record: StructuredRow) => (
				<Select
					value={record.typeOfTopic}
					style={{ width: 200 }}
					onChange={(value) =>
						handleTopicTypeChange(value, record, parentIndex)
					}
				>
					<Option value="Fill in">Fill in</Option>
					<Option value="Multiple choice">Multiple choice</Option>
				</Select>
			),
		},
		{
			title: "Hint",
			key: "hint",
			render: (_: any, record: StructuredRow) => (
				<Input
					value={record.hint}
					onChange={(e) => handleHintChange(e, record, parentIndex)}
				/>
			),
		},
	];

	return (
		<Card
			style={{
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
				borderRadius: "8px",
			}}
		>
			<Title level={3}>Config data generate</Title>
			<div>
				<h2>Config type of knowledge</h2>
				<Table
					dataSource={topicConfig}
					columns={typeOfKnowledgeColumns}
					rowKey="typeOfKnowledge"
					pagination={false}
				/>

				<h2>Config topics</h2>
				{topicConfig.map((item, index) => (
					<Table
						key={item.typeOfKnowledge}
						dataSource={item.topicList}
						columns={topicColumns(index)}
						rowKey="topic"
						pagination={false}
						style={{ marginBottom: "20px" }}
					/>
				))}
			</div>
			<Button type="primary" onClick={logData}>
				Log data
			</Button>
		</Card>
	);
};

export default ConfigQuestion;
