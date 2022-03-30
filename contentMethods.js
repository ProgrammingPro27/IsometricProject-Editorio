let menu = document.getElementById("menu");
let tileOptions = document.getElementById("tileOptions");
let mapOptionsWindow = document.getElementById("optionPartsMenu");

let operations = ["removeTile", "increaseSize", "addUpperLevel", "colorise"];

let mapOperations = {
    "RowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="RowsAndColumns">`;
        optionFragment += `<label for="quantity1">Flat Map Size</label><input type="range" id="quantity1" name="quantity1" min="1" max="50" value = "1" oninput="updateMap('c1')">`;
        return optionFragment;
    },
    "PerlinMapRowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="PerlinMapRowsAndColumns">`;
        optionFragment += `<label for="quantity3">Perlin Map Size</label><input  type="range" id="quantity3" name="quantity3" min="1" max="50" value = "1" oninput="updateMap('c2')">`;
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
    tileOptions.addEventListener("click", addCommand);
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

addOptionButtons(operations, tileOptions);

function showElement(el) {
    el.style.display = "flex";
};

menu.addEventListener("mouseleave", function () {
    menu.style.display = "none";
    tileOptions.style.display = "none";
});

mapOptionsWindow.addEventListener("mouseleave", function () {
    mapOptionsWindow.style.display = "none";
});
