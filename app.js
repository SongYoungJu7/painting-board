const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const linePx = document.getElementById("line-px");
const colorPicker = document.getElementById("color-picker");
const colorOptions = Array.from(document.getElementsByClassName("color-options"));

let isPainting = false;

canvas.width = 600;
canvas.height = 600;

ctx.lineWidth = lineWidth.value;
linePx.textContent = `line width: ${ctx.lineWidth}`;

// 그리기 기능
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

// 설정 기능 (선 굵기, 색깔, ...)
lineWidth.addEventListener("input", onLineWidthChange);
colorPicker.addEventListener("input", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

function onMove(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
    isPainting = true;
}

function cancelPainting() {
    isPainting = false;
    ctx.beginPath();
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
    linePx.textContent = `line width: ${event.target.value}`;
}

function onColorChange(event) {
    let color = event.target.value;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function onColorClick(event) {
    let color = event.target.dataset.color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    colorPicker.value = color;
}