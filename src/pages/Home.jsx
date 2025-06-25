import { useState } from "react";
import Graph from "../components/graph/graph";

export default function Home() {

    const [latexValue, setLatexValue] = useState("");
    const [functionValue, setFunctionValue] = useState("");

    return (
        <>
            <Graph />
        </>
    )
}