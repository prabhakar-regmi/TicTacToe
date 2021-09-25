# TicTacToe
A game of TicTacToe implemented with JS and HTML. Tic-Tac-Toe is a 2 player game. The two players are assigned marks `X` or `O`. The players take turns marking the spaces in a 3×3 grid. The player who succeeds in placing three of their marks in a diagonal, horizontal, or vertical row is the winner.

In this implementation, a player can play against a server. The player interacts with the front-end (HTML) and the data gets sent to the backend - i.e. the server. The server-side code (written in NodeJS) then calculates the opposing move and returns back to the grid.

Once either of the player wins, or there's a tie, a message is delivered back.

## Levels
The player can play with the computer at three different levels, by using the drop down provided:

* Easy: The computer performs the moves in a random fashion. No algorithm is at play.

* Medium: The computer performs the moves in a random fashion, unless it detects that there's a move that can either save itself from losing, or a move that can make itself win.

* Hard: The computer uses the Minimax algorithm to determine the best possible move. Thus, the computer will *NEVER* lose! It will either win or tie!

## Code Structure
The code is divided into the front-end and back-end.
### Front End
The front end has the ``index.html`` file with dependencies on ``style.css`` and ``TicTacToe.js``. The responsibility of front-end is purely to let the user interact with the tic-tac-toe board. Once the user clicks the "Restart" button, the game is restarted! Once the user clicks on any of the boxes, it will be sent to the back-end for further processing. Until the backend returns, it flips the switch on the front end such that any other click is not admissible.

## Back End

This is where most of the algorithms reside. ``Board.js`` has a base class for the "easy" version of the implementation. ``DefaultBoard.js`` extends the class for the "medium" version of the level. The ``MinimaxBoard.js`` extends ``DefaultBoard.js`` even further with the Minimax implementation. This project is thus using a basic inheritence principle of OOD.



