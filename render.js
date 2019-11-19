import Game from "./engine/game.js";

var game
$(document).ready(() => {
    let game2 = new Game(4)
    game = game2
    setup2048View(game)
    game.onMove(gameState => {
        setup2048View(game)
    });
    
    game.onWin(gameState => {
        $("#seg2").append(`<p>You <strong>won</strong>! Your score was <strong>${game.getScore()} points</strong></p>`)
    });
    
    game.onLose(gameState => {
        $("#seg2").append(`<p>You <strong>lose</strong>! Your score was <strong>${game.getScore()} points</strong></p>`)
    })
});

let setup2048View = (game) => {
    $("#seg1").empty()
    $("#seg1").append(`<h1 class="title">2048</h1>`)
    $("#seg1").append(`<div class='score-container'>Score: ${game.getScore()}</div>`)
    $("#seg2").empty()
    $("#seg2").append(`<p class="game-intro">Combine the numbers and get to the <strong>2048 tile!</strong></p>`)
    $("#seg2").append(`<button class="restart-button">New Game</button>`)
    let board_div = $("#board");
    board_div.empty()
    let field_table = $(`<table class="game-container"></table>`);

    for (let y=0; y<4; y++) {
        let row = $(`<tr></tr>`);
        for (let x=0; x<4; x++) {

            let board_div 
            if(game.getGameState().board[4*y+x]>2048){
                board_div = $(`<div class='cell4096'></div>`);
            }else{
                board_div= $(`<div class='cell${game.getGameState().board[4*y+x]}'></div>`);	 
            }   
            if(game.getGameState().board[4*y+x]!=0)
                board_div.append($(`<span class="cell-label">${game.getGameState().board[4*y+x]}</span>`));
            
            row.append($(`<td></td>`).append(board_div));
        }
        field_table.append(row);
    }
    board_div.append(field_table)
    board_div.append(`<p>HOW TO PLAY: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>`)
}

$(document).keydown(function (e) {
    e.preventDefault()
    switch(e.keyCode){
        case 37:
            game.move("left")
            break
        case 38:
            game.move("up")
            break
        case 39:
            game.move("right")
            break
        case 40:
            game.move("down")
            break
    }
}
);
$(document).on('click', '.restart-button', function(){
    let game2 = new Game(4)
    game = game2
    setup2048View(game)
    game.onMove(gameState => {
        setup2048View(game)
    });
    
    game.onWin(gameState => {
        $("#board").append(`<p>You won with <strong>${game.getScore()} points</strong></p>`)
    });
    
    game.onLose(gameState => {
        $("#board").append(`<p>You lose! Your score was <strong>${game.getScore()} points</strong></p>`)
    })
});