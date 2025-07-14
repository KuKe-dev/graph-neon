/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import { drawFunction, validFunction } from "./functions";
import * as math from 'mathjs';

import './graph.css';
import { addStyles, EditableMathField } from "react-mathquill";


export default function Graph({ functionValue, setFunctionValue, latexValue, setLatexValue }) {

    addStyles();

    const canvasRef = useRef(null);

    const [zoom, setZoom] = useState(100);
    const [step, setStep] = useState(1);

    /* const [functionValue, setFunctionValue] = useState(""); */

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const width = window.innerWidth;
    const height = window.innerHeight;

    const handleWheel = (e) => {
        const zoomSpeed = math.ceil(zoom / 15); // Controla la velocidad del zoom
        const newZoom = e.deltaY > 0 
            ? math.min(zoom + zoomSpeed, 1000)  // Zoom out
            : math.max(zoom - zoomSpeed, 2); // Zoom in
        setZoom(newZoom);
        /* setLastMousePos({ x: e.clientX, y: e.clientY });
        setOffset(prev => ({
            x: prev.x + (lastMousePos.x - canvasRef.current.width / 2) * (newZoom - zoom) / zoom,
            y: prev.y + (lastMousePos.y - canvasRef.current.height / 2) * (newZoom - zoom) / zoom
        })); */
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) {
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    }

    const handleMouseMove = (e) => {
        if (!isDragging) {
            return;
        }
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        setOffset(prev => ({ 
            x: prev.x + dx,
            y: prev.y + dy 
        }));

        setLastMousePos({ x: e.clientX, y: e.clientY });
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }
    
    useEffect(() => {

        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        function drawAxis() {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            
            // Calculate center with offset
            const centerX = canvas.width / 2 + offset.x;
            const centerY = canvas.height / 2 + offset.y;
            
            // Draw X Axis
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            // Draw X Axis Arrow
            ctx.moveTo(canvas.width - 10, centerY - 10);
            ctx.lineTo(canvas.width, centerY);
            ctx.moveTo(canvas.width - 10, centerY + 10);
            ctx.lineTo(canvas.width, centerY);

            ctx.stroke();
            // Draw Y Axis
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, canvas.height);
            // Draw Y Axis Arrow
            ctx.moveTo(centerX - 10, 10);
            ctx.lineTo(centerX, 0);
            ctx.moveTo(centerX + 10, 10);
            ctx.lineTo(centerX, 0);
            ctx.stroke();
        }
        
        function drawGrid() {
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;

            const centerX = canvas.width / 2 + offset.x;
            const centerY = canvas.height / 2 + offset.y;
            
            const unitsPerPixelX = canvas.width / zoom;
            const unitsPerPixelY = canvas.width / zoom;

            
            /* function setStepRecursive(unitsPerPixelX, thresholds = [ 9999, 50, 20, 10, 5, 2], steps = [1, 2, 5, 10, 20, 50], index = 0) {
                if (index >= thresholds.length) return;
                if (unitsPerPixelX < thresholds[index]) {
                    setStep(steps[index]);
                    setStepRecursive(unitsPerPixelX, thresholds, steps, index + 1);
                }
            }

            setStepRecursive(unitsPerPixelX); */

            if (unitsPerPixelX < 200) {
                setStep(0.5);
            }

            if (unitsPerPixelX < 100) {
                setStep(1);
            }

            if (unitsPerPixelX < 40) {
                setStep(2);
            }
            
            if (unitsPerPixelX < 16) {
                setStep(5);
            }
            
            if (unitsPerPixelX < 8) {
                setStep(10);
            }

            if (unitsPerPixelX < 4) {
                setStep(20);
            }

            if (unitsPerPixelX < 1.6) {
                setStep(50);
            }
            // Draw horizontal grid lines (for X values)
                let value = 0
                for (let i = centerX; i >= 0 ; i -= unitsPerPixelX * step) {
                    
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
                    ctx.stroke();

                    ctx.fillStyle = '#666666';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(value===0?'':value, i-10, centerY + 15);
                    value -= step;
                    
                }
                value = 0
                for (let i = centerX; i <= canvas.width ; i += unitsPerPixelX * step) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
                    ctx.stroke();

                    ctx.fillStyle = '#666666';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(value, i-10, centerY + 15);
                    value += step;
                }
            
            // Draw vertical grid lines (for Y values)
                value = 0
                for (let i = centerY; i >= 0 ; i -= unitsPerPixelY * step) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(canvas.width, i);
                    ctx.stroke();

                    ctx.fillStyle = '#666666';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(value===0?'':value, centerX - 10, i + 15);
                    value += step;
                }
                value = 0
                for (let i = centerY; i <= canvas.height ; i += unitsPerPixelY * step) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(canvas.width, i);
                    ctx.stroke();

                    ctx.fillStyle = '#666666';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(value===0?'':value, centerX - 10, i + 15);
                    value -= step;
                }
            
        }
        
        drawGrid();
        drawAxis();
        drawFunction(ctx, canvas.width, canvas.height, validFunction(functionValue[0]), zoom, zoom, zoom/400, offset);
        drawFunction(ctx, canvas.width, canvas.height, validFunction(functionValue[1]), zoom, zoom, zoom/400, offset);
        drawFunction(ctx, canvas.width, canvas.height, validFunction(functionValue[2]), zoom, zoom, zoom/400, offset);
        drawFunction(ctx, canvas.width, canvas.height, validFunction(functionValue[3]), zoom, zoom, zoom/400, offset);
        drawFunction(ctx, canvas.width, canvas.height, validFunction(functionValue[4]), zoom, zoom, zoom/400, offset);

    }, [zoom, functionValue, offset, step]);

    

    return (
        <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onWheel={e => handleWheel(e)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        id="graph"
        />

    )
}