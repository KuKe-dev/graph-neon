import LatexInput from "./latexInput/LatexInput";

import "./Sidebar.css";

import Logo from "../../assets/Logo-extended.png";

export default function Sidebar({ latexValue, functionValue, setFunctionValue }) {
    return (
        <nav className="sidebar">
            <img src={Logo} alt="Logo" className="logo" />
            <LatexInput
                latexValue={latexValue}
                functionValue={functionValue}
                setFunctionValue={setFunctionValue}
            />
        </nav>
    )
}