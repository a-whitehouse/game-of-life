const grid = document.querySelector(".grid")
const shapesMenu = document.querySelector("#shapes")
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

startButton.addEventListener("click", pauseGame)
resetButton.addEventListener("click", resetGrid)

var highlightedCells = []

function highlightCells(event) {
    let shape = shapes[shapesMenu.value]
    let startingCellId = parseInt(event.currentTarget.getAttribute("id"))

    for (let i = 0; i < shape.length; i++) {
        let cellId = startingCellId + parseInt(shape[i])
        if (cellId < cells.length) {
            let cell = cells[cellId]
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
        let cell = cells[highlightedCells[i]]
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
    if (!cell.classList.contains("dead") && livingNeighbours < 2) {
        // Will die from underpopulation
        cell.classList.add("dying")
    }
    if (!cell.classList.contains("dead") && livingNeighbours > 3) {
        // Will die from overpopulation
        cell.classList.add("dying")
    }
    else if (cell.classList.contains("dead") && livingNeighbours === 3) {
        // Will revive from reproduction
        cell.classList.add("reviving")
    }
    else {
        // No change in state
    }
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

const shapes = {
    "Single Cell": [0],
    "Blinker": [0, width, width * 2],
    "Square": [0, 1, width, width + 1],
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
