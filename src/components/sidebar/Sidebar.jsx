import LatexInput from "./latexInput/LatexInput";

import Logo from "../../assets/Logo-extended.png";

export default function Sidebar({ latexValue, functionValue, setFunctionValue }) {
    return (
        <nav className="sidebar" style={{background: "none", display: "flex", flexDirection: "column", width: "300px"}}>
            <img src={Logo} alt="Logo" style={{width: "100%", height: "auto"}} />
            <LatexInput
                latexValue={latexValue}
                functionValue={functionValue}
                setFunctionValue={setFunctionValue}
            />
        </nav>
    )
}