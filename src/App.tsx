import { Fragment, useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import Preview from "./components/preview";

const App = () => {
    const [input, setInput] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const ref = useRef<any>();

    useEffect(() => {
        startService();
    }, []);
    const startService = async () => {
        const service = await esbuild.startService({
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
        });
        ref.current = service;
    };
    const inputSubmitHandler = async () => {
        if (!ref.current) {
            return;
        }
        // const result = await ref.current.transform(input, {
        //     loader: "jsx",
        //     target: "es2015",
        // });

        const result = await ref.current.build({
            entryPoints: ["index.js"],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(input)],
            define: {
                "process.env.NODE_ENV": '"production"',
                global: "window",
            },
        });
        // console.log(result);
        setCode(result.outputFiles[0].text);
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
