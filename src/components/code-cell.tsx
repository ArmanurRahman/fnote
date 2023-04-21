import { useEffect, useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import builder from "../build";
import Resizable from "./resizable";

const CodeCell = () => {
    const [input, setInput] = useState<string>("");
    const [code, setCode] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(async () => {
            const output = await builder(input);
            setCode(output);
        }, 750);

        return () => {
            clearTimeout(timer);
        };
    }, [input]);
    return (
        <Resizable direction='vertical'>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Resizable direction='horizontal'>
                    <CodeEditor
                        value='const a = 1;'
                        onChange={(value) => setInput(value)}
                    />
                </Resizable>
                <Preview code={code} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
