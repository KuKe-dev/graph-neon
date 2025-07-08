import { EditableMathField } from "react-mathquill";
import { latex_to_js } from "../../../utilities/latexToJs";

import "./LatexInput.css";

export default function LatexInput({ latexValue, functionValue, setFunctionValue }) {

    function HanddleLatexInput(mathField) {
        setFunctionValue(latex_to_js(mathField.latex()));
    }

    return (
        <div className="latex-input">
            <div style={{background: "none"}}>
                <EditableMathField
                    id="my-math-input"
                    style={{color: "white", display: "inline-block", padding: "10px", marginTop: "10px", marginBottom: "10px", fontSize: "20px"}}
                    latex={latexValue}
                    onChange={ mathField => HanddleLatexInput(mathField) }
                />
            </div>

            <input style={{display: `${import.meta.env.VITE_PRODUCTION =='false' ? "block" : "none"}`}} type="text" value={functionValue} onChange={(e) => setFunctionValue(e.target.value)} />
        </div>
    )
}