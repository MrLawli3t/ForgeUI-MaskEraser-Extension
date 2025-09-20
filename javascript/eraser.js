function createEraserButton(isReforge = false) {
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
        let canvas;

        if (isReforge) {
            canvas = parent.querySelector("canvas[key='mask']");
        } else {
            canvas = parent.querySelector("canvas");
        }
        
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