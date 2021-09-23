var cross = true;
const cross_string = "\u274C";
const o_string = "\u25EF";
var visited = new Set();

document.onclick = e => {
    let id = parseInt(e.target.id);
    let class_names = e.target.className.split(" ");

    // Check for invalid clicks 
    if (
        Number.isNaN(id) || id < 1 || id > 9 ||  // check if Id is correct
        class_names.find(a=> a === "col") === undefined // check if the click location is correct
        ) 
    {
        return;
    }
    let element = document.getElementById(id);
    element.innerHTML = (cross) ? cross_string : o_string;
    element.className = e.target.className.replace("col", "col-visited");
    cross = !cross;

    // Look for the move from the next player 
    // This may be the computer - or something from the computer
    // The action here is to send this move to the server and wait for the response
    //// TO DO


    // Check the number of cells filled
    visited.add(id);
    if (visited.size === 9) alert('Board is Full');
} 
