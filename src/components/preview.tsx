import { useEffect, useRef } from "react";
import "./preview.css";
interface PreviewData {
    code: string;
}

const html = `
        <html>
            <head>
                <style>html { background-color: white; }</style>
          </head>
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

const Preview: React.FC<PreviewData> = ({ code }) => {
    const iframe = useRef<any>();
    useEffect(() => {
        iframe.current.srcdoc = html;
        iframe.current.contentWindow.postMessage(code, "*");
    }, [code]);

    return (
        <div className='preview-wrapper'>
            <iframe
                ref={iframe}
                sandbox='allow-scripts'
                srcDoc={html}
                title='code-preview'
            />
        </div>
    );
};

export default Preview;
