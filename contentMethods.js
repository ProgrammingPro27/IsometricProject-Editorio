let menu = document.getElementById("menu");
let tileOptions = document.getElementById("tileOptions");
let mapOptions = document.getElementById("mapOptions");
let mapOptionsWindow = document.getElementById("optionPartsMenu");

function closeSegment(e) {
    if (e.tagName === "DIV") {
        e.parentNode.remove();
    }
}

let mapOperations = {
    "RowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="RowsAndColumns">`;
        optionFragment += `<label for="quantity1">Rows: </label><input type="range" id="quantity1" name="quantity1" min="1" max="50" value = "1" oninput="showValX(this)">`
        optionFragment += `<label for="quantity2">Columns: </label><input type="range" id="quantity2" name="quantity2" min="1" max="50" value = "1" oninput="showValY(this)">`
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`
        return optionFragment;
    },
    "PerlinMapRowsAndColumns": () => {
        let optionFragment = `<div class = "part" id ="PerlinMapRowsAndColumns">`;
        optionFragment += `<label for="quantity3">Perlin Rows: </label><input  type="range" id="quantity3" name="quantity3" min="1" max="50" value = "1" oninput="performPerlinMapUpdate(0,this)">`
        optionFragment += `<label for="quantity4">Perlin Columns: </label><input  type="range" id="quantity4" name="quantity4" min="1" max="50" value = "1" oninput="performPerlinMapUpdate(1,this)">`
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`
        return optionFragment;
    },
    "GridSize": () => {
        let optionFragment = `<div class = "part" id ="GridSize">`;
        optionFragment += `<label for="gridSize">Grid Size: </label><input  type="number" id="gridSize" name="gridSize" min="1" value = "8" oninput="performPerlinMapUpdate(2,this)">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
    "Resolution": () => {
        let optionFragment = `<div class = "part" id ="Resolution">`;
        optionFragment += `<label for="resolution">Resolution: </label><input  type="number" id="resolution" name="resolution" min="1" value = "64" oninput="performPerlinMapUpdate(3,this)">`
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
    "GroundLayers": () => {
        let optionFragment = `<div class = "part" id ="GroundLayers" >`;
        optionFragment += `<label for="groundLayers">Ground Layers: </label><input  type="number" id="groundLayers" name="groundLayers" min="0.1" value = "0.5" step = "0.1" oninput="performPerlinMapUpdate(4,this)">`;
        optionFragment += `<div class = "closeButton" onclick="closeSegment(this)">&#10006;</div></div>`;
        return optionFragment;
    },
};

window.onload = function () {
    tileOptions.addEventListener("click", addCommand);
    function addCommand(e) {
        if (e.target.tagName === "BUTTON") {
            gameObject.eventToPut = e.target.innerHTML
        }
    }
    mapOptions.addEventListener("click", addCommandV2);
    function addCommandV2(e) {
        if (e.target.tagName === "BUTTON") {
            
            if (mapOptionsWindow.querySelector(`#${e.target.innerHTML}`) !== null) {
                alert("Element has already been added.");
            } else {              
                mapOptionsWindow.innerHTML += mapOperations[e.target.innerHTML]();
            }

        }
    }
}

//add the menu window and assign every operation to the name of the button
for (let i = 0; i < gameObject.operations.length; i++) {
    let button = document.createElement("button");
    button.className = "mainMenuOptionButtons"
    button.innerHTML = gameObject.operations[i]
    tileOptions.appendChild(button)
}

for (let i = 0; i < Object.keys(mapOperations).length; i++) {
    let button = document.createElement("button");
    button.className = "mainMenuOptionButtons";
    button.innerHTML = Object.keys(mapOperations)[i]
    mapOptions.appendChild(button)
}

//show and hide the menu
function showControlPanel() {
    if (menu.style.display !== "flex") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
}

function showOptions() {
    tileOptions.style.display = "flex";
}

function showOptionsMap() {
    mapOptions.style.display = "flex";
}

function showControlWindow() {
    mapOptionsWindow.style.display = "flex";
}

menu.addEventListener("mouseleave", function () {
    menu.style.display = "none";
    tileOptions.style.display = "none";
    mapOptions.style.display = "none";
})

mapOptionsWindow.addEventListener("mouseleave", function () {
    mapOptionsWindow.style.display = "none";
})