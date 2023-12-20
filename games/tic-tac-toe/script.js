const box = document.getElementById("box-game")

// Elements
const types = {
    cross: "w-24 h-24 cross bg-center bg-cover bg-no-repeat",
    circle: "p-5 border-black rounded-full border-2 w-24 h-24"
}

class Game {
    constructor(){
        this.items = []
        this.hasWinner = undefined
    }
    draw(){
        for (let x = 0; x < 3; x++){
            for(let y = 0; y < 3; y++){
                const square = new Square(x, y, this.items.length)

                square.draw()
                this.items.push(square)
                box.append(square.element)
            }
        }
        this.items.map((item) => item.getParents())
    }
    setWinner(player) {
        if(player !== 'Draw'){
            alert(`Vencedor Jogador ${players[player].player}`)
            this.hasWinner = players[player]
        }

        document.getElementById("resetButton").classList.toggle('hidden')
    }

    reset(){
        this.items = []
        document.getElementById("box-game").innerHTML = ""
        this.hasWinner = undefined
        players[1].setTurn(true)
        players[2].setTurn(false)
        this.draw()
        
        document.getElementById("resetButton").classList.toggle('hidden')
    }
}

// Class from Player
class Player {
    constructor(type, player) {
        this.type = type
        this.isTurn = false
        this.player = player
    }

    changeTurn() {
        if(game.hasWinner) return
        this.isTurn = !this.isTurn
        document.getElementById(`status-player-${this.player}`).classList.toggle('bg-white')
    }
    setTurn(state){
        this.isTurn = state
        const classList = document.getElementById(`status-player-${this.player}`).classList
        classList.remove("bg-white")
        if(state) {
           classList.toggle('bg-white')
        }
    }

}

// Players List
const players = {
   2: new Player("circle", '1'),
   1: new Player("cross", '2'),
}

// Element from draw and show
class Square {
    constructor(x, y, index){
        this.x = x
        this.y = y
        this.index = index
        this.type = ""
        this.parents = {
            top: null,
            bottom: null,
            left: null,
            right: null
        }
        this.player
    }
    
    draw(){
        let style = "w-[33%] h-[33%] border-black flex items-center justify-center "
        if(this.x !== 2) style += " border-b "
        if(this.y !== 2) style += " border-r "

        const square = document.createElement('div')
        square.className = style
        square.id = this.index

        const mark = document.createElement('div')
        mark.className = "element"
        square.append(mark)

        square.addEventListener("click", () => {
            const playerIndex = players[2].isTurn ? 1 : 2
            if(this.mark(players[playerIndex].type)){
                this.player = playerIndex
                hasWinner()
                Object.keys(players).map((player) => players[player].changeTurn())
            }
        })
        this.element = square
    }
  

    mark(type){
        if(game.hasWinner) return
        if(this.element.getElementsByClassName("element").length <= 0 )return false
        this.element.firstChild.className = types[type]
        this.type = type
        return true
    }

    getParents()
    {
        this.parents = {
            top: this.x > 0 ? getIndexByLocation(this.x-1, this.y) : null,
            topLeft: this.x > 0 && this.y > 0 ? getIndexByLocation(this.x -1, this.y-1) : null,
            left: this.y > 0 ? getIndexByLocation(this.x, this.y-1) : null,
            topRight: this.x > 0 && this.y < 2 ? getIndexByLocation(this.x -1, this.y + 1) : null,
            right: this.y < 2 ? getIndexByLocation(this.x, this.y+1) : null,
            bottom: this.x < 2 ? getIndexByLocation(this.x + 1, this.y) : null,
            bottomLeft: this.x < 2 && this.y > 0 ? getIndexByLocation(this.x + 1, this.y-1) : null,
            bottomRight: this.x < 2 && this.y < 2 ? getIndexByLocation(this.x + 1, this.y+1) : null,
        }

    }
}


function getIndexByLocation(x, y){
    const element = game.items.find(item => item.x === x && item.y === y)
    if(element)
    {
        return element.index
    }
    return null
}

function hasWinner()
{
    let hasWinner = false
    game.items.map((item) => {
        if(hasWinner) return
        if(item.type === '') return

        if(item.parents.left !== null && item.parents.right !== null){
            if(game.items[item.parents.left].type === item.type && game.items[item.parents.right].type === item.type) {
                game.setWinner(item.player)
                hasWinner = true 
            }
        }
        if(item.parents.top !== null && item.parents.bottom !== null){
            if(game.items[item.parents.top].type === item.type && game.items[item.parents.bottom].type === item.type) {
                game.setWinner(item.player)
                hasWinner = true 
            }
        }
        if(item.parents.topLeft !== null && item.parents.topRight !== null && item.parents.bottomRight !== null && item.parents.bottomLeft !== null) {
            if(game.items[item.parents.topLeft].type === item.type && game.items[item.parents.bottomRight].type === item.type) {
                game.setWinner(item.player)
                hasWinner = true
            }
            if(game.items[item.parents.topRight].type === item.type && game.items[item.parents.bottomLeft].type === item.type) {
                game.setWinner(item.player)
                hasWinner = true
            }
        }
    })
    if(game.items.filter((item) => item.type !== '').length === 9) {
        game.setWinner('Draw')
    }
}

const game = new Game()
game.draw()