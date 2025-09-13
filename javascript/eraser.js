onUiLoaded(() => {
    const inpaintTab = gradioApp().querySelector("#img2img_inpaint_tab");
    const maskCanvas = inpaintTab.querySelector("canvas");
    
    if (!maskCanvas) return;

    const toolbar = inpaintTab.querySelector(".forge-toolbar-box-a");
    const eraserBtn = document.createElement('button');
    eraserBtn.innerText = '🧼';
    eraserBtn.title = "Eraser";
    eraserBtn.class = "forge-btn";
    toolbar.appendChild(eraserBtn);

    let erasing = false;

    eraserBtn.onmouseover = () => { 
        eraserBtn.style.opacity = 0.7;
    }
    eraserBtn.onmouseout = () => { 
        eraserBtn.style.opacity = 1;
    }
    eraserBtn.onclick = () => { 
        const ctx = maskCanvas.getContext('2d');
        erasing = !erasing;

        if (erasing) {
            eraserBtn.style.border = "2px solid red";
        } else {
            eraserBtn.style.border = "none";
        }

        ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    }
});
