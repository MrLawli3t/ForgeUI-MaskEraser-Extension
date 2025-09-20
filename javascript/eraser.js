function startErasing(canvas, eraserBtn) {
    if (canvas === null || eraserBtn === null) return;

    const ctx = canvas.getContext('2d');

    eraserBtn.style.border = "2px solid red";

    ctx.globalCompositeOperation = "destination-out";
}

function stopErasing(canvas, eraserBtn) {
    if (canvas === null || eraserBtn === null) return;

    const ctx = canvas.getContext('2d');

    eraserBtn.style.border = "none";

    ctx.globalCompositeOperation = "source-over";
}

function createEraserButton(isReforge = false) {
    const eraserBtn = document.createElement('button');
    eraserBtn.innerText = '🧼';
    eraserBtn.title = "Eraser";
    eraserBtn.class = "forge-btn";

    let erasing = false;

    window.addEventListener("keydown", (e) => {
        if (e.shiftKey) {
            if (erasing) return;
            e.preventDefault();
            startErasing(isReforge ? document.querySelector("#img2img_inpaint_tab").querySelector("canvas[key='mask']") : document.querySelector("#img2img_inpaint_tab").querySelector("canvas"), eraserBtn);
            erasing = true;
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.key === "Shift") {
            if (!erasing) return;
            e.preventDefault();
            stopErasing(isReforge 
                ? document.querySelector("#img2img_inpaint_tab").querySelector("canvas[key='mask']") 
                : document.querySelector("#img2img_inpaint_tab").querySelector("canvas"), eraserBtn);
            erasing = false;
        }
    });

    eraserBtn.onmouseover = () => { 
        eraserBtn.style.opacity = 0.7;
    }
    eraserBtn.onmouseout = () => { 
        eraserBtn.style.opacity = 1;
    }
    eraserBtn.onclick = (e) => {
        const parent = e.target.closest(".tabitem");
        let canvas;

        if (isReforge) {
            canvas = parent.querySelector("canvas[key='mask']");
        } else {
            canvas = parent.querySelector("canvas");
        }

        erasing = !erasing;
        if (erasing) startErasing(canvas, eraserBtn); else stopErasing(canvas, eraserBtn);
    }

    return eraserBtn;
}

onUiLoaded(() => {
    const inpaintTab = gradioApp().querySelector("#img2img_inpaint_tab");

    // Forge and Forge Classic
    const inpaintToolbar = inpaintTab.querySelector(".forge-toolbar-box-a");

    // Reforge
    if (inpaintToolbar == null) {
        let isEraserAdded = false;
        const imageContainer = inpaintTab.querySelector(".image-container");
        let eraserBtn;

        if (imageContainer == null) {
            console.log("Image container not found");
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) {
                    return;
                }

                if (imageContainer.children[0].children[3] == null) {
                    return;
                }

                if (!isEraserAdded) {
                    eraserBtn = createEraserButton(true);
                    imageContainer.children[0].children[3].appendChild(eraserBtn);
                    isEraserAdded = true;

                    // Attach remove button listener right away
                    const removeButton = imageContainer.querySelector("button[title='Remove Image']");
                    if (removeButton && !removeButton.dataset.eraserListener) {
                        removeButton.addEventListener("click", () => {
                            eraserBtn.remove();
                            isEraserAdded = false;
                        });
                        removeButton.dataset.eraserListener = "true"; // avoid duplicates
                    }
                }
                }
            }
        });

        observer.observe(imageContainer.children[0], { childList: true, subtree: false });
    } else {
        inpaintToolbar.appendChild(createEraserButton());
    }

});