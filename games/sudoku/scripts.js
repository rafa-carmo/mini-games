let numSelected = null
let tileSelected = null


let board = [
    "000000000",
    "000000000",  
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
]

let solution = [
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000"
]


function generateBoard(){
    const sudoku = Array.from({length: 9}, ()=> Array(9).fill(0));
    function shuffle(arr) {
        for (let i=arr.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function isValid(sudoku, row, col, num){
        for (let x=0; x<9; x++){
            if (sudoku[row][x] === num || sudoku[x][col] === num ||
                sudoku[3 * Math.floor(row / 3) + Math.floor(x / 3)]
                      [3 * Math.floor(col / 3) + x % 3] === num){
                return false;
            }
        }
        return true;
    }
    function setSudoku(sudoku) {
        for(let row=0; row<9; row++){
            for(let col=0; col<9; col++){
                if(sudoku[row][col] === 0){
                    const numbers = shuffle(Array.from({ length: 9 }, (_, i) => i + 1));
                    for(let num of numbers){
                        if(isValid(sudoku, row, col, num)){
                            sudoku[row][col] = num;
                            if(setSudoku(sudoku)){
                                return true;
                            }
                            sudoku[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    setSudoku(sudoku);
    
    return sudoku.map((i) => i.join(""));
}

function getRandomInt(min, max) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function ocultRandomItems(size = 5) {
  solution.map((line, key) => {
    let numbers = line.split("")
    for (let i = 0; i < size; i ++) {
      while(true) {
        let randomNumber = getRandomInt(0, 8)
        if(numbers[randomNumber] != 0)  {
          numbers[randomNumber] = 0
          break
        }
      }
    } 
    
    board[key] = numbers.join("")
  })

}


function generate() {
  solution = generateBoard()
  ocultRandomItems()  
}

generate()

window.onload = () => setGame()

function setGame() {
  Array(9).fill(0).map((_, key) => {
    let item = document.createElement("div")
    item.id = key + 1
    item.innerText = key + 1
    item.classList.add("number")
    item.addEventListener("click", selectNumber)
    document.getElementById("digits").appendChild(item)

  })

  Array(9).fill(0).map((_, line) => {
    Array(9).fill(0).map((__, row) => {
      let tile = document.createElement("div")
      tile.id = `${line + 1}-${row + 1}`
      tile.classList.add('tile')
      tile.innerText = board[line][row].replace("0", "")
      tile.addEventListener("click", selectTile)
      if(board[line][row] != '0') tile.classList.add("initial")

      if(line === 0) tile.classList.add("border-top")
      if(row === 0) tile.classList.add("border-left")
      if((line + 1) % 3 === 0) tile.classList.add("border-bottom")
      if((row + 1) % 3 === 0) tile.classList.add("border-right")

      document.getElementById("board").append(tile)
    })
  }) 
}

function clearSelection(tile) {
    numSelected.classList.remove("selected")
    numSelected = null
    if(tile) {
    tileSelected.classList.remove("selected")
    tileSelected = null
  }
}

function incrementError() {
  const element = document.getElementById("error")
  element.innerText = parseInt(element.innerText) + 1
}

function actionNumber() {
  if(tileSelected == null || numSelected == null) return

  const [line, row] = tileSelected.id.split("-")

  tileSelected.innerText = numSelected.id

  if(solution[line - 1][row - 1] !== numSelected.id) {
    tileSelected.style = "background-color: red"
    clearSelection()
    incrementError()
    return
  
  }
  
  tileSelected.style = "background-color: skyblue"
  clearSelection(true)
}

function selectTile() {
  if(tileSelected != null) {
    tileSelected.classList.remove("selected")
  }

  tileSelected = this
  tileSelected.classList.add("selected")
  actionNumber()
}

function selectNumber() {
  if(numSelected != null) {
    numSelected.classList.remove("selected")
  }

  numSelected = this;
  numSelected.classList.add("selected")
  actionNumber()
}
