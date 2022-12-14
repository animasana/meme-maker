const colors = [
	"#1abc9c",
	"#2ecc71",
	"#3498db",
	"#9b59b6",
	"#34495e",
	"#16a085",
	"#27ae60",
	"#2980b9",
	"#8e44ad",
	"#2c3e50",
	"#f1c40f",
	"#e67e22",
	"#e74c3c",
	"#ecf0f1",
	"#95a5a6",
];

const fontStrokeInput = document.getElementById("check");
const fontSizeInput = document.getElementById("font-size");
const fontDropBox = document.getElementById("fonts");
const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(
	document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;
let isEmpty = false;
const MODE_FILL_TEXT = "🩸 Fill 🩸";
const MODE_DRAW_TEXT = "🖌️ DRAW";

registerFonts();

function onMouseMove(event) {
	if (isPainting) {
		ctx.lineTo(event.offsetX, event.offsetY);
		ctx.stroke();
		return;
	}
	ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(event) {
	//event.stopPropagation();
  console.log(event);
	if (event.detail > 1) event.preventDefault();
	isPainting = true;
}
function cancelPainting() {
	isPainting = false;
	ctx.beginPath();
}

canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

function onLineWidthChange(event) {
	ctx.lineWidth = event.target.value;
}
lineWidth.addEventListener("change", onLineWidthChange);

function onColorChange(event) {
	ctx.strokeStyle = event.target.value;
	ctx.fillStyle = event.target.value;
}
color.addEventListener("change", onColorChange);

function onColorClick(event) {
	const colorValue = event.target.dataset.color;
	ctx.strokeStyle = colorValue;
	ctx.fillStyle = colorValue;
	color.value = colorValue;
}
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

function onModeBtnClick() {
	modeBtn.innerText = isFilling ? MODE_FILL_TEXT : MODE_DRAW_TEXT;
	isFilling = !isFilling;
}
modeBtn.addEventListener("click", onModeBtnClick);

function onCanvasClick() {
	if (isFilling) {
		ctx.fillStyle = color.value;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}
}
canvas.addEventListener("click", onCanvasClick);

function onCanvasDblClick(event) {
	const text = textInput.value;
	if (text === "") {
		return;
	}
	ctx.save();
	ctx.lineWidth = 1;
	ctx.font = `bold ${fontSizeInput.value}px ${
		fontDropBox.options[fontDropBox.selectedIndex].value
	}`;  
	console.log(ctx.font);
	if (fontStrokeInput.checked) {
		ctx.strokeText(text, event.offsetX, event.offsetY);
	} else {
		ctx.fillText(text, event.offsetX, event.offsetY);
	}
	ctx.restore();

	return true;
}
canvas.addEventListener("dblclick", onCanvasDblClick);

function onDestroyBtnClick() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.fillStyle = color.value;
	if (isFilling) {
		isFilling = false;
		modeBtn.innerText = MODE_FILL_TEXT;
	}
}
destroyBtn.addEventListener("click", onDestroyBtnClick);

function onEraserBtnClick() {
	ctx.strokeStyle = "white";
	isFilling = false;
	modeBtn.innerText = MODE_FILL_TEXT;
}
eraserBtn.addEventListener("click", onEraserBtnClick);

function onFileInputChange(event) {
	const file = event.target.files[0];
	const url = URL.createObjectURL(file);
	const image = new Image();
	image.src = url;
	image.onload = function () {
		let imageWidth, imageHeight;
		let ratio;
		let posX, posY;
		if (image.height > image.width) {
			ratio = image.width / image.height;
			imageHeight = CANVAS_HEIGHT;
			imageWidth = Math.floor(imageHeight * ratio);
			posX = CANVAS_WIDTH / 2 - imageWidth / 2;
			posY = 0;
		} else {
			ratio = image.height / image.width;
			imageWidth = CANVAS_WIDTH;
			imageHeight = Math.floor(imageWidth * ratio);
			posX = 0;
			posY = CANVAS_HEIGHT / 2 - imageHeight / 2;
		}

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.drawImage(image, posX, posY, imageWidth, imageHeight);
		fileInput.value = null;
	};
}
fileInput.addEventListener("change", onFileInputChange);

function onSaveBtnClick(event) {
	const url = canvas.toDataURL();
	const a = document.createElement("a");
	a.href = url;
	a.download = "myDrawing.png";
	a.click();
}
saveBtn.addEventListener("click", onSaveBtnClick);

function onFontDropBoxChange(event) {
	fontName = event.target.value;
}
fontDropBox.addEventListener("change", onFontDropBoxChange);

// function listFonts_new() {
// 	let { fonts } = document;
// 	const it = fonts.entries();

// 	let arr = [];
// 	let done = false;

// 	while (!done) {
// 		const font = it.next();
// 		if (!font.done) {
// 			arr.push(font.value[0].family);
// 		} else {
// 			done = font.done;
// 		}
// 	}

// 	// converted to set then arr to filter repetitive values
// 	return [...new Set(arr)];
// }

// function listFonts() {
// 	let { fonts } = document;
// 	const it = fonts.entries();

// 	let arr = [];
// 	let done = false;

// 	while (!done) {
// 		const font = it.next();
// 		if (!font.done) {
// 			arr.push(font.value[0]);
// 		} else {
// 			done = font.done;
// 		}
// 	}
// 	return arr;
// }

// {
// 	const name = "";
// 	const userName = name ?? "Guest";
// 	console.log(userName);

// 	const num = 0;
// 	const userId = num ?? "undefined";
// 	console.log(userId);
// }

async function registerFonts() {
	const fontCheck = new Set(
		[
			"Arial",
			"Arial Black",
			"Bahnschrift",
			"Calibri",
			"Cambria",
			"Cambria Math",
			"Candara",
			"Comic Sans MS",
			"Consolas",
			"Constantia",
			"Corbel",
			"Courier New",
			"Ebrima",
			"Franklin Gothic Medium",
			"Gabriola",
			"Gadugi",
			"Georgia",
			"HoloLens MDL2 Assets",
			"Impact",
			"Ink Free",
			"Javanese Text",
			"Leelawadee UI",
			"Lucida Console",
			"Lucida Sans Unicode",
			"Malgun Gothic",
			"Marlett",
			"Microsoft Himalaya",
			"Microsoft JhengHei",
			"Microsoft New Tai Lue",
			"Microsoft PhagsPa",
			"Microsoft Sans Serif",
			"Microsoft Tai Le",
			"Microsoft YaHei",
			"Microsoft Yi Baiti",
			"MingLiU-ExtB",
			"Mongolian Baiti",
			"MS Gothic",
			"MV Boli",
			"Myanmar Text",
			"Nirmala UI",
			"Palatino Linotype",
			"Segoe MDL2 Assets",
			"Segoe Print",
			"Segoe Script",
			"Segoe UI",
			"Segoe UI Historic",
			"Segoe UI Emoji",
			"Segoe UI Symbol",
			"SimSun",
			"Sitka",
			"Sylfaen",
			"Symbol",
			"Tahoma",
			"Times New Roman",
			"Trebuchet MS",
			"Verdana",
			"Webdings",
			"Wingdings",
			"Yu Gothic",
			"Fantasy",
			"Cursive",
			"궁서",
			"궁서체",
			"나눔고딕코딩",
			"굴림",
			"굴림체",
      "마루 부리",
		].sort()
	);

	await document.fonts.ready;

	const fontAvailable = new Set();

	for (const font of fontCheck.values()) {
		if (document.fonts.check(`12px "${font}"`)) {
			fontAvailable.add(font);
		}
	}

	const fontList = [...fontAvailable.values()];
	console.log("Available Fonts:", fontList);

	fontList.forEach((font) =>
		fontDropBox.insertAdjacentHTML(
			"beforeend",
			`<option value="${font}">${font}</option>`
		)
	);

	// fontName = Array.from(fontDropBox.options)[0].value;	
}

// let f = new FontFace('MaruBuri-Bold', 'url(MaruBuri-Bold.ttf)');

// f.load().then(function() {
//   // Ready to use the font in a canvas context
//   ctx.font = `64px MaruBuri-Bold`;
// });

// document.fonts.ready.then(function() {
//   const fontAvailable = new Set();

// 	for (const font of fontCheck.values()) {
// 		if (document.fonts.check(`12px "${font}"`)) {
// 			fontAvailable.add(font);
// 		}
// 	}

// 	const fontList = [...fontAvailable.values()];
// 	console.log("Available Fonts:", fontList);
// });
