const DefaultBoard = require("./DefaultBoard");

module.exports = class MinimaxBoard extends DefaultBoard {
    
    constructor()
    {
        super();
    }
    
    ServerMove()
    {
        if (this.ServerWin() || this.YouWin() || this.BoardFull()) return -1;
        console.log('Server Move In Hard');
        var remaining = this._NotVisited();

    }

};
