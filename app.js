const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const brushSize = document.getElementById("brush-size");
const brushPx = document.getElementById("brush-px");
const colorPicker = document.getElementById("color-picker");
const colorOptions = Array.from(document.getElementsByClassName("color-options"));
const toolBrush = document.getElementById("tool-brush");
const toolPaint = document.getElementById("tool-paint");
const toolEraser = document.getElementById("tool-eraser");
const file = document.getElementById("file");
const fileStyle = document.getElementById("tool-file");

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

let isPainting = false;
let paintingMode = "brush";

toolBrush.style.backgroundColor = "#fee7be";

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = brushSize.value;
brushPx.textContent = `brush size: ${ctx.lineWidth}`;

/* 그리기 기능 */
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

/* 설정 기능 (선 굵기, 색깔, ...) */
brushSize.addEventListener("input", onLineWidthChange);

toolBrush.addEventListener("click", function () {
    onChangeTool("brush");
});
toolPaint.addEventListener("click", function () {
    onChangeTool("paint");
});
toolEraser.addEventListener("click", function () {
    onChangeTool("eraser");
});

colorPicker.addEventListener("input", onColorChange);
colorOptions.forEach(color => color.addEventListener("click", onColorClick));

/* 파일 기능 */
file.addEventListener("change", onFileChange);

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
    brushPx.textContent = `brush size: ${event.target.value}`;
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

function onChangeTool(toolName) {
    if (toolName == "brush") {
        paintingMode = "brush";
        toolBrush.style.backgroundColor = "#fee7be";
        toolPaint.style.backgroundColor = "";
        toolEraser.style.backgroundColor = "";
        fileStyle.style.backgroundColor = "";
    } else if (toolName == "paint") {
        paintingMode = "paint";
        toolBrush.style.backgroundColor = "";
        toolPaint.style.backgroundColor = "#fee7be";
        toolEraser.style.backgroundColor = "";
        fileStyle.style.backgroundColor = "";
    } else if (toolName == "eraser") {
        paintingMode = "eraser";
        toolBrush.style.backgroundColor = "";
        toolPaint.style.backgroundColor = "";
        toolEraser.style.backgroundColor = "#fee7be";
        fileStyle.style.backgroundColor = "";
    }
}

function onCanvasClick() {
    if (paintingMode == "paint") {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (paintingMode == "eraser") {
        const currentColor = ctx.fillStyle;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = currentColor;
    }
}

function onFileChange(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function () {
        let imageW = Number(image.naturalWidth);
        let imageH = Number(image.naturalHeight);
        const scaleFactor = Math.min(CANVAS_WIDTH / imageW, CANVAS_HEIGHT / imageH);
        imageW *= scaleFactor;
        imageH *= scaleFactor;
        const centerX = (CANVAS_WIDTH / 2) - (imageW / 2);
        const centerY = (CANVAS_WIDTH / 2) - (imageH / 2);
        ctx.drawImage(image, centerX, centerY, imageW, imageH);
    }
}