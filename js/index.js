import {Container} from "./classes/Container.js";
function loadRectangles() {
    return fetch("./rectangles.json")
        .then((res) => res.json())
        .then(json => json["rectangles"]
            .map((el, index) => {
        const duplicate = json["rectangles"].find((item) => el.width === item.width && el.height === item.height);
        el.color = duplicate?.color ?? "#" + Math.floor(Math.random() * 16777215).toString(16); //random color
        el.initialOrder = index;
        return el;
    })).catch(err => console.log("Error loadind rectangles: " + err));
}

function renderRectangles(rectangles, containerEl) {
    rectangles.map((el) => {
        const {width, height, color, left, bottom, initialOrder} = el;
        const newRectangle = document.createElement("div");
        newRectangle.classList.add("rectangle");
        const newRectangleIndex = document.createElement("div");
        newRectangleIndex.classList.add("rectangle_index");
        Object.assign(newRectangle.style, {
            bottom: bottom + "px",
            left: left + "px",
            width: width + "px",
            height: height + "px",
            borderColor: color
        })
        newRectangleIndex.textContent = initialOrder + " ";
        newRectangle.appendChild(newRectangleIndex);
        containerEl.appendChild(newRectangle);
    })
}

async function main() {
    const containerEl = document.querySelector(".container");
    const fullnessNumEl = document.querySelector(".fullness_num");
    containerEl.innerHTML = null;

    const container = new Container(containerEl.offsetWidth, containerEl.offsetHeight);
    const loaded = await loadRectangles();
    const result = container.startPacking(loaded);
    renderRectangles(result.blockCoordinates, containerEl);
    fullnessNumEl.textContent = (result.fullness * 100).toFixed(2);
}

main().then();

window.addEventListener("resize", () => main());

