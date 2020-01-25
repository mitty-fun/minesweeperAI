function AI (game) {

    let arr = game.getAllCos();
    
    arr.forEach(col => {
        col.isFocus = false;
        col.probability = undefined;
    });

    arr = arr.filter((col) => {
        return !col.isOpen && !col.isFlag && game.getNeighbors(col).some(col => col.isOpen);
    })

    arr.forEach(col => {
        col.isFocus = true;
        col.probability = 0;
    });

    let count = 0;
    let nodes = 0;

    function resolve (arr, deep) {

        nodes++;

        if (deep >= arr.length) {
            arr.filter(col => col.pretend === 'bomb').forEach(col => col.probability++);
            count++;
            return;
        }

        const col = arr[deep];

        col.pretend = 'save';
        if (isValid(col, game)) resolve(arr, deep + 1);

        col.pretend = 'bomb';
        if (isValid(col, game)) resolve(arr, deep + 1);

        

        col.pretend = undefined;
    }
    
    resolve(arr, 0);

    arr.forEach((col) => {
        if (col.probability === count) col.isFlag = true;
        if (col.probability === 0) game.open(col);
    });

    if (arr.some((col) => col.isOpen) === false) {
        var col = arr.sort((col) => col.probability)[0];
        game.open(col);
    }
    
    arr.forEach((col) => {
        col.probability = undefined;
        col.isFocus = false;
    })
}



function isValid (cell, game) {

    let judgers = game.getNeighbors(cell).filter((cell) => {
        return cell.isOpen && cell.number > 0;
    });

    

    for (let i=0; i<judgers.length; i++) {
        let judger = judgers[i];

        let col;
        let bombs = 0;
        let saves = 0;
        let unknow = 0;
        let judgerNe = game.getNeighbors(judger);
        
        for (let i=0; i<judgerNe.length; i++) {
            col = judgerNe[i];
            if (col.isOpen || col.pretend === 'save') {
                saves++;
            } else if (col.isFlag || col.pretend === 'bomb') {
                bombs++;
            } else {
                unknow++;
            }
        }
        if (bombs > judger.number || bombs + unknow < judger.number) {
            return false;
        }
    }

    return true;

}