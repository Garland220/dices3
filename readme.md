Dices3.1
==============

A simple, light, and accurate dice rolling library, for both PHP, and JavaScript.


Javascript
--------------
	dices.roll("1d6+4"); // Rolls 1 dice with 6 sides, and adds a modifier of 4 to the result


PHP
--------------
	$dices = new dices(); // Create a new instance of dices
	$dices->roll("1d6+4"); // Rolls 1 dice with 6 sides, and adds a modifier of 4 to the result

**- OR -**

	dices::app()->roll("1d6+4"); // Rolls 1 dice with 6 sides, and adds a modifier of 4 to the result