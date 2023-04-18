import { Fragment, useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

const App = () => {
    const [input, setInput] = useState<string>("");
    const [code, setCode] = useState<string>();

    const ref = useRef<any>();
    const iframe = useRef<any>();

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

        iframe.current.srcdoc = html;
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
        // setCode(result.outputFiles[0].text);
        iframe.current.contentWindow.postMessage(
            result.outputFiles[0].text,
            "*"
        );
    };

    const html = `
        <html>
            <head></head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message', (event) => {
                        try{
                            eval(event.data)
                        }
                        catch(error) {
                            const root = document.querySelector('#root');
                            root.innerHTML = '<div style="color: red;"><h4> Runtime error </h4>' + error + '</div>'
                        }
                        
                    }, false)
                </script>
            </body>
        </html>
    `;

    const onChangeHandler = (val: string) => {
        setInput(val);
    };
    return (
        <Fragment>
            <div>
                <CodeEditor value={input} onChange={onChangeHandler} />
                <textarea
                    rows={5}
                    cols={100}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></textarea>
                <button onClick={inputSubmitHandler}>Submit</button>
            </div>
            <pre> {code}</pre>
            <iframe
                ref={iframe}
                sandbox='allow-scripts'
                srcDoc={html}
                title='code-preview'
            />
        </Fragment>
    );
};

export default App;
