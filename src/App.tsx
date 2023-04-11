import { Fragment, useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path.plugin";

const App = () => {
    const [input, setInput] = useState<string>();
    const [code, setCode] = useState<string>();

    const ref = useRef<any>();

    useEffect(() => {
        startService();
    }, []);
    const startService = async () => {
        const service = await esbuild.startService({
            worker: true,
            wasmURL: "/esbuild.wasm",
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
            plugins: [unpkgPathPlugin()],
        });
        console.log(result);
        setCode(result.outputFiles[0].text);
    };
    return (
        <Fragment>
            <div>
                <textarea
                    rows={5}
                    cols={100}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></textarea>
                <button onClick={inputSubmitHandler}>Submit</button>
            </div>
            <pre> {code}</pre>
        </Fragment>
    );
};

export default App;
