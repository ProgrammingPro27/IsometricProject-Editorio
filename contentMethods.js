let menu = document.getElementById("menu");
let mapOptionsWindow = document.getElementById("optionPartsMenu");

let operations = ["removeTile", "increaseSize", "colorise"];

let mapOperations = {
    "RowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="RowsAndColumns">`;
        optionFragment += `<label for="quantity1">Flat Map Size</label><input type="range" id="quantity1" name="quantity1" min="1" max="50" value = "20" oninput="updateMap('c1')">`;
        return optionFragment;
    },
    "PerlinMapRowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="PerlinMapRowsAndColumns">`;
        optionFragment += `<label for="quantity3">Perlin Map Size</label><input  type="range" id="quantity3" name="quantity3" min="1" max="50" value = "20" oninput="updateMap('c3')">`;
        return optionFragment;
    },
    "GridSize": () => {
        let optionFragment = `<div class = "part" id ="GridSize">`;
        optionFragment += `<label for="gridSize">Grid Size</label><input  type="number" id="gridSize" name="gridSize" min="1" value = "8" oninput="updateMap('c2')">`;
        return optionFragment;
    },
    "Resolution": () => {
        let optionFragment = `<div class = "part" id ="Resolution">`;
        optionFragment += `<label for="resolution">Resolution</label><input  type="number" id="resolution" name="resolution" min="1" value = "64" oninput="updateMap('c2')">`;
        return optionFragment;
    },
    "GroundLayers": () => {
        let optionFragment = `<div class = "part" id ="GroundLayers">`;
        optionFragment += `<label for="groundLayers">Ground Layers</label><input  type="number" id="groundLayers" name="groundLayers" min="0.1" value = "0.5" step = "0.1" oninput="updateMap('c2')">`;
        return optionFragment;
    },
    "HeightLimit": () => {
        let optionFragment = `<div class = "part" id ="HeightLimit">`;
        optionFragment += `<label for="heightLimit">Height Limit</label><input  type="number" id="heightLimit" name="heightLimit" min="1" value = "1000" step = "1" oninput="updateMap('c2')">`;
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
