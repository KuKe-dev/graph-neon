import { EditableMathField } from "react-mathquill";
import { StaticMathField  } from "react-mathquill";
import { latex_to_js } from "../../../utilities/latexToJs";

import "./LatexInput.css";
import { useRef } from "react";
import { useState } from "react";

export default function LatexInput({ latexValue, functionValue, setFunctionValue }) {

    const [canKeyboard, setCanKeyboard] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const mathFieldRef = useRef(null);

    function HanddleLatexInput(mathField) {
        setFunctionValue(latex_to_js(mathField.latex()));
    }

    function HanddleCanKeyboard() {
        if (canKeyboard) {
            setCanKeyboard(false);
            setShowKeyboard(false);
        } else {
            setCanKeyboard(true);
            setShowKeyboard(true);
            mathFieldRef.current.focus();
        }
    }

    function HanddleKeyboardKey(keyValue) {
        if (!mathFieldRef.current) return;

        mathFieldRef.current.keystroke("/");
        mathFieldRef.current.focus();
    }

    function HanddleKeyboardControls(direction) {   
        if (!mathFieldRef.current) return;

        switch (direction) {
            case 'left':
                mathFieldRef.current.keystroke('Left');
                break;
            case 'right':
                mathFieldRef.current.keystroke('Right');
                break;
            case 'backspace':
                mathFieldRef.current.keystroke('Backspace');
                break;
            case 'delete':
                mathFieldRef.current.keystroke('Delete');
                break;
            case 'esc':
                mathFieldRef.current.keystroke('Esc');
                break;
            default:
                break;
        }

        mathFieldRef.current.focus();
    }

    return (
        <div className="latex-input">
            <div style={{background: "none"}}>
                <EditableMathField
                    id="my-math-input"
                    mathquillDidMount={(mf) => mathFieldRef.current = mf}
                    style={{color: "white", display: "inline-block", padding: "10px", marginTop: "10px", marginBottom: "10px", fontSize: "20px"}}
                    latex={latexValue}
                    onFocus={() => { canKeyboard ? setShowKeyboard(true) : null; }}
                    onBlur={() => { setShowKeyboard(false) }}
                    onChange={ mathField => HanddleLatexInput(mathField) }
                />
            </div>

            <input style={{display: `${import.meta.env.VITE_PRODUCTION =='false' ? "block" : "none"}`, width: "100%"}} type="text" value={mathFieldRef.current ? mathFieldRef.current.latex() : ""} />

            <input style={{display: `${import.meta.env.VITE_PRODUCTION =='false' ? "block" : "none"}`, width: "100%"}} type="text" value={functionValue} onChange={(e) => setFunctionValue(e.target.value)} />

            <button className="keyboard-active-button"
                onClick={HanddleCanKeyboard}
            >keyboard</button>

            <div id="latex-keyboard" style={{ display: showKeyboard ? "block" : "none"}}
                onMouseDown={(e) => e.preventDefault()}
            >
                <div style={{display: "flex"}}>
                    <ul>
                        <button onClick={() => HanddleKeyboardKey('\\pi')}><StaticMathField >{'\\pi'}</StaticMathField></button>
                    </ul>
                    <ul className="keyboard-numbers-grid">
                        <button onClick={() => HanddleKeyboardKey('1')}>1</button>
                        <button onClick={() => HanddleKeyboardKey('2')}>2</button>
                        <button onClick={() => HanddleKeyboardKey('3')}>3</button>
                        <button onClick={() => HanddleKeyboardKey('/')}>÷</button>
                        <button>4</button>
                        <button>5</button>
                        <button>6</button>
                        <button>*</button>
                        <button>7</button>
                        <button>8</button>
                        <button>9</button>
                        <button>-</button>
                        <button>0</button>
                        <button>.</button>
                        <button>=</button>
                        <button>+</button>
                    </ul>
                    <ul>
                        <button onClick={() => HanddleKeyboardControls("left")}>{"<="}</button>
                        <button onClick={() => HanddleKeyboardControls("right")}>{"=>"}</button>
                        <button onClick={() => HanddleKeyboardControls("backspace")}>{"⌫"}</button>
                    </ul>
                </div>
            </div>
        </div>
    )
}