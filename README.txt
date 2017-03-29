DONE:
1. Properly replace drawers when they leave

2. Properly add the first 2 players to 2 slots, everyone else gets entered as a voter

4. Properly did room implementation

EXTRA - New user system (so users cant easily be randomly assigned same ID)

---------------------------------------------------------------------------------------

TO DO:
3. Change UI depending whether the user is supposed to be a drawer or voter.

 (REMOVE THE OBJECT NAME FOR VOTERS)
5. Add comments to everything

CURRENT IDEA: Start with only option being to enter a room code,

when sent either create that room if new or join it if not.

UI is dynamically created depending on whether the user is player 1, 2 or neither.



BUGS: Annoyingly, the window.onunload function only works if the tab is active when closed,

so sometimes the drawings don't clear from disconnected players until a new player connects,

 but they are disconnected anyway.

Possibly bugs when entering undefined rooms



My site is a game:

Every user can join a room of their choice, either with friends or alone.
 The first two that join are placed as drawers, the rest as voters. 
Drawers can be shuffled around simply by one leave and someone else taking their place.
Current aim of game, two drawers draw the same object.
 
Other players who join are not told what the object is, and are simply asked

which of the two players drew whatever it was better or more clearly.

On face value players can just try to out draw their opponent, however
 other strategies are not disallowed.

This may lead to mind games where some players may purposfully draw the wrong thing

very well to trick others into voting for you.



Websockets are used to handle canvas drawing data, room selection and creation, player insertion into proper roles in rooms using a userID,

and voting outcomes.

What went right: 
All of the functionality works properly, with users being able to join and leave servers at their will.
I am especially happy with how specific rooms can be joined in order to play with friends.

What went wrong:
The polish of a good looking game took a backseat to ensure proper structure and well-working systems.
Also, I spent a long while trying to pass data from the client to the server through emitting a "disconnect" function,
 only to find out that the reason it wasn't working was that the data was being replaced by "transport close" everytime the
function got called. Took me way too long to figure that out.
On top of this I could not get a clean wipe of the player's canvas when they were went to leave because chrome does not support 
.onclose, .onunload, or .onbeforeunload unless the tab is currently in focus. So I had to find some work arounds that don't work as well.
I was not able to properly implement voting into the game, thus the buttons are just for show, the real winner would have to be decided verbally with friends.
 



More time: 
Make game more fluid, add structure.

Playtests, proper good looking UI, more game elements, etc.

Add additonal methods to clear drawings when players leave if tab is not active, that doesn't require a new player.


I went above and beyond by creating a room structure that can be navigated simply by entering your own server name and sharing that name with your friends.
 As well as properly adding differing UI's and functionality that change depending on whether the player is a voter or drawer.