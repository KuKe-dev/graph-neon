import { EditableMathField } from "react-mathquill";
import { StaticMathField  } from "react-mathquill";
import { latex_to_js } from "../../../utilities/latexToJs";

import "./LatexInput.css";
import { useRef } from "react";
import { useState } from "react";

export default function LatexInput({ latexValue, functionValue, setFunctionValue }) {

    const [canKeyboard, setCanKeyboard] = useState(true);
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

        mathFieldRef.current.cmd(keyValue);
    }

    function HanddleKeyboardControls(direction) {   
        if (!mathFieldRef.current) return;

        mathFieldRef.current.keystroke(direction);

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
                    <ul className="keyboard-numbers-grid">
                        <button onClick={() => HanddleKeyboardKey('x')}>x</button>
                        <button onClick={() => HanddleKeyboardKey('y')}>y</button>
                        <button onClick={() => {HanddleKeyboardKey("^"); HanddleKeyboardKey("2")}}>a²</button>
                        <button onClick={() => HanddleKeyboardKey('^')}>aⁿ</button>
                        <button onClick={() => HanddleKeyboardKey('(')}>(</button>
                        <button onClick={() => HanddleKeyboardKey(')')}>)</button>
                        <button onClick={() => HanddleKeyboardKey('√')}>√</button>
                        <button onClick={() => HanddleKeyboardKey('\\nthroot')}>ⁿ√</button>
                        <button onClick={() => HanddleKeyboardKey('log')}>log</button>
                        <button onClick={() => HanddleKeyboardKey(',')}>,</button>
                        <button onClick={() => HanddleKeyboardKey('e')}>e</button>
                        <button onClick={() => HanddleKeyboardKey('π')}>π</button>
                    </ul>

                    <ul className="keyboard-numbers-grid">
                        <button onClick={() => HanddleKeyboardKey("1")}>1</button>
                        <button onClick={() => HanddleKeyboardKey("2")}>2</button>
                        <button onClick={() => HanddleKeyboardKey("3")}>3</button>
                        <button onClick={() => HanddleKeyboardKey('/')}>÷</button>
                        <button onClick={() => HanddleKeyboardKey("4")}>4</button>
                        <button onClick={() => HanddleKeyboardKey("5")}>5</button>
                        <button onClick={() => HanddleKeyboardKey("6")}>6</button>
                        <button onClick={() => HanddleKeyboardKey('*')}>*</button>
                        <button onClick={() => HanddleKeyboardKey("7")}>7</button>
                        <button onClick={() => HanddleKeyboardKey("8")}>8</button>
                        <button onClick={() => HanddleKeyboardKey("9")}>9</button>
                        <button onClick={() => HanddleKeyboardKey('-')}>-</button>
                        <button onClick={() => HanddleKeyboardKey("0")}>0</button>
                        <button onClick={() => HanddleKeyboardKey('.')}>.</button>
                        <button onClick={() => HanddleKeyboardKey('=')}>{"="}</button>
                        <button onClick={() => HanddleKeyboardKey('+')}>{"+"}</button>
                    </ul>

                    <ul className="keyboard-controls-flex">
                        <details style={{position: "relative"}}>
                            <summary>Functions</summary>
                            <div style={{position: "absolute", top: "0", left: "0", transform: "translateY(-100%)", background: "gray", padding: "10px"}}>
                            <button onClick={() => HanddleKeyboardKey('sin')}>sin</button>
                            <button onClick={() => HanddleKeyboardKey('cos')}>cos</button>
                            </div>
                        </details>
                        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                            <button onClick={() => HanddleKeyboardControls("Left")}>{"<="}</button>
                            <button onClick={() => HanddleKeyboardControls("Right")}>{"=>"}</button>
                        </div>
                        <button style={{background: "red"}} onClick={() => HanddleKeyboardControls("Backspace")}>{"⌫"}</button>
                        <button onClick={() => HanddleKeyboardControls("Enter")}>{"↩"}</button>
                    </ul>
                </div>
            </div>
        </div>
    )
}