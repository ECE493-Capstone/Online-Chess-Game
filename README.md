# ChessEvolved

## Running instructions

1. At the root folder, open two terminals.
2. In terminal 1, run ```cd client/``` to move inside client folder.
3. In terminal 2, run ```cd server/``` to move inside server folder.

### Client Folder (client/)

1. Run ```npm install```.
2. Run ```npm run start```.  
    (a tab should open in your default browser at ```localhost:3000```)

### Server folder (server/)
1. Run ```npm install```.
2. Run ```npm run dev```.  
    (Please double check that server is running on port ```5050```)


### Additional Notes  
- After logging in, cookie will be set in your browser. Thus, all tabs opened from the same browser are treated as the same player.  
- To test the game with multiple players, please open them in different browsers. For example, a game with 4 players (2 players, 2 spectators) can be set up as followed:  
  - Player 1: logged in *edge*
  - Player 2: logged in *edge-incognito*
  - Spectator 1: view game from *chrome-tab1* (not logged in)
  - Spectator 2: view game from *chrome-tab2* (not logged in)