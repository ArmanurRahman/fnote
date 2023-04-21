import { Fragment, useState } from "react";
import CodeEditor from "./components/code-editor";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import Preview from "./components/preview";
import builder from "./build";

const App = () => {
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

export default App;
