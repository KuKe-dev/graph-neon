import { EditableMathField } from "react-mathquill";
import { StaticMathField  } from "react-mathquill";
import { latex_to_js } from "../../../utilities/latexToJs";

import "./LatexInput.css";
import { useRef } from "react";
import { useState } from "react";

import KeyboardIcon from '../../../assets/keyboard-icon.svg';

export default function LatexInput({ latexValue, functionValue, setFunctionValue }) {

    const [canKeyboard, setCanKeyboard] = useState(true);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [functions, setFunctions] = useState(['', '', '', '', '']); // Array para almacenar las funciones

    const mathFieldRefs = useRef([null, null, null, null, null]); // Array de refs para cada campo

    function HanddleLatexInput(mathField, index) {
        console.log(mathField.latex());
        const jsFunction = latex_to_js(mathField.latex());
        
        // Crear nuevo array con la función actualizada
        const newFunctions = [...functions];
        newFunctions[index] = jsFunction;
        setFunctions(newFunctions);
        
        // Actualizar el valor principal con el array completo
        setFunctionValue(newFunctions);
        console.log(newFunctions);
    }

    function HanddleCanKeyboard() {
        if (canKeyboard) {
            setCanKeyboard(false);
            setShowKeyboard(false);
        } else {
            setCanKeyboard(true);
            setShowKeyboard(true);
            // Enfocar el primer campo disponible
            const firstAvailableField = mathFieldRefs.current.find(ref => ref !== null);
            if (firstAvailableField) {
                firstAvailableField.focus();
            }
        }
    }

    function HanddleKeyboardKey(keyValue) {
        // Buscar el campo que tiene el foco
        const activeField = mathFieldRefs.current.find(ref => ref && ref.el().contains(document.activeElement));
        if (activeField) {
            activeField.cmd(keyValue);
        }
    }

    function HanddleKeyboardControls(direction) {   
        // Buscar el campo que tiene el foco
        const activeField = mathFieldRefs.current.find(ref => ref && ref.el().contains(document.activeElement));
        if (activeField) {
            activeField.keystroke(direction);
            activeField.focus();
        }
    }

    return (
        <div className="latex-input">
            <nav>
                {[0, 1, 2, 3, 4].map((index) => 
                
                {   return(
                    <div key={index} style={{background: "none"}}>
                        <EditableMathField
                            id={`my-math-input${index + 1}`}
                            className="EditableMathField"
                            mathquillDidMount={(mf) => mathFieldRefs.current[index] = mf}
                            style={{color: "white", display: `inline-block`, padding: "10px", fontSize: "20px"}}
                            latex={latexValue}
                            onFocus={() => { canKeyboard ? setShowKeyboard(true) : null; }}
                            onBlur={() => { setShowKeyboard(false) }}
                            onChange={ mathField => HanddleLatexInput(mathField, index) }
                        />
                        <input 
                            style={{display: `${import.meta.env.VITE_PRODUCTION =='false' ? "block" : "none"}`, width: "100%"}} 
                            type="text" 
                            value={mathFieldRefs.current[index] ? mathFieldRefs.current[index].latex() : ""} 
                            readOnly
                        />
                        <input 
                            style={{display: `${import.meta.env.VITE_PRODUCTION =='false' ? "block" : "none"}`, width: "100%"}} 
                            type="text" 
                            value={functions[index]} 
                            readOnly
                        />
                    </div>
                )})}
            </nav>
            
            <button className="keyboard-active-button"
                onClick={HanddleCanKeyboard}
            ><img className="keyboard-icon" src={KeyboardIcon} alt="Keyboard"/><span>{canKeyboard ? "▼" : "▲"}</span></button>

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

                        <div style={{display: "flex", justifyContent: "center", gap: "10px", width: "100%"}}>
                            <button style={{flexGrow: "1"}} onClick={() => HanddleKeyboardControls("Left")}>{"←"}</button>
                            <button style={{flexGrow: "1"}} onClick={() => HanddleKeyboardControls("Right")}>{"→"}</button>
                        </div>
                        <button style={{background: "red"}} onClick={() => HanddleKeyboardControls("Backspace")}>{"⌫"}</button>
                        <button onClick={() => HanddleKeyboardControls("Enter")}>{"↩"}</button>
                    </ul>
                </div>
            </div>
        </div>
    )
}