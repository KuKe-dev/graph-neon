/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import { drawFunction } from "./functions";
import * as math from 'mathjs';

export default function Graph() {

    const canvasRef = useRef(null);
    const [scale, setScale] = useState(5);

    const [functionValue, setFunctionValue] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        e.preventDefault(); // Prevent page scrolling
        const zoomSpeed = 3; // Controla la velocidad del zoom
        const newScale = e.deltaY < 0 
            ? Math.max(2, scale - zoomSpeed)  // Zoom In (divided disminuye)
            : Math.min(120, scale + zoomSpeed); // Zoom Out (divided aumenta)
        setScale(newScale);
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
            
            // Calculate units per pixel
            const unitsPerPixelX = scale / canvas.width;
            const unitsPerPixelY = scale / canvas.height;
            
            // Calculate the coordinate range visible on screen
            const leftUnit = -scale/2 - (offset.x * unitsPerPixelX);
            const rightUnit = scale/2 - (offset.x * unitsPerPixelX);
            const topUnit = scale/2 + (offset.y * unitsPerPixelY);
            const bottomUnit = -scale/2 + (offset.y * unitsPerPixelY);
            
            // Determine grid spacing based on scale
            let gridSpacing = 1;
            if (scale > 20) gridSpacing = Math.ceil(scale / 20);
            else if (scale < 10) gridSpacing = 0.5;
            
            // Draw vertical grid lines (for Y values)
            const startX = Math.floor(leftUnit / gridSpacing) * gridSpacing;
            const endX = Math.ceil(rightUnit / gridSpacing) * gridSpacing;
            
            for (let x = startX; x <= endX; x += gridSpacing) {
                const pixelX = centerX + (x * canvas.width / scale);
                
                if (pixelX >= 0 && pixelX <= canvas.width) {
                    // Draw vertical line
                    ctx.beginPath();
                    ctx.moveTo(pixelX, 0);
                    ctx.lineTo(pixelX, canvas.height);
                    ctx.stroke();
                    
                    // Draw number label (skip 0 to avoid overlap with axis)
                    if (Math.abs(x) > 0.001) {
                        ctx.fillStyle = '#666666';
                        ctx.font = '10px sans-serif';
                        ctx.textAlign = 'center';
                        const label = gridSpacing === 0.5 ? x.toFixed(1) : x.toString();
                        ctx.fillText(label, pixelX, centerY + 15);
                    }
                }
            }
            
            // Draw horizontal grid lines (for X values)
            const startY = Math.floor(bottomUnit / gridSpacing) * gridSpacing;
            const endY = Math.ceil(topUnit / gridSpacing) * gridSpacing;
            
            for (let y = startY; y <= endY; y += gridSpacing) {
                const pixelY = centerY - (y * canvas.height / scale);
                
                if (pixelY >= 0 && pixelY <= canvas.height) {
                    // Draw horizontal line
                    ctx.beginPath();
                    ctx.moveTo(0, pixelY);
                    ctx.lineTo(canvas.width, pixelY);
                    ctx.stroke();
                    
                    // Draw number label (skip 0 to avoid overlap with axis)
                    if (Math.abs(y) > 0.001) {
                        ctx.fillStyle = '#666666';
                        ctx.font = '10px sans-serif';
                        ctx.textAlign = 'right';
                        const label = gridSpacing === 0.5 ? y.toFixed(1) : y.toString();
                        ctx.fillText(label, centerX - 5, pixelY + 3);
                    }
                }
            }
            
            // Draw origin label
            ctx.fillStyle = '#666666';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('0', centerX - 5, centerY + 15);
        }

        function validFunction(funcValue) {
            if (funcValue) {
                try {
                    // Crear la función dinámica
                    const func = (x) => {
                        try {
                            
                            return math.evaluate(funcValue, { x });
                            
                        } catch (e) {
                            return undefined;
                        }
                    };

                    return func;
                } catch (e) {

                    console.error("Función inválida.");
                    return false;
                }
            }
        }
        
        drawGrid();
        drawAxis();
        drawFunction(ctx, canvas.width, canvas.height, validFunction(functionValue), scale, scale, scale/400, offset);

    }, [scale, functionValue, offset]);

    

    return (
        <>
        <input type="text" value={functionValue} onChange={(e) => setFunctionValue(e.target.value)} />
        <div>
        <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onWheel={e => handleWheel(e)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        id="graph"
        style={{background: "black", cursor: isDragging ? 'grabbing' : 'grab'}} />
        </div>
        </>
    )
}