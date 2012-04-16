/*
 * Dices3
 * Author: Garland Davis
 */
;(function() {
	dices = {
		data: {
			rollHistory: "",
			rollString: "",
			lastRoll: 0,
			rolls: [],

			version: "3.0.2"
		},

		config: {
			showAll: false,
			multiMod: false,
			dropLowest: 0
		},

		version: function() {
			return dices.data.version;
		},
		
		parseRoll: function(dice) {
			var start, index, negative = 0;
			var roll = {
				count: 0,
				sides: 0,
				bonues: 0
			};

			if (!dice || dice == "") {
				return roll;
			}

			if (dice.indexOf("+", 0) < 1 && dice.indexOf("-", 0) < 1) {
				dice += "+0";
			}

			dice = dice.toLowerCase();
			index = dice.indexOf("d", start);

			if (index < start) {
				return roll;
			}

			var myString = dice.substring(start, index);
			roll.count = parseInt(myString);

			start = index + 1;
			index = dice.indexOf('+', start);

			negative = (index < start);

			if (negative) {
				index = dice.indexOf('-', start);
			}

			if (index < start) {
				index = dice.length;
			}

			if (index == dice.length) {
				return roll;
			}

			myString = dice.substring(start, index);
			roll.sides = parseInt(myString);

			start = index + 1;
			index = dice.length;

			myString = dice.substring(start, index);
			roll.bonus = parseInt(myString);

			if (negative) {
				roll.bonus *= -1;
			}

			return roll;
		},

		roll: function(dice, power) {
			var result = 0;
			var rolls = [];
			var temp = "";

			if (!dice) {
				return 0;
			}
			if (!power || power < 1) {
				power = 1;
			}

			var roll = dices.parseRoll(dice);
			roll.sides /= power;

			for (var i = 0; i < roll.count; ++i) {
				r = Math.round(Math.random()*(roll.sides-1))+1;
				if (dices.config.multiMod) {
					r += bonus;
				}
				result += r;
				//roll.rolls[i] = r;
				if (i == 0) {
					temp = r;
				}
				else {
					temp += " + "+r;
				}
			}

			if (dices.config.dropLowest > 0) {
				result = 0;
				rolls.sort(dices.sortNumber);
				rolls.length -= D.config.dropLowest;
				for (i = 0; i < rolls.length; ++i){
					r = rolls[i];
					result += r;
					if ( i == 0 ){
						temp = r;
					}
					else{
						temp += " + "+r;
					}
				}
			}

			result *= power;
			if (dices.config.multiMod && bonus > 0) {
				temp += " + "+bonus;
				result += bonus;
			}
			dices.data.rollString = temp;

			return result;
		},
		
		sortNumber: function(a,b) {
			return b - a;
		}
	};
})();