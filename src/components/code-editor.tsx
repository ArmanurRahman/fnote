import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";
import "./code-editor.css";

interface CodeEditorProps {
    value: string;
    onChange: (a: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<any>();
    const onEditorMount: EditorDidMount = (getValue, monacoEditor) => {
        editorRef.current = monacoEditor;
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });

        monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    };

    const formateCodeHandler = () => {
        const unformatedCode = editorRef.current.getModel().getValue();

        const formattedCode = prettier
            .format(unformatedCode, {
                parser: "babel",
                plugins: [parser],
                useTabs: false,
                singleQuote: true,
                semi: true,
            })
            .replace(/\n$/, "");

        editorRef.current.setValue(formattedCode);
    };
    return (
        <div className='editor-wrapper'>
            <button
                className='button button-format is-primary is-small'
                onClick={formateCodeHandler}
            >
                Format
            </button>
            <MonacoEditor
                value={value}
                editorDidMount={onEditorMount}
                height='500px'
                theme='dark'
                language='javascript'
                options={{
                    wordWrap: "on",
                    minimap: {
                        enabled: false,
                    },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
export default CodeEditor;
