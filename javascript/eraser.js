function createEraserButton() {
    const eraserBtn = document.createElement('button');
    eraserBtn.innerText = '🧼';
    eraserBtn.title = "Eraser";
    eraserBtn.class = "forge-btn";

    let erasing = false;

    eraserBtn.onmouseover = () => { 
        eraserBtn.style.opacity = 0.7;
    }
    eraserBtn.onmouseout = () => { 
        eraserBtn.style.opacity = 1;
    }
    eraserBtn.onclick = (e) => {
        const parent = e.target.closest(".tabitem");
        const canvas = parent.querySelector("canvas");
        const ctx = canvas.getContext('2d');
        erasing = !erasing;

        if (erasing) {
            eraserBtn.style.border = "2px solid red";
        } else {
            eraserBtn.style.border = "none";
        }

        ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    }

    return eraserBtn;
}

onUiLoaded(() => {
    const inpaintTab = gradioApp().querySelector("#img2img_inpaint_tab");

    const inpaintToolbar = inpaintTab.querySelector(".forge-toolbar-box-a");

    inpaintToolbar.appendChild(createEraserButton());

});
