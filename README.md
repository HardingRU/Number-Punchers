# CH_WDI_PROJ1
Project #1

#Technologies used

Javascript, JQuery, CSS, html

#Approach taken

The meat of the game is a matrix that has methods allowing to set and get values of the matrix based on the x and y coordinates.  These are used throughout the code to move players, check collisions, update gameboard values, and check for correct answers.

#Installation instructions
None, really, though it's temporarily hosted on Bitballoon at:
http://amazing-davinci-16ad09.bitballoon.com/

#Challenges / room for improvements

A minor, unimportant, but really annoying problem is that I can't get the characters background color to match the background of the body, even though they have the same RGB....

The most difficult challenge here is around the logic for increasing difficulty.  As currently constructed the board is filled by using a random number generator over some subset of numbers.  For a game that was 'endless' and continued increasing in difficulty, you would need to have an algorithm that ensured for a given target number (find factors of X), that the board had appropriate numbers placed.

My current workaround is that the game only goes to level 10, with two difficulties (level 1-5, level 6-10).  This allows me to specify possible target values:

Factors Level 1 = [15, 20, 30]
Factors Level 2 = [18, 24, 42]
Multiples Level 1 = [2, 3, 4]
Multiples Level 2 = [5, 6, 8]

And then use a random number generator that is specific to each target cohort and ensures with a high degree of confidence that appropriate numbers are placed on the board.

This is an area for expansion and improvement in the future.

Also not really a challenge, but I'd like to style the alerts better in the future.

Lastly, I considered a high score screen at the end, but the game isn't that difficult currently (remember, it's only 10 levels), and so it's not too difficult to reach a perfect score.
