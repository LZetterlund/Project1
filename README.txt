DONE:
1. Properly replace drawers when they leave
2. Properly add the first 2 players to 2 slots, everyone else gets entered as a voter
4. Properly did room implementation
EXTRA - New user system (so users cant easily be randomly assigned same ID)
---------------------------------------------------------------------------------------
TO DO:
3. Change UI depending whether the user is supposed to be a drawer or voter.
5. Add comments to everything
6. Add proper voting

CURRENT IDEA: Start with only option being to enter a room code,
when sent either create that room if new or join it if not.
UI is dynamically created depending on whether the user is player 1, 2 or neither.

BUGS: Lock room number text and hide enter button after pressed
Annoyingly, the window.onunload function only works if the tab is active when closed,
so sometimes the drawings don't clear from disconnected players until a new player connects,
 but they are disconnected anyway.


POSSIBLY: 
Add randomizer for things to draw (only 3 or so)

My site is a game:
Current aim of game, two seperate people draw the same object. 
Other players who join are not told what the object is, and are simply asked
which of the two players drew whatever it was better or more clearly.
On face value players can just try to out draw their opponent, however
other strategies are not disallowed.
This may lead to mind games where some players may purposfully draw the wrong thing
very well to get the votes, while just trying to trick others.

Websockets are used to handle canvas drawing data, room selection and creation, player insertion into proper roles in rooms using a userID,
and voting outcomes.

More time: 
Make game more fluid, add structure.
More game elements, proper good looking UI, etc.
Add additonal methods to clear drawings when players leave if tab is not active, that doesn't require a new player.
