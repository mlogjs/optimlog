import "./style.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Editor, { Monaco } from "@monaco-editor/react";
import SplitPane from "react-split-pane";
import { editor } from "monaco-editor";
import {
	Context,
	getBasicInferedValueMap,
	getLabelMap,
	getLandAddresses,
	LogLevel,
	replaceCounterAddress,
	spanLineDirectives,
	toBlockMap,
	toInstructions,
	toTokenizedLines,
	unlabelJumps,
} from "../src";

function App() {
	const [mount, setMount] = useState<[editor.IStandaloneCodeEditor, Monaco]>();
	const [code, setCode] = useState(localStorage.code ?? "");
	const [output, setOutput] = useState("");

	function update(code: string) {
		localStorage.code = code;
		if (!mount) return;
		const [editor, monaco] = mount;
		const model = editor.getModel();

		const ctx: Context = {
			logs: [],
			options: {
				unsafeReplaceLabel: false,
			},
		};

		try {
			let lines = toTokenizedLines(ctx, code);
			const labels = getLabelMap(ctx, lines);
			lines = unlabelJumps(ctx, lines, labels);
			lines = replaceCounterAddress(ctx, lines);
			lines = spanLineDirectives(ctx, lines);
			let instructions = toInstructions(ctx, lines);
			const values = getBasicInferedValueMap(ctx, instructions);
			const lands = getLandAddresses(ctx, instructions, values);
			let blocks = toBlockMap(ctx, instructions, values, lands);
			setOutput(JSON.stringify(blocks, null, 2));
		} catch {}

		const severityMap: Record<LogLevel, any> = {
			warn: monaco.MarkerSeverity.Warning,
			error: monaco.MarkerSeverity.Error,
			info: monaco.MarkerSeverity.Info,
			debug: monaco.MarkerSeverity.Hint,
		} as const;

		monaco.editor.setModelMarkers(
			model,
			"optimlog",
			ctx.logs.map(({ message, location, level, details }) => ({
				message: message + "\n" + details,
				startLineNumber: location.start.line,
				startColumn: location.start.column,
				endLineNumber: location.end.line,
				endColumn: location.end.column,
				severity: severityMap[level],
			}))
		);

		setCode(code);
	}

	useEffect(() => {
		update(code);
	}, [mount]);

	return (
		<SplitPane split="vertical" allowResize={true} defaultSize="50%">
			<Editor
				height="100%"
				onMount={(...mount) => setMount(mount as any)}
				onChange={update}
				value={code}
			/>
			<Editor
				height="100%"
				options={{ readOnly: true }}
				value={output}
				language="json"
			/>
		</SplitPane>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("app")
);
