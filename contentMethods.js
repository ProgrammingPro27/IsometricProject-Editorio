let menu = document.getElementById("menu");
let mapOptionsWindow = document.getElementById("optionPartsMenu");

let operations = ["removeTile", "increaseSize", "colorise"];

let mapOperations = {
    "MapMode": () => {
        let optionFragment = `<div class = "part" id ="MapMode">`;
        optionFragment += `<button id = "mode" onclick = "mapType(this)">Perlin</button>`;
        return optionFragment;
    },
    "RowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="RowsAndColumns">`;
        optionFragment += `<label for="quantity1">Chunk Size</label><input type="range" id="quantity1" name="quantity1" min="1" max="50" value = "20" oninput="updateMap('make')">`;
        return optionFragment;
    },
    "GridSize": () => {
        let optionFragment = `<div class = "part" id ="GridSize">`;
        optionFragment += `<label for="gridSize">Grid Size</label><input  type="number" id="gridSize" name="gridSize" min="1" value = "8" oninput="updateMap('edit')">`;
        return optionFragment;
    },
    "Resolution": () => {
        let optionFragment = `<div class = "part" id ="Resolution">`;
        optionFragment += `<label for="resolution">Resolution</label><input  type="number" id="resolution" name="resolution" min="1" value = "64" oninput="updateMap('edit')">`;
        return optionFragment;
    },
    "GroundLayers": () => {
        let optionFragment = `<div class = "part" id ="GroundLayers">`;
        optionFragment += `<label for="groundLayers">Ground Layers</label><input  type="number" id="groundLayers" name="groundLayers" min="0.1" value = "0.5" step = "0.1" oninput="updateMap('edit')">`;
        return optionFragment;
    },
    "HeightLimit": () => {
        let optionFragment = `<div class = "part" id ="HeightLimit">`;
        optionFragment += `<label for="heightLimit">Height Limit</label><input  type="number" id="heightLimit" name="heightLimit" min="1" value = "1000" step = "1" oninput="updateMap('edit')">`;
        return optionFragment;
    }
};

window.onload = function () {
    menu.addEventListener("click", addCommand);
    function addCommand(e) {
        if (e.target.tagName === "BUTTON") {
            gameObject.eventToPut = e.target.innerHTML;
        };
    };

    Object.keys(mapOperations).forEach(key => {
        mapOptionsWindow.innerHTML += mapOperations[key]();
    });
};

function addOptionButtons(operationGroup, menu) {
    for (let i = 0; i < operationGroup.length; i++) {
        let button = document.createElement("button");
        button.className = "mainMenuOptionButtons";
        button.innerHTML = operationGroup[i];
        menu.appendChild(button);
    };
};

addOptionButtons(operations, menu);

function showElement(button, el) {
    button.style.display = "none"
    el.style.display = "flex";
};

[menu, mapOptionsWindow].forEach(el => {
    el.addEventListener("mouseleave", function () {
        el.style.display = "none";
        document.getElementById('controlPanelButton').style.display = "block";
        document.getElementById('controlWindowButton').style.display = "block";
    });
})

function mapType(el) {
    let el1 = document.getElementById("gridSize")
    let el2 = document.getElementById("resolution")
    let el3 = document.getElementById("groundLayers")
    let el4 = document.getElementById("heightLimit")
    if (el.innerText == "Flat") {
        el.innerText = "Perlin";
        el.style.backgroundColor = "#ffa000";
        el1.disabled = el2.disabled = el3.disabled = el4.disabled = false;
    } else {
        el.innerText = "Flat";
        el.style.backgroundColor = "gray";
        el1.disabled = el2.disabled = el3.disabled = el4.disabled = true;
    }
    updateMap("make");
};
