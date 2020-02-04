class Minesweeper {
   
    constructor (width = 20, height = 20, bombs = 50) {
        this.bombs = bombs
        this.width = width
        this.height = height
        this.grid = [];
        this.offsets = [
            {x:-1, y:-1},
            {x:+0, y:-1},
            {x:+1, y:-1},
            {x:-1, y:+0},
            {x:+1, y:+0},
            {x:-1, y:+1},
            {x:+0, y:+1},
            {x:+1, y:+1},
        ]
        this.status // ready -> playing -> gameover
        this.timer
        this.leave

        setInterval(() => {
            if (this.status === 'playing') this.timer++
        }, 1000)

        this.reset()
    }

    reset = (width, height, bombs) => {
        if (width) this.width = width
        if (height) this.height = height
        if (bombs) this.bombs = bombs
        this.status = 'ready'
        this.timer = 0
        this.leave = this.width*this.height - this.bombs
        this.resetGrid()
        this.randomBomb()
    }

    resetGrid = () => {
        this.grid.splice(0, this.grid.length)
        for (let y = 0; y < this.height; y++) {
            this.grid.push([])
            for (let x = 0; x < this.width; x++) {
                this.grid[y].push(this.getColObject(x, y))
            }   
        }
    }

    getColObject = (x, y) => {
        return {
            x, y,
            isBomb: false,
            isOpen: false,
            isFlag: false,
            number: 0,
            probability: undefined,
            isFocus: false,
            pretend: undefined,
        }
    }

    randomBomb = () => {
        let count=0
        while (count < this.bombs && count < this.width*this.height) {
            let x = Math.floor(Math.random() * this.width)
            let y = Math.floor(Math.random() * this.height)
            let col = this.grid[y][x]
            if (col.isBomb) continue
            
            col.isBomb = true
            count++
            this.getNeighbors(col).forEach(row => row.number++)
        }
    }


    autoOpen = (col) => {
        const cols = this.getNeighbors(col)
        const save = cols.filter(col => col.isFlag).length
        if (col.number == save) cols.filter(col => !col.isOpen && !col.isFlag).forEach(this.open)
    }

    open = (col) => {
        if (this.status === 'ready') this.status = 'playing'
        if (col.isOpen || col.isFlag || this.status === 'gameover') return
        
        col.isOpen = true
        this.leave--

        if (col.isBomb || this.leave === 0) return this.gameover()
        if (!col.isBoom && col.number === 0) {
            this.getNeighbors(col).forEach(this.open)
        }
    }

    toggleFlag = (col) => {
        if (col.isOpen || this.status == 'gameover') return
        col.isFlag = !col.isFlag
    }

    gameover = () => {
        this.status = 'gameover'
    }

    getNeighbors = ({x, y}) => {
        return this.offsets.map((offset) => {
            return { x: x + offset.x, y: y + offset.y }
        })
        .filter(this.isValidPos)
        .map(this.getCol)
    }

    isValidPos = ({x, y}) => {
        return x >= 0 && x < this.width &&
               y >= 0 && y < this.height
    }

    getCol = ({x, y}) => {
        return this.grid[y][x]
    }

    getAllCos = () => {
        let arr = []
        this.grid.forEach((row) => {
            arr = arr.concat(row)
        })
        return arr;
    }
}
