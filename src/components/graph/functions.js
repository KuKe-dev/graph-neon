export const drawFunction = (ctx, width, height, func, xScale, yScale, step, offset = { x: 0, y: 0 }) => {
    if (typeof func !== 'function') {
        return;
    }

    const scaleX = width / xScale;
    const scaleY = height / yScale;
    
    // Optimización: Calcular rango de manera más eficiente
    const centerX = width / 2 + offset.x;
    const viewportLeft = -centerX / scaleX;
    const viewportRight = (width - centerX) / scaleX;
    
    // Agregar un pequeño margen para suavizar los bordes
    const margin = Math.abs(viewportRight - viewportLeft) * 0.1;
    const startX = viewportLeft - margin;
    const endX = viewportRight + margin;
    
    // Optimización: Ajustar step dinámicamente basado en el zoom
    const adaptiveStep = Math.max(step, Math.abs(endX - startX) / 2000);
    
    // Función auxiliar para dibujar una línea continua
    const drawContinuousLine = (strokeStyle, lineWidth) => {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        
        let hasStarted = false;
        let lastValidY = null;
        let discontinuityCount = 0;
        const maxDiscontinuity = 3; // Máximo número de puntos indefinidos consecutivos antes de reiniciar
        
        for (let x = startX; x <= endX; x += adaptiveStep) {
            const y = func(x);
            
            // Verificar si el valor es válido
            if (typeof y !== 'number' || !isFinite(y)) {
                discontinuityCount++;
                if (discontinuityCount > maxDiscontinuity) {
                    hasStarted = false;
                    discontinuityCount = 0;
                }
                continue;
            }
            
            discontinuityCount = 0;
            const canvasX = width / 2 + x * scaleX + offset.x;
            const canvasY = height / 2 - y * scaleY + offset.y;
            
            // Optimización: Solo dibujar si está en el viewport extendido
            if (canvasX < -200 || canvasX > width + 200) {
                hasStarted = false;
                continue;
            }
            
            // Optimización: Detectar saltos grandes (posibles discontinuidades)
            if (lastValidY !== null && Math.abs(y - lastValidY) > Math.abs(endX - startX) * 2) {
                hasStarted = false;
            }
            
            if (!hasStarted) {
                ctx.moveTo(canvasX, canvasY);
                hasStarted = true;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
            
            lastValidY = y;
        }
        
        ctx.stroke();
    };
    
    // Dibujar sombra primero
    drawContinuousLine('rgba(212, 0, 255, 0.56)', 5);
    
    // Luego dibujar la línea principal
    drawContinuousLine('violet', 2);
};