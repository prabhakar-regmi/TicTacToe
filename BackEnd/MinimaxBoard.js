const DefaultBoard = require("./DefaultBoard");

module.exports = class MinimaxBoard extends DefaultBoard {
 
    difficulty(){
        return 'Hard';
    }

    ServerMove()
    {
        // Implement the Minimax algorithm here.
        if (this.ServerWin() || this.YouWin() || this.BoardFull()) return -1;
       
        // Move through the board
        var max_score = -Infinity;
        var scores = [];
        for (let i = 0; i < 9; ++i) {
            if (this._board[i] !== -1) continue; // if the value has already been set, move on
            var score_at_idx = this.#FindScoreAtIndex(0, i, 0); // This calls Minimax recursively
            scores.push({score: score_at_idx, index: i});
            max_score = Math.max( max_score, score_at_idx ); // Maximizer
        }

        // Find a random id between the IDs that gave the highest score!
        var max_ids = [];
        for (let i = 0; i < scores.length; i++) {

            if (scores[i].score === max_score) 
            {
                max_ids.push(scores[i].index);
            }
        }
        var id = max_ids[Math.floor(Math.random() * (max_ids.length))];
        this._MakeMove(id, 0);
        return id + 1;
    }


    // Score for completion:
    // I win -> +100 * (10-depth)
    // I lose -> -100 * (10 - depth)
    // Tie -> 5 * (10 - depth)
    // No result -> 0
    // player = 0 / 1 -> 0 -> computer (need to maximize). 1 -> human (need to minimize)
    #Minimax( depth, player )
    {
        // Tie
        if (this.#IsTie()) return 5*(10-depth);
        var score = (player === 0) ? -100000 : 100000;
        // loop through all the 9 cells
        for (let i = 0; i < 9; ++i) {
            if (this._board[i] !== -1) continue; // if the value has already been set, move on
            var score_at_idx = this.#FindScoreAtIndex(player, i, depth); // This calls Minimax recursively
            if (player === 0) score = Math.max( score, score_at_idx ); // Maximizer
            else score = Math.min( score, score_at_idx ); // Minimizer
        }
        return score;
    }

    #IsTie()
    {
        return this._board.every(a=>a > -1);
    }

    #FindScoreAtIndex(player, idx, depth)
    {
        var score;
        this._board[idx] = player;

        if (this.#Won(player)) {
            // If the player won due to the move, let's score!
            score = (player === 0) ? (100*(10-depth)) : -(100*(10-depth));
        }
        else { 
            // Let's look at the other player's move
            var next_player = (player === 0) ? 1 : 0;
            // recursive call to the function 
            score = this.#Minimax(depth+1, next_player)
        }

        this._board[idx] = -1;
        return score;
    }

    #Won(player){
        for (let z = 0; z < this._winConditions.length; z++) {
            var winCondition = this._winConditions[z];
            for (let i = 0; i < winCondition.length; i++){
                var won = true;
                for (let j = 0; j < winCondition[i].length; j++){
                    if (this._board[winCondition[i][j]] !== player){
                        won = false;
                        break;
                    }
                }
                if (won) return true;
            }
        }
        return false;
    }
};
