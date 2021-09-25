module.exports = class Board {
    
    /* board index
    | 0 | 1 | 2 |
    | 3 | 4 | 5 |
    | 6 | 7 | 8 |
    */    
    //Constants------------
    _winConditions = [
        [[0,1,2], [0,4,8], [0,3,6]],
        [[0,1,2], [1,4,7]],
        [[0,1,2], [2,5,8], [2,4,6]],
        [[0,3,6], [3,4,5]],
        [[0,4,8], [2,4,6], [1,4,7], [3,4,5]],
        [[3,4,5], [2,5,8]],
        [[0,3,6], [6,7,8], [2,4,6]],
        [[6,7,8], [1,4,7]],
        [[6,7,8], [2,5,8], [0,4,8]]
    ];
    _serverVal = 0;
    _playerVal = 1;
    
    // protected vars
    _board = [];
    _visited = new Set();
    
    // private vars
    #server_win = false;
    #you_win = false;
    #win_raw_ids = [];

    constructor(){
        this.Reload();
    }

    Reload(){
        this._board = [];
        this.#win_raw_ids = [];
        for (let i = 0; i < 9; ++i) this._board.push(-1);
        this.#you_win = false;
        this.#server_win = false;
        this._visited.clear();
    }

    MakeMove(id_raw) {
        if (this.ServerWin() || this.YouWin() || this.BoardFull()) return -1;
        this._MakeMove(id_raw-1, 1);
    }

    // Implement the MiniMax Algorithm here
    // Currently, it is implementing an easier version
   ServerMove() {
       if (this.ServerWin() || this.YouWin() || this.BoardFull()) return -1;
       console.log('Server Move In Easy');
       var not_visited = this._NotVisited();
       var rand_id = Math.floor(Math.random() * (not_visited.length - 0));
       this._MakeMove(not_visited[rand_id], 0);
       return not_visited[rand_id]+1;
    }

    Status(){
        var res = [];
        for (let i = 0; i < 9; ++i)
        {
            if (this._board[i] !== -1) {
                res.push({id: i+1, player: this._board[i]});
            }
        }
        return res;
    }


    ServerWin() {
        return this.#server_win;
    }

    YouWin() {
        return this.#you_win;
    }

    WinningIDs(){
        return this.#win_raw_ids;
    }


    BoardFull(){
        return this._visited.size == 9;
    }

    // player = 0 -> server, player = 1 -> You
    _MakeMove(id, player) {
        this._board[id] = player;
        this._visited.add(id);
        this.#CheckWin(id, player);
    }

    _NotVisited()
    {
        var not_visited = [];
        for (let i = 0; i < 9; ++i)
        {
             if (this._visited.has(i)) continue;
             not_visited.push(i);
        }
        return not_visited;
    }

    
    // check to see if the player has won
    #CheckWin(id, player)
    {
        var has_won = false;
        var raw_ids = [];
        for (let i = 0; i < this._winConditions[id].length; ++i){
            var win = true;
            var win_raw_ids = [];
            for (let j = 0; j < this._winConditions[id][i].length; ++j){
                let next_id = this._winConditions[id][i][j];
                if (this._board[next_id] !== player) {
                    win = false;
                    break;
                }
                else win_raw_ids.push(next_id+1);
            }

            if (win === true) {
                has_won = true;
                raw_ids = win_raw_ids;
                break;
            }
        }
        
        if (has_won){
            this.#win_raw_ids = win_raw_ids;

            if (player === 1) this.#you_win = true;
            else this.#server_win = true;
        }
    }
};