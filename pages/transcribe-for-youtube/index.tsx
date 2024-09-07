import React, { useState } from "react";
import { Input, Button, Card, Spin, message } from "antd";

const { TextArea } = Input;

const YouTubeTranscriber: React.FC = () => {
	const [youtubeUrl, setYoutubeUrl] = useState("");
	const [transcript, setTranscript] = useState("");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);

	const handleTranscribe = async () => {
		setLoading(true);
		try {
			// Extract video ID from YouTube URL
			const videoId = youtubeUrl.split("v=")[1].split("&")[0];

			// Fetch the transcript from your serverless API
			const transcriptResponse = await fetch(
				`/api/youtube-transcript?videoId=${videoId}`
			);
			const transcriptData = await transcriptResponse.json();

			if (transcriptResponse.ok) {
				const transcriptText = transcriptData.transcript;
				setTranscript(transcriptText);

				// Use the summarize API route to get the summary
				const summaryResponse = await fetch("/api/summarize", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ transcript: transcriptText }),
				});

				const summaryData = await summaryResponse.json();
				if (summaryResponse.ok) {
					setSummary(summaryData.summary);
				} else {
					message.error("Failed to generate summary.");
					setSummary("");
				}
			} else {
				message.error("Failed to fetch transcript.");
				setTranscript("Could not fetch the transcript.");
			}
		} catch (error) {
			message.error(
				"Failed to fetch transcript or generate summary. Please try again."
			);
			setTranscript("Could not fetch the transcript.");
			setSummary("");
		}
		setLoading(false);
	};

	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
			<Card title="YouTube Video Transcriber" bordered={false}>
				<Input
					placeholder="Enter YouTube URL"
					value={youtubeUrl}
					onChange={(e) => setYoutubeUrl(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>
				<Button
					type="primary"
					onClick={handleTranscribe}
					disabled={!youtubeUrl}
				>
					Transcribe & Summarize
				</Button>
				{loading && <Spin style={{ marginLeft: "20px" }} />}
			</Card>

			<Card title="Transcribe" bordered={false} style={{ marginTop: "20px" }}>
				<TextArea value={transcript} rows={10} readOnly />
			</Card>

			<Card title="Summary" bordered={false} style={{ marginTop: "20px" }}>
				<TextArea value={summary} rows={5} readOnly />
			</Card>
		</div>
	);
};

export default YouTubeTranscriber;
