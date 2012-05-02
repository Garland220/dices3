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

			version: "3.0.4"
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

		parse: function(dice) {
			return parseRoll(dice);
		},

		getResult: function(count, sides, bonus) {
			var result = {
				total: 0,
				rolls: [],
				rollString: ""
			};

			if (count == 0 || sides == 0) {
				return result;
			}

			for (i = 0; i < count; ++i) {
				r = Math.round(Math.random()*(sides-1))+1;
				if (dices.config.multiMod) {
					r += bonus;
				}

				result.rolls[i] = r;
			}

			if (dices.config.dropLowest > 0) {
				result.total = 0;

				result.rolls.sort(dices.sortNumber);
				result.rolls.length -= dices.config.dropLowest;
			}

			for (i = 0; i < result.rolls.length; ++i) {
				r = result.rolls[i];
				result.total += r;

				if (i != 0) { result.rollString += " + "+r; }
				else{ result.rollString = r; }
			}

			if (!dices.config.multiMod && bonus > 0) {
				result.rollString += " + "+bonus;
				result.total += bonus;
			}

			return result
		},

		roll: function(dice) {
			if (!dice) {
				return 0;
			}

			var d = dices.parseRoll(dice);
			var r = dices.getResult(d.count, d.sides, d.bonus);

			return r.total;
		},

		r: function(dice, power) {
			return dices.roll(dice, power);
		},
		
		sortNumber: function(a,b) {
			return b - a;
		}
	};
})();