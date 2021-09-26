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

### Minimax Algorithm

Minimax algorithm is a optimization algorithm used in two-people games like tic-tac-toe. Essentially, each player can be designated to a maximizer or a minimizer. Each step made my these players are scored. The maximizer player (or the player that is favoured, or the computer) is supposed to maximize the score of the move. While, the minimizer player is supposed to minimize the score. This algorithm is assuming that the minimizer player plays the optimal game possible. The algorithm works in a recursive manner, where each player scans all the empty spots and does a "trial" from that spot. Then, the next player scans all the empty spots and does a "trial" and so forth. After all the empty spots are done by the first player that did a trial, if the player is a maximizer, it takes the maximum score, else it takes the minimum score.

In Tic-Tac-Toe, the scores are straight-forward - which corresponds to the results of the game. The maximizer can win the game (score of 100), minimizer can win the game (score of -100) or there is a tie (score of 50). In the implementation, I've also encorporated a logic that takes into account how deep we go though the trials. We prefer a smaller traversal. There may be 9 traversals (total ``depth`` of 9) in total, so, the formulation of the score is 
- Maximizer Win : `100 * (10 - depth)`
- Minimizer Win : `-100 * (10 - depth)`
- Tie : `5 * (10-depth)`

Thus, the Maximizer Win can be in the range of (100 to 1000), Minimizer win can be in the range (-100 to -1000) and Tie can be in the range (5 to 50). Thus, these sets will be quite disjoint while making a decision.

## Developer's Information

This implementation is done by Prabhakar Regmi.




