const cross_string = "\u274C";
const o_string = "\u25EF";
var my_turn = true;

// Assynchronous function to post the data to the backend server
async function SendMessageToBackEnd(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// function to print out either a cross or a O in the given box
function Display(id, is_cross=false)
{   
    let element = document.getElementById(id);
    element.innerHTML = (is_cross) ? cross_string : o_string;
    element.classList.remove("notVisited");
}

function ResetBoard()
{
    // Get the selected level
    var level = document.getElementById('DropDownButton').innerText;
    // Send message to the backend to reset the board
    console.log({difficulty:level});
    SendMessageToBackEnd('/restart', {'difficulty': level});

    // Reload the front end
   var element  = document.getElementById("grid");
   var html = '<div class="row">\n';
   for (var i = 1; i < 10; ++i)
   {
       var class_str = 'col notVisited';
       var row = Math.floor((i-1) / 3) + 1; // 1,2,3
       var col = (i-1) % 3 + 1; // 1, 2, 3
       if (col < 3) class_str += ' border-r';
       if (row < 3) class_str += ' border-b';
       html += '<div class = "' + class_str + '" id = "' + i.toString() + '"></div>\n';
       if (col === 3){
           // close the row
           html += '</div>\n';
           if (row == 3) continue;
           html += '<div class="row">\n';
       }
   }
   html += '<br>'
   //console.log(html);
   element.innerHTML = html;
   // Update the turn
   my_turn = true;
}

function HandleGameFinish(response){
    console.log("Gamefinished condition entered!")
    my_turn = false;
    if (response.result === 'BoardFull') {
        alert("Board Is Full! There's a tie!");
    }
    else if (response.result === 'ServerWin') {
        DisplayFinishedBoard(response.win_idx, false);
        alert("Oops. Your opponent has won!");
    }
    else if (response.result === 'YouWin') {
        DisplayFinishedBoard(response.win_idx, true);
        alert("Congratulations, you have won!!");
    }
    else
    {
        alert("Some error has occured!");
    }
}

function DisplayFinishedBoard(win_idx, your_win)
{
    var class_name = your_win ? "youWon " : "opponentWon "; 
    for (let i = 0; i < win_idx.length; ++i)
    {
        var id = win_idx[i];
        var element = document.getElementById(id);
        element.className = class_name + element.className;
    }
}

function InvalidClick(id, currently_my_turn, class_names)
{
    // CHECK FOR INVALID CLICKS
    if (Number.isNaN(id) || id < 1 || id > 9) {
        console.log("No action to perform in these clicks!");
        return true;
    }
    if (!currently_my_turn) {
        console.log("It's the next Player's turn.. You can't click!");
        return true;
    }
    
    if (!class_names.includes("notVisited")) {
        console.log("This box is already clicked.. You can't click again!");
        return true;
    }

    return false;
}

// After a refresh of the window, check the previous state in the backend
document.addEventListener("DOMContentLoaded", (event) => {
    SendMessageToBackEnd('/state', {}).then( (res) =>
    {
        for (let i = 0; i < res.status.length; ++i) {
            Display(res.status[i].id, res.status[i].player === 0);
        }

        if (res.win.result != 'No' && res.win.win_idx.length > 0)
        {
            var your_win = (res.win.result === 'YouWin');
            DisplayFinishedBoard(res.win.win_idx, your_win);
            my_turn = false;
        }
    });
});

// Event Listeners in the front end
$(document).ready(()=> {

    // Click Event in the Grid
    $("#grid").click(function(e) {
        let id = parseInt(e.target.id);
        if (InvalidClick(id, my_turn, e.target.className)) return;

        // Display the Default result in the front end
        Display(id, false);

        // Look for the move from the next player 
        my_turn = false;    

        // Post the input in the backend and then get the move from the other player
        SendMessageToBackEnd('/move', {id: id})
        .then( (response) => {
            if (response.id > 0) 
            {
                // Display the new Move from the server!
                console.log("Response Id = ", response.id);
                Display(response.id, true);
            }

            if (response.gameFinished == true)
            {
                // The game is over! Handle the case!
                HandleGameFinish(response);
                return;
            }
            my_turn = true;
        });

        console.log(`Message Move:${id} sent to the server`);
    });

    $("#restart").click(function(e){
        // Check for the Button press on restart button
        ResetBoard();
    });

    $(".dropdown-item").click(function(){
        var text = $(this).text();
        console.log(text);
        $("#DropDownButton").text(text);
     });


});