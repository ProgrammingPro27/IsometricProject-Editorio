let menu = document.getElementById("menu");
let tileOptions = document.getElementById("tileOptions");
let mapOptions = document.getElementById("mapOptions");
let mapOptionsWindow = document.getElementById("optionPartsMenu");
let operations = ["removeTile", "increaseSize", "addUpperLevel", "colorise"];

function closeSegment(e) {
    if (e.tagName === "DIV") {
        e.parentNode.remove();
    };
};

let mapOperations = {
    "RowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="RowsAndColumns">`;
        optionFragment += `<label for="quantity1">Flat Map Size: </label><input type="range" id="quantity1" name="quantity1" min="1" max="50" value = "1" oninput="updateMap('c1')">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
    "PerlinMapRowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="PerlinMapRowsAndColumns">`;
        optionFragment += `<label for="quantity3">Perlin Map Size: </label><input  type="range" id="quantity3" name="quantity3" min="1" max="50" value = "1" oninput="updateMap('c2')">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
    "GridSize": () => {
        let optionFragment = `<div class = "part" id ="GridSize">`;
        optionFragment += `<label for="gridSize">Grid Size: </label><input  type="number" id="gridSize" name="gridSize" min="1" value = "8" oninput="updateMap('c2')">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
    "Resolution": () => {
        let optionFragment = `<div class = "part" id ="Resolution">`;
        optionFragment += `<label for="resolution">Resolution: </label><input  type="number" id="resolution" name="resolution" min="1" value = "64" oninput="updateMap('c2')">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
    "GroundLayers": () => {
        let optionFragment = `<div class = "part" id ="GroundLayers" >`;
        optionFragment += `<label for="groundLayers">Ground Layers: </label><input  type="number" id="groundLayers" name="groundLayers" min="0.3" value = "0.5" step = "0.1" oninput="updateMap('c2')">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
};

window.onload = function () {
    tileOptions.addEventListener("click", addCommand);
    function addCommand(e) {
        if (e.target.tagName === "BUTTON") {
            gameObject.eventToPut = e.target.innerHTML;
        };
    };
    mapOptions.addEventListener("click", addCommandV2);
    function addCommandV2(e) {
        if (e.target.tagName === "BUTTON") {
            if (mapOptionsWindow.querySelector(`#${e.target.innerHTML}`) !== null) {
                alert("Element has already been added.");
            } else {
                mapOptionsWindow.innerHTML += mapOperations[e.target.innerHTML]();
            };
        };
    };
};

//add the menu window and assign every operation to the name of the button
function addOptionButtons(operationGroup, menu) {
    for (let i = 0; i < operationGroup.length; i++) {
        let button = document.createElement("button");
        button.className = "mainMenuOptionButtons";
        button.innerHTML = operationGroup[i];
        menu.appendChild(button);
    };
};

addOptionButtons(operations, tileOptions);
addOptionButtons(Object.keys(mapOperations), mapOptions);

function showElement(el) {
    el.style.display = "flex";
};

menu.addEventListener("mouseleave", function () {
    menu.style.display = "none";
    tileOptions.style.display = "none";
    mapOptions.style.display = "none";
});

mapOptionsWindow.addEventListener("mouseleave", function () {
    mapOptionsWindow.style.display = "none";
});
