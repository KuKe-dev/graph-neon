import { useState } from "react";
import Graph from "../components/graph/graph";
import Sidebar from "../components/sidebar/Sidebar.jsx";

import "./Home.css";

export default function Home() {

    const [latexValue, setLatexValue] = useState("");
    const [functionValue, setFunctionValue] = useState("");

    return (
        <>
        <div className="home-container">
            <Sidebar
                className="sidebar"
                latexValue={latexValue}
                functionValue={functionValue}
                setFunctionValue={setFunctionValue}
            />
            <Graph 
                functionValue={functionValue}
                setFunctionValue={setFunctionValue}
                latexValue={latexValue}
                setLatexValue={setLatexValue}
            />
        </div>
        </>
    )
}