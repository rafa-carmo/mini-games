let sleepSetTimeout_ctrl

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

async function flipSleep(element1, element2, ms=1000)
{
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms)).then(()=> {
        element1.classList.toggle("[transform:rotateY(180deg)]")
        element2.classList.toggle("[transform:rotateY(180deg)]")
        console.log("int")
        clearInterval(sleepSetTimeout_ctrl)
    })
}

function shuffle(array) {
    const copy = []
    let n = array.length;

    while (n) {
        const i = Math.floor(Math.random() * array.length);

        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }
return copy;
}
class Game {
    constructor(lines, cols, iconList){
        this.lines = lines
        this.cols = cols
        this.iconList = iconList
        this.elements = []
        this.match = []
    }

    listIcons() {
        const list = []

        for(let i=1; i <= (this.lines * this.cols) / 2; i++){
            while (true){
                const icon = this.iconList[getRandomInt(0, this.iconList.length)]
                if(!list.includes(icon)){
                    list.push(icon)
                    break
                }
            }
        }

        this.icons = shuffle(list.concat(list))
    
    }

    async compare(){

        if(this.elements.length <= 1) {
            return
        }

        if(this.elements.length === 2){

            if(this.elements[0].innerText === this.elements[1].innerText){
                this.match.push(this.elements[0])
                this.match.push(this.elements[1])

                this.elements.forEach((el)=>{
                    el.classList.toggle("shadow")
                    el.classList.toggle("shadow-green-500")
                })

                this.elements = []
                if(this.match.length === this.icons.length)
                {
                    alert("Congratulations")
                }
                return true
            }

            await new Promise(r => setTimeout(r, 1000));

            this.elements.map((item) => item.classList.toggle("[transform:rotateY(180deg)]"))
            this.elements = []
        }
    }
    draw(){
        const container = document.getElementById("game-container")
        let index = 0
        for(let x = 1; x <= this.lines; x++){
            const line = document.createElement("div")
            line.classList = "w-full flex"
            
            for(let y = 1; y <= this.cols; y++){
                const card = new Card(index, this.icons[index])
                const element = card.draw()
                element.addEventListener("click", async () => {
                    if(this.elements.length >= 2){
                        return
                    }
                    const select = element.getElementsByTagName("div")[0]
                    
                    if(this.match.filter((filter) => filter === select).length > 0)
                    {
                        return
                    }
                    this.elements.push(select)
                    select.classList.toggle("[transform:rotateY(180deg)]")

                    await this.compare()
                })
                line.append(element)

                index ++
            }

            container.append(line)
        }
        
    }

}

class Card {
    constructor(id, icon)
    {
        this.id = id
        this.icon = icon
    }

    draw(){
        const element = document.createElement("div")
                element.classList = "flex-1 flex items-center justify-center group  gap-1 p-1 cursor-default"

                const containerCard = document.createElement("div")
                containerCard.classList = "border-black border relative w-full h-full flex items-center justify-center transition-all duration-500 [transform-style:preserve-3d] "
                containerCard.setAttribute("id", `${this.id}`)
 
                const back = document.createElement("div")
                back.classList = "absolute  border-black border inset-0 top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-white"
                
                const front = document.createElement("div")
                front.classList = "absolute border-black border text-2xl inset-0 top-0 left-0 bottom-0 right-0 bg-white text-center text-slate-200 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]"
                front.innerText= this.icon

                containerCard.append(back)
                containerCard.append(front)
                element.append(containerCard)
                return element
    }
}
fetch("icons.json").then(response => response.json()).then((icons) => {
    const game = new Game(4, 4, icons.icons)
    game.listIcons()
    game.draw()
})