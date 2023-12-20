const canvas = document.querySelector("#game")
const pointsElement = document.querySelector("#points")
const gameOver = document.querySelector("#game-over")

const ctx = canvas.getContext("2d")
const canvaSize = {
    width: 600,
    height: 600
}

canvas.width = canvaSize.width
canvas.height = canvaSize.height

const size = 30

let direction, loop
let pts = 0
let commands = []
let started = false

const directions = {
    left: (snake) => ({...snake, x: snake.x - size}),
    right: (snake) => ({...snake, x: snake.x + size}),
    top: (snake) => ({...snake, y: snake.y - size}),
    bottom: (snake) => ({...snake, y: snake.y + size})
}

const difficulties = {
    easy: 300,
    medium: 150,
    hard: 60
}

let difficulty = "easy"

const keys = {
    ArrowUp: {
        direction : "top",
        oposite: "bottom"
    },
    ArrowDown: {
        direction: "bottom",
        oposite: "top"
    },
    ArrowLeft: {
        direction: "left",
        oposite: "right"
    },
    ArrowRight: {
        direction: "right", 
        oposite: "left"
    }
}

const initialSnake = [
    { x: 210, y: 210 },
    { x: 240, y: 210 },
]

let snake = initialSnake

const random = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randonFood = () => {
    let x, y
    while (true) {
        x = Math.round(random(0, 570) / 30) * 30
        y = Math.round(random(0, 570) / 30) * 30
        if(snake.filter((item) => item.x === x && item.y === y).length === 0) break
    }
    return {x, y}
}

let food = randonFood()

const drawFood = () => {
    const {x, y} = food
    ctx.fillStyle = "white"
    ctx.fillRect(x, y, size, size)
}

const drawSnake = () => {
    ctx.fillStyle = "black"
    snake.map((element, index) => {
        if(index === snake.length -1) {
            ctx.fillStyle = "rgba(10, 10, 10, .5)"
        }
        ctx.fillRect(element.x, element.y, size, size)
    })
}

const moveSnake = () => {
    if(commands.length > 0){
        direction = commands.at(-1)
        commands.pop()
    }
    if(!direction) return
    const head = snake.at(-1)
    snake.push(directions[direction](head))
    snake.shift()
}

function drawGrid() {
    ctx.lineWidth = 1
    ctx.strokeStyle = "rgba(10, 10, 10, .2)"
    const space = 30
    for(let l = space; l < canvaSize.width; l += space) {
        ctx.beginPath()
        ctx.lineTo(l, 0)
        ctx.lineTo(l, canvaSize.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, l)
        ctx.lineTo(canvaSize.width, l)
        ctx.stroke()
    }
    
}

const checkEat = () => {
    const head = snake.at(-1)
    if(food.x === head.x && food.y === head.y) {
        snake.unshift(directions[direction](snake[0]))
        console.log(pts)
        pts += 10
        pointsElement.innerText = pts
        food = randonFood()
    }
}

const checkColision = () => {
    const {x, y} = snake.at(-1)
    if(x >= canvaSize.width ||  x <= 0 - size ||  y >= canvaSize.height ||  y <= 0 - size) {
        return true
    }

    if(snake.slice(0, snake.length-1).filter(position => position.x === x && position.y === y).length > 0) return true
}

function gameLoop() {
    clearInterval(loop)
    ctx.clearRect(0, 0, canvaSize.width, canvaSize.height)
    drawGrid()
    if(checkColision()) {
        drawSnake()
        gameOver.classList.toggle("hidden")
        return
    }
    drawFood()
    checkEat()
    moveSnake()
    drawSnake()
    loop = setInterval(() => gameLoop(), difficulties[difficulty])
}

function setDifficulty(selected) {
    difficulty = selected
    Object.keys(difficulties).map((item) => {
        const element = document.getElementById(item)
        
        if(element.classList.value.includes("bg-white")) {
            element.classList.toggle("bg-white")
            element.classList.toggle("text-black")
            element.classList.toggle("text-white")
            
        }
    })
    document.getElementById(selected).classList.toggle("bg-white")
    document.getElementById(selected).classList.toggle("text-black")
    document.getElementById(selected).classList.toggle("text-white")
}

function start()
{
    document.getElementById("difficulties").childNodes.forEach((element) => {
        if(element.setAttribute){
            element.setAttribute("disabled", true)
        }
    })
    started = true
}

document.addEventListener("keydown", (event) => {
    if(!Object.keys(keys).includes(event.key)) return
    const eventDirection = keys[event.key]
    if(direction === eventDirection.oposite) return
    if(!started) start()
    commands.unshift(eventDirection.direction)
})


gameLoop()