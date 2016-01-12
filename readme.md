Dices3.1
==============

A simple, light, and flexible dice rolling library, JavaScript, Ruby, or PHP.


Javascript
--------------

	dices.roll('1d6+4'); // Rolls 1 dice with 6 sides, and adds a modifier of 4 to the result

**With options**

	dices.roll('4d6', {dropLowest: 1}); // Will roll 4 dice with 6 sides, and drop the lowest one from the result.


Ruby
--------------

	Dices.roll('1d6+4') // Rolls 1 dice with 6 sides, and adds a modifier of 4 to the result

**With options**

	Dices.roll('4d6', {}) // Will roll 4 dice with 6 sides, and drop the lowest one from the result.


PHP
--------------

	dices::roll('1d6+4'); // Rolls 1 dice with 6 sides, and adds a modifier of 4 to the result

**With options**

	dices::roll('4d6', array('dropLowest' => 1)); // Will roll 4 dice with 6 sides, and drop the lowest one from the result.



Options
--------------

	multiMod  (Default: false)  - Add modifier to for each dice rolled, instead of only once.

	dropLowest  (Default: 0)    - Useful for quick character stats generation

	dropHighest (Default: 0)    - I don't know why you'd need this, but here it is anyway!

	multiplier  (Default: 1)    - Probably only useful for very specific needs. Multies roll, before adding modifier
