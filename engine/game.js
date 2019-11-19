export default class Game{
    constructor(size){
        this.size = size
        this.setupNewGame(size)
        this.movecallback = []
        this.losecallback = []
        this.wincallback = []
  }
  //resets the game back to a random starting position
  setupNewGame(){
    this.gameState = {
        board: new Array(this.size*this.size),
        score: 0,
        won: false,
        over: false
        }
        for(var i=0; i<this.gameState.board.length;i++)
            this.gameState.board[i] = 0;
        this.addNumber();
        this.addNumber();
    }
    addNumber(){
        while(true){
            var index = Math.floor(Math.random() * this.gameState.board.length)
            if(this.gameState.board[index]==0){
                this.gameState.board[index] = Math.random() < 0.9 ? 2 : 4
                //this.gameState.board[index] = Math.floor(Math.random()*10)
                //this.gameState.board[index] = 1024
                break;
            }
        }
    }
    //convert board object to 2D array
    convertBoardto2(array){
        var arr = [...array]
        var newArr = []
        var len= Math.sqrt(arr.length)
        while(arr.length) newArr.push(arr.splice(0,len))
        return newArr
    }
    //convert board object to 1D array
    convertBoardto1(arr){
        var newArr = []
        for(var i = 0; i < arr.length; i++)
            newArr = newArr.concat(arr[i]);
        return newArr;
    }
    //given a gameState object, it loads that position, score, etc...
    loadGame(gameState){
        this.gameState = gameState
    }
    //given up, down, left, or right as string input, it makes the appropriate shifts and adds a random tile.
    move(direction){
        var twoDArray = this.convertBoardto2(this.gameState.board)
        switch(direction){
            case "left":
                for(var i = 0; i < twoDArray.length; i++)
                    twoDArray[i] = this.moveLeft(twoDArray[i],true)
                break;
            case "right":
                for(var i = 0; i < twoDArray.length; i++)
                    twoDArray[i] = this.moveLeft(twoDArray[i].reverse(),true).reverse()
                break;
            case "up":
                twoDArray = this.transpose(twoDArray)
                for(var i = 0; i < twoDArray.length; i++)
                    twoDArray[i] = this.moveLeft(twoDArray[i],true)
                twoDArray = this.transpose(twoDArray)
                break;
            case "down":
                twoDArray = this.transpose(twoDArray)
                for(var i = 0; i < twoDArray.length; i++)
                    twoDArray[i] = this.moveLeft(twoDArray[i].reverse(),true).reverse()
                twoDArray = this.transpose(twoDArray)
                break;
        }
        if(JSON.stringify(this.gameState.board)!=JSON.stringify(this.convertBoardto1(twoDArray)))
        {
            this.gameState.board = this.convertBoardto1(twoDArray)
            this.addNumber();
            this.isOver()
            this.isWin()
            this.callObservers()
        }
    }
    callObservers(){
        this.announceMove()
        if(this.gameState.won){
            this.announceWin()
        }else if(this.gameState.over){
            this.announceLose()
        }
    }
    isWin(){
            this.gameState.won = this.gameState.board.includes(2048)
    }
    isOver(){
        if(!this.gameState.board.includes(0)){
            var twoDArray = this.convertBoardto2(this.gameState.board)
            var originalGameBoard = [...twoDArray]
            for(var i = 0; i < twoDArray.length; i++)
                twoDArray[i] = this.moveLeft(twoDArray[i],false)
            for(var i = 0; i < twoDArray.length; i++)
                twoDArray[i] = this.moveLeft(twoDArray[i].reverse(),false).reverse()
            twoDArray = this.transpose(twoDArray)
            for(var i = 0; i < twoDArray.length; i++)
                twoDArray[i] = this.moveLeft(twoDArray[i],false)
            for(var i = 0; i < twoDArray.length; i++)
                twoDArray[i] = this.moveLeft(twoDArray[i].reverse(),false).reverse()
            twoDArray = this.transpose(twoDArray)
            this.gameState.over = JSON.stringify(originalGameBoard)==JSON.stringify(twoDArray)
        }
    }

    //https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    transpose(array) {
        return array[0].map((col, i) => array.map(row => row[i]));
    }

    moveLeft(arr,updateScore){
        var resultArray = []
        var unprocessedIndex = -2
        var justCombined = false
        for(var i = 0; i < arr.length; i++){
            if(arr[i]!=0){
                resultArray.push(arr[i])
                if(!justCombined){
                    unprocessedIndex++
                    justCombined = false
                }
                if(unprocessedIndex>=0&&unprocessedIndex!=resultArray.length-1)
                {
                    if(resultArray[unprocessedIndex]==resultArray[unprocessedIndex+1]){
                        resultArray[unprocessedIndex]*=2
                        if(updateScore)
                            this.gameState.score+=resultArray[unprocessedIndex]
                        resultArray.pop()
                        justCombined = true
                        unprocessedIndex++
                    }
                }
            }
        }
        for(var i = 0; i < arr.length; i++){
            if(!resultArray[i]>0){
                resultArray[i]=0
            }
        }
        return resultArray
    }

    //returns a string that is a text/ascii version of the game. See the gameState section above for an example. 
    //This will not be graded, but it useful for your testing purposes when you run the game in the console. 
    //(run_in_console.js trying to print the .toString() function after every move).
    toString(){
        var boardString = ""
        for(var i = 0; i<this.gameState.board.length;i++)
        {
            if((i+1)%Math.sqrt(this.gameState.board.length)==0){
                if(this.gameState.board[i]==0)
                    boardString = boardString + "[ ]\n"
                else
                    boardString = boardString + "["+this.gameState.board[i]+"]\n"
            }
            else{
                if(this.gameState.board[i]==0)
                    boardString = boardString + "[ ]"
                else
                    boardString = boardString + "["+this.gameState.board[i]+"]"
            }
        }
        return boardString
    }
    announceMove(){
        this.movecallback.forEach(callback => {callback(this.getGameState())})
    }
    announceWin(){
        this.wincallback.forEach(callback => {callback(this.getGameState())})
    }
    announceLose(){
        this.losecallback.forEach(callback => {callback(this.getGameState())})
    }
    //Takes a callback, when a move is made, every observer should be called with the games current gameState
    onMove(callback){
        this.movecallback.push(callback)
    }
    //Takes a callback, when the game is won, every observer should be called with the games current gameState
    onWin(callback){
        this.wincallback.push(callback)
    }
    //Takes a callback, when the game is lost, every observer should be called with the games current gameState
    onLose(callback){
        this.losecallback.push(callback)
    }
    //returns a accurate gameState object.
    getGameState(){
        return this.gameState
    }
    getScore(){
        return this.gameState.score
    }
}