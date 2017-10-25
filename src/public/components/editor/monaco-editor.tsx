import * as React from 'react';
import CSSModules from 'react-css-modules';
const styles = require("./monaco-editor.css");

interface MonacoEditorProps {
    code: string,
    onCodeChange: (code: string) => void;
}

interface MonacoEditorState {

}

@CSSModules(styles)
export class MonacoEditor extends React.Component<MonacoEditorProps, MonacoEditorState>{
    private monacoContainer: HTMLDivElement = null;
    private monacoEditor: monaco.editor.IStandaloneCodeEditor = null;
    private monacoOnDidChangeModelContent: monaco.IDisposable = null;
    private skipNextChangeEvent: boolean = false;

    constructor() {
        super();
    }

    componentDidMount() {
        //rendering monaco editor
        (window as any).require(['vs/editor/editor.main'], () => {
            this.monacoEditor = monaco.editor.create(this.monacoContainer, {
                theme: "vs-dark",
                value: this.props.code,
                language: 'javascript'
            });
            this.monacoOnDidChangeModelContent = this.monacoEditor.onDidChangeModelContent(() => {
                if (this.skipNextChangeEvent) {
                    this.skipNextChangeEvent = false;
                    return;
                }
                this.props.onCodeChange(this.monacoEditor.getModel().getValue());                
            })
        });
    }

    componentWillUnmount() {
        //destroying monaco editor
    }

    componentDidUpdate(_prevProps: MonacoEditorProps, _prevState: MonacoEditorState) {
        if (this.monacoEditor) {
            this.skipNextChangeEvent = true;
            const position = this.monacoEditor.getPosition();
            this.monacoEditor.getModel().setValue(this.props.code);
            this.monacoEditor.setPosition(position);
        }
    }

    shouldComponentUpdate(nextProps: MonacoEditorProps, _nextState: MonacoEditorState) {
        return !this.monacoEditor || this.monacoEditor.getModel().getValue() !== nextProps.code;
    }

    render() {
        return <div className={styles.container} ref={(div) => { this.monacoContainer = div; }}></div>
    }
}