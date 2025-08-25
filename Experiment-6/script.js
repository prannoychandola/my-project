const board = document.getElementById('sketch-area');
const pen = board.getContext('2d');

let drawingActive = false;
let prevX = 0;
let prevY = 0;

function sketch(event) {
    if (!drawingActive) return;
    const bounds = board.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    pen.beginPath();
    pen.moveTo(prevX, prevY);
    pen.lineTo(x, y);
    pen.stroke();
    
    [prevX, prevY] = [x, y];
}

function endSketch() {
    drawingActive = false;
    window.removeEventListener('mousemove', sketch);
    window.removeEventListener('mouseup', endSketch);
}

board.addEventListener('mousedown', (event) => {
    drawingActive = true;
    
    const bounds = board.getBoundingClientRect();
    [prevX, prevY] = [event.clientX - bounds.left, event.clientY - bounds.top];

    pen.lineWidth = 3;
    pen.lineCap = 'round';
    pen.strokeStyle = '#1565c0'; // blue stroke

    window.addEventListener('mousemove', sketch);
    window.addEventListener('mouseup', endSketch);
});