import Vue from 'vue'
import Minesweeper from './minesweeper'
import AI from './ai'


const game = new Minesweeper()

new Vue({
    el: '#game',
    data: {
        isFirstTime: true,
        game,
        grid: game.grid,
        width: game.width,
        height: game.height,
        bombs: game.bombs,
    },
    methods: {
        mousedownLeft(col) {
            if (col.isOpen) {
                this.game.autoOpen(col)
            } else {
                this.game.open(col)
            }
        },
        
        mousedownRight(col) {
            this.game.toggleFlag(col)
        },
        
        restart() {
            const width = Number(this.width)
            const height = Number(this.height)
            const bombs = Number(this.bombs)
            this.game.reset(width, height, bombs)
            this.isFirstTime = false
        },
        
        classArrayOf(col) {
            return [
                'color-' + col.number,
                col.isOpen ? 'bg-brown' : 'bg-green',
                (col.x + col.y) % 2 === 0 ? 'bg-deep' : 'bg-fade',
                { isFlag: col.isFlag },
                { isBomb: this.game.status === 'gameover' && col.isBomb },
            ]
        },

        runAI () {
            this.restart()
            AI(this.game)
        }
    },

    computed: {
        getGameTime() {
            let h = Math.floor(this.game.timer / 3600)
            let m = Math.floor(this.game.timer % 3600 / 60)
            let s = Math.floor(this.game.timer % 60)
            if (h < 10) h = '0' + h
            if (m < 10) m = '0' + m
            if (s < 10) s = '0' + s
            return `${h}:${m}:${s}`
        },
        
        getGameStatus() {
            if (this.game.status === 'ready') {
                return 'click to start'
            }
            if (this.game.status === 'playing') {
                return 'leave ' + this.game.leave
            }
            if (this.game.status === 'gameover') {
                return this.game.leave === 0 ? 'YOU WIN' : 'YOU LOSE'
            }
        }
    }
})