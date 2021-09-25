const Board = require("./Board");

module.exports = class DefaultBoard extends Board {

    constructor(){
        super();
    }

    ServerMove() {
        if (this.ServerWin() || this.YouWin() || this.BoardFull()) return -1;
        console.log('Server Move In Medium');

        var not_visited = this._NotVisited();

        // Find a potential winning position
        // or, a potential saving position
        var [winning, saving] = this._FindWinningOrSavingMove(not_visited);
        if (winning >= 0) console.log(`Winning Move = ${winning}`);
        if (saving >= 0) console.log(`Saving Move = ${saving}`);

        var move_id = 0;
        if (winning >= 0) move_id = winning;
        else if (saving >= 0) move_id = saving;
        else move_id = not_visited[Math.floor(Math.random() * (not_visited.length - 0))];

        this._MakeMove(move_id, 0);
        return move_id+1;
    }


    // This Function finds a random move
    // unless there's a winning move
    // or, if there's a move to save the game!
    _FindWinningOrSavingMove(not_visited)
    {
        var winning = -1;
        var saving = -1;
        not_visited.forEach(val => {
            var winners = this._winConditions[val];
            for (var i = 0; i < winners.length; i++) {
                var curr_state = -1; // -1 -> no player or server seen, 0 -> server_seen, 1 -> player seen
                for (var j = 0; j < winners[i].length; j++){
                    if (winners[i][j] === val) continue;
                    if (this._board[winners[i][j]] === this._serverVal){
                        if (curr_state === this._playerVal) {
                            curr_state = -1;
                            break; //Doesn't contain a possible winner
                        }
                        curr_state = this._serverVal;
                    }
                    else if (this._board[winners[i][j]] == this._playerVal){
                        if (curr_state === this._serverVal) {
                            curr_state = -1;
                            break; //Doesn't contain a possible winner
                        }
                        curr_state = this._playerVal;
                    }
                    else {
                        curr_state = -1;
                        break; // Doesn't contain any value in this cell yet!
                    }
                }
                if (curr_state === this._serverVal){
                    winning = val;
                    return;
                }
                if (curr_state === this._playerVal){
                    saving = val;
                }
            }
        });

        return [winning, saving];
    }

};