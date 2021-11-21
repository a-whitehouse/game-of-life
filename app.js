const grid = document.querySelector(".grid")
const width = 100
const height = 100
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

// Glider
switchCellState(cells[101])
switchCellState(cells[202])
switchCellState(cells[203])
switchCellState(cells[301])
switchCellState(cells[302])


// Blinker
switchCellState(cells[444])
switchCellState(cells[445])
switchCellState(cells[446])

// Toad
switchCellState(cells[1444])
switchCellState(cells[1445])
switchCellState(cells[1446])
switchCellState(cells[1543])
switchCellState(cells[1544])
switchCellState(cells[1545])

// Beacon
switchCellState(cells[464])
switchCellState(cells[465])
switchCellState(cells[564])
switchCellState(cells[565])
switchCellState(cells[666])
switchCellState(cells[667])
switchCellState(cells[766])
switchCellState(cells[767])


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

setInterval(executeGeneration, 500)

