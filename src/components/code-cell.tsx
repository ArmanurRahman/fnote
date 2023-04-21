import { Fragment, useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import builder from "../build";

const CodeCell = () => {
    const [input, setInput] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const inputSubmitHandler = async () => {
        const result = await builder(input);
        setCode(result);
    };

    const onChangeHandler = (val: string) => {
        setInput(val);
    };
    return (
        <Fragment>
            <div>
                <CodeEditor value={input} onChange={onChangeHandler} />
                <button onClick={inputSubmitHandler}>Submit</button>
            </div>
            <Preview code={code} />
        </Fragment>
    );
};

export default CodeCell;
