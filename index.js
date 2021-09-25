const Express = require('express');
const path = require('path');
const MiniMaxBoard = require('./BackEnd/MinimaxBoard');
const DefaultBoard = require('./BackEnd/DefaultBoard');
const Board = require('./BackEnd/Board');
const e = require('express');

// get the app
let app = Express();
var grid = new DefaultBoard();
let difficulty = 1;

// middleware
app.use(Express.static(path.join(__dirname, './FrontEnd'))); // for static files - css and js
app.use(Express.json()); // for reading the json contents

// Connect to the server
const default_port = 1000;
let server = app.listen(process.env.port || default_port, ()=>{
    console.log(`Successfully Listening to ${server.address().port}`);
});

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, './FrontEnd/index.html'));
});

// serve the post request
// calculate and provide the next move
app.post('/move', (req, res)=>{
    var ResponseData = {id:-1, gameFinished:false, result:'', win_idx:{}};
    let id = parseInt(req.body.id);
    console.log(`Message Move:${id} received in the server`);
    grid.MakeMove(id);
    console.log(`Message Move:${id} : Completed Making the move`);
    ResponseData.id =  grid.ServerMove();
    console.log(`Message Move:${id} : Completed Making the ServerMove`);
    
    if (grid.ServerWin()){
        ResponseData.gameFinished = true;
        ResponseData.result = 'ServerWin';
        ResponseData.win_idx = grid.WinningIDs();
    } 
    else if (grid.YouWin()){
        ResponseData.result = 'YouWin';
        ResponseData.gameFinished = true;
        ResponseData.win_idx = grid.WinningIDs();
    }
    else if (grid.BoardFull()){
        ResponseData.result = 'BoardFull';
        ResponseData.gameFinished = true;
    }
    res.json(ResponseData);
    res.end();
    console.log(`Message Move:${id} : Completed sending the response: ${ResponseData}`);
});

// serve the post request to 
// return back the board state
app.post('/state', (req, res)=>{
    res.json(
        {
            status: grid.Status(), 
            win: {
                result: grid.YouWin() ? 'YouWin' : (grid.ServerWin() ? 'ServerWin' : 'No'),
                win_idx: grid.WinningIDs()
            }
        });
    res.end();
});

// serve the post request to 
// restart the board state
app.post('/restart', (req, res)=>{
    
    console.log(req.body.difficulty);
    if(req.body.difficulty === 'Easy'){
        if (difficulty === 0) grid.Reload();
        else grid = new Board();
        difficulty = 0;
    }
    else if (req.body.difficulty === 'Medium'){
        if (difficulty === 1) grid.Reload();
        else grid = new DefaultBoard();
        difficulty = 1;
    }
    else {
        if (difficulty === 2) grid.Reload();
        else grid = new MiniMaxBoard();
        difficulty = 2;
    }

    // return the response back
    res.end();

});