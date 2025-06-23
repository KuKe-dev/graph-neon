export const drawFunction = (ctx, width, height, func, xScale, yScale, step, offset = { x: 0, y: 0 }) => {
    if (typeof func !== 'function') {
        return;
    }

    // First draw the shadow
    ctx.strokeStyle = 'rgba(212, 0, 255, 0.56)';
    ctx.gradient = ctx.createLinearGradient(0, 0, width, 0); // semi-transparent blue
    ctx.lineWidth = 5; // thicker than main line
    ctx.beginPath();
    
    const scaleX = width / xScale;
    const scaleY = height / yScale;
    
    const moved = offset.x > 1000 ? offset.x : 1000;

    let hasStarted = false;

    for (let x = -(xScale * moved/100)/2; x <= (xScale * moved/100)/2; x += step) {
        const y = func(x);
        
        if (typeof y !== 'number' || !isFinite(y)) {
            hasStarted = false;
            continue;
        }
        
        const canvasX = width / 2 + x * scaleX + offset.x;
        const canvasY = height / 2 - y * scaleY + offset.y;
        
        if (canvasX < -100 || canvasX > width + 100) {
            hasStarted = false;
            continue;
        }
        
        if (!hasStarted) {
            ctx.moveTo(canvasX, canvasY);
            hasStarted = true;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }

    ctx.stroke();

    // Then draw the main line
    ctx.strokeStyle = 'violet';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    hasStarted = false;

    

    for (let x = -(xScale * moved/100)/2; x <= (xScale * moved/100)/2; x += step) {
        const y = func(x);
        
        if (typeof y !== 'number' || !isFinite(y)) {
            hasStarted = false;
            continue;
        }
        
        const canvasX = width / 2 + x * scaleX + offset.x;
        const canvasY = height / 2 - y * scaleY + offset.y;
        
        if (canvasX < -100 || canvasX > width + 100) {
            hasStarted = false;
            continue;
        }
        
        if (!hasStarted) {
            ctx.moveTo(canvasX, canvasY);
            hasStarted = true;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }

    ctx.stroke();
};