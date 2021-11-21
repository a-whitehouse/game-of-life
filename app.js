const grid = document.querySelector(".grid")
const width = 10
const height = 10
const totalCells = width * height
const generationLabel = document.querySelector("#generation")
let generation = 0


function populateGrid() {

    for (let i = 0; i < totalCells; i++) {
        var cell = document.createElement("div")
        cell.setAttribute("id", i)
        cell.classList.add("cell", "dead")
        grid.appendChild(cell)
    }
}

populateGrid()
const cells = document.querySelectorAll(".cell")

for (let i = 44; i < 47; i++) {
    cells[i].classList.remove("dead")
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

setInterval(executeGeneration, 1000)

