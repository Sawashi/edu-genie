import { Button, Card, Table, Typography, Select, Input } from "antd";
import { useState, useEffect } from "react";
import { InterfaceExam, StructuredExcel, StructuredRow } from "src/interfaces";
import { runGemini } from "src/utils/common";
const { Option } = Select;
const { Title } = Typography;

interface ResultExamProps {
	dataSource: InterfaceExam[];
}

const ResultExam: React.FC<ResultExamProps> = (props) => {
	return (
		<Card
			style={{
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
				borderRadius: "8px",
			}}
		>
			<Title level={3}>Result</Title>
			<div>Oh hi</div>
		</Card>
	);
};

export default ResultExam;
