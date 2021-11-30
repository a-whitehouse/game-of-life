const grid = document.querySelector(".grid")
const shapesMenu = document.querySelector("#shapes")
const rotateButton = document.querySelector("#rotate")
const timeIntervalSlider = document.querySelector("#timeInterval")
const startButton = document.querySelector("#start")
const resetButton = document.querySelector("#reset")
const width = 100
const height = 100
const totalCells = width * height
const generationLabel = document.querySelector("#generation")
let generation = 0
let intervalId;
let timeInterval = parseInt(timeIntervalSlider.value)


function populateGrid() {

    for (let i = 0; i < totalCells; i++) {
        var cell = document.createElement("div")
        cell.setAttribute("id", i)
        cell.classList.add("cell", "dead")
        cell.addEventListener("mouseover", highlightCells)
        cell.addEventListener("mouseout", unhighlightCells)
        cell.addEventListener("click", switchHighlightedCells)
        grid.appendChild(cell)
    }
}

populateGrid()
const cells = document.querySelectorAll(".cell")

rotateButton.addEventListener("click", rotateShapes)
startButton.addEventListener("click", pauseGame)
resetButton.addEventListener("click", resetGrid)

var highlightedCells = []

function highlightCells(event) {
    let shape = shapes[shapesMenu.value]
    let startingCellId = parseInt(event.currentTarget.getAttribute("id"))

    for (let i = 0; i < shape.length; i++) {
        var shapeId = parseInt(shape[i])
        var cellId = startingCellId + parseInt(shape[i])

        // Only use indices of shape that lie within grid
        if ((shapeId % width + startingCellId % width < width) && (cellId < cells.length)) {
            var cell = cells[cellId]
            cell.classList.add("highlighted")
            highlightedCells.push(cellId)
        }
    }
}

function unhighlightCells() {
    for (let i = 0; i < highlightedCells.length; i++) {
        cells[highlightedCells[i]].classList.remove("highlighted")
    }
    highlightedCells = []
}

function switchHighlightedCells() {
    for (let i = 0; i < highlightedCells.length; i++) {
        var cell = cells[highlightedCells[i]]
        switchCellState(cell)
    }
}

function resetGrid() {
    clearInterval(intervalId)
    startButton.innerHTML = "Start"
    generation = 0
    updateGenerationLabel()

    for (let i = 0; i < totalCells; i++) {
        var cell = cells[i]
        cell.classList = "cell dead"
    }
}

function pauseGame() {
    switch (startButton.innerHTML) {
        case "Start":
            startButton.innerHTML = "Pause"
            intervalId = setInterval(executeGeneration, timeInterval)
            break
        case "Pause":
            startButton.innerHTML = "Start"
            clearInterval(intervalId)
            break
    }
    return intervalId
}

timeIntervalSlider.oninput = () => {
    timeInterval = parseInt(timeIntervalSlider.value)
    clearInterval(intervalId)
    intervalId = setInterval(executeGeneration, timeInterval)
}

function switchCellState(cell) {
    if (cell.classList.contains("dead")) {
        cell.classList.remove("dead")
    } else {
        cell.classList.add("dead")
    }
}


function executeGeneration() {
    for (let i = 0; i < totalCells; i++) {
        var cell = cells[i]
        livingNeighbours = countLivingNeighbours(cell)
        addFutureState(cell, livingNeighbours)
    }

    for (let i = 0; i < totalCells; i++) {
        var cell = cells[i]
        completeTransition(cell)
    }

    generation++
    updateGenerationLabel()
}

function updateGenerationLabel() {
    generationLabel.innerHTML = "Generation " + generation
}

function countLivingNeighbours(cell) {
    let neighbourIds = getNeighbourIds(cell)
    let livingNeighbours = 0

    for (let i = 0; i < neighbourIds.length; i++) {

        var neighbourCell = cells[neighbourIds[i]]

        if (!neighbourCell.classList.contains("dead")) {
            livingNeighbours++
        }
    }

    return livingNeighbours
}

function getNeighbourIds(cell) {
    let cellId = parseInt(cell.getAttribute("id"))

    let neighbourIds = [
        cellId - width,
        cellId + width,
    ]

    // Only show IDs for cells to left if not on left edge
    if (cellId % width) {
        neighbourIds.push(cellId - width - 1)
        neighbourIds.push(cellId - 1)
        neighbourIds.push(cellId + width - 1)
    }

    // Only show IDs for cells to right if not on right edge
    if ((cellId + 1) % width) {
        neighbourIds.push(cellId - width + 1)
        neighbourIds.push(cellId + 1)
        neighbourIds.push(cellId + width + 1)
    }

    // Only show IDs for cells above or below if they exist within set
    neighbourIds = neighbourIds.filter(i => i >= 0 && i < totalCells)

    return neighbourIds
}


function addFutureState(cell, livingNeighbours) {
    if (!cell.classList.contains("dead")) {
        // If cell alive
        if (livingNeighbours < 2) {
            // Will die from underpopulation
            cell.classList.add("dying")
        }
        else if (livingNeighbours > 3) {
            // Will die from overpopulation
            cell.classList.add("dying")
        }
        else if (checkBorderCell(cell)) {
            // Keep border empty
            cell.classList.add("dying")
        }
    }
    else {
        // If cell dead
        if (livingNeighbours === 3) {
            // Will revive from reproduction
            cell.classList.add("reviving")
        }
    }
}


function checkBorderCell(cell) {
    let cellId = cell.getAttribute("id")
    return (
        (cellId % width === 0) ||
        (cellId % width === width - 1) ||
        (cellId < width) ||
        (cellId >= totalCells - width))
}


function completeTransition(cell) {
    if (cell.classList.contains("dying")) {
        cell.classList.add("dead")
        cell.classList.remove("dying")
    }
    else if (cell.classList.contains("reviving")) {
        cell.classList.remove("dead")
        cell.classList.remove("reviving")
    }
}


function populateShapesMenu() {
    for (var shapeName of Object.keys(shapes)) {
        shapeOption = document.createElement("option")
        shapeOption.setAttribute("value", shapeName)
        shapeOption.innerHTML = shapeName
        shapesMenu.appendChild(shapeOption)
    }
}


function rotateIndex(index) {
    return (index % width) * width + Math.floor(index / width)
}


function rotateShapes() {
    for (const shapeIndices of Object.values(shapes)) {
        for (let i = 0; i < shapeIndices.length; i++) {
            shapeIndices[i] = rotateIndex(shapeIndices[i])
        }
    }
}

const shapes = {
    "Single Cell": [0],

    // Still Lifes
    "Block": [0, 1, width, width + 1],
    "Bee-hive": [1, 2, width, width + 3, width * 2 + 1, width * 2 + 2],
    "Loaf": [1, 2, width, width + 3, width * 2 + 1, width * 2 + 3, width * 3 + 2],
    "Boat": [0, 1, width, width + 2, width * 2 + 1],
    "Tub": [1, width, width + 2, width * 2 + 1],

    // Oscillators
    "Blinker": [0, width, width * 2],
    "Toad": [0, 1, 2, width + 1, width + 2, width + 3],
    "Beacon": [0, 1, width, width + 1, width * 2 + 2, width * 2 + 3, width * 3 + 2, width * 3 + 3],
    "Pulsar": [2, 3, 4, 8, 9, 10,
        width * 2, width * 2 + 5, width * 2 + 7, width * 2 + 12,
        width * 3, width * 3 + 5, width * 3 + 7, width * 3 + 12,
        width * 4, width * 4 + 5, width * 4 + 7, width * 4 + 12,
        width * 5 + 2, width * 5 + 3, width * 5 + 4, width * 5 + 8, width * 5 + 9, width * 5 + 10,
        width * 7 + 2, width * 7 + 3, width * 7 + 4, width * 7 + 8, width * 7 + 9, width * 7 + 10,
        width * 8, width * 8 + 5, width * 8 + 7, width * 8 + 12,
        width * 9, width * 9 + 5, width * 9 + 7, width * 9 + 12,
        width * 10, width * 10 + 5, width * 10 + 7, width * 10 + 12,
        width * 12 + 2, width * 12 + 3, width * 12 + 4, width * 12 + 8, width * 12 + 9, width * 12 + 10,
    ],
    "Penta-decathlon": [
        1,
        width + 1,
        width * 2,
        width * 2 + 2, width * 3 + 1,
        width * 4 + 1,
        width * 5 + 1,
        width * 6 + 1,
        width * 7, width * 7 + 2,
        width * 8 + 1, width * 9 + 1,
    ],

    // Spaceships
    "Glider": [0, width + 1, width + 2, width * 2, width * 2 + 1],
    "Lightweight Spaceship": [
        2, 3,
        width, width + 1, width + 3, width + 4,
        width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3,
        width * 3 + 1, width * 3 + 2,
    ],
    "Middleweight Spaceship": [
        3, 4,
        width, width + 1, width + 2, width + 4, width + 5,
        width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3, width * 2 + 4,
        width * 3 + 1, width * 3 + 2, width * 3 + 3,
    ],
    "Heavyweight Spaceship": [
        4, 5,
        width, width + 1, width + 2, width + 3, width + 5, width + 6,
        width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3, width * 2 + 4, width * 2 + 5,
        width * 3 + 1, width * 3 + 2, width * 3 + 3, width * 3 + 4,
    ],

    // Methuselahs
    "R-pentomino": [1, 2, width, width + 1, width * 2 + 1],
    "Diehard": [6, width, width + 1, width * 2 + 1, width * 2 + 5, width * 2 + 6, width * 2 + 7],
    "Acorn": [1, width + 3, width * 2, width * 2 + 1, width * 2 + 4, width * 2 + 5, width * 2 + 6],

    // Indefinite Growth
    "Gosper's Glider Gun": [
        25,
        width + 23,
        width + 25,
        width * 2 + 13,
        width * 2 + 14,
        width * 2 + 21,
        width * 2 + 22,
        width * 2 + 35,
        width * 2 + 36,
        width * 3 + 12,
        width * 3 + 16,
        width * 3 + 21,
        width * 3 + 22,
        width * 3 + 35,
        width * 3 + 36,
        width * 4 + 1,
        width * 4 + 2,
        width * 4 + 11,
        width * 4 + 17,
        width * 4 + 21,
        width * 4 + 22,
        width * 5 + 1,
        width * 5 + 2,
        width * 5 + 11,
        width * 5 + 15,
        width * 5 + 17,
        width * 5 + 18,
        width * 5 + 23,
        width * 5 + 25,
        width * 6 + 11,
        width * 6 + 17,
        width * 6 + 25,
        width * 7 + 12,
        width * 7 + 16,
        width * 8 + 13,
        width * 8 + 14
    ]

}

populateShapesMenu()
