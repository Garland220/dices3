/*
 * Dices3 jQuery
 * Author: Garland Davis
 */
;(function($) {
	dices = function() {
		
	};

	$.extend(dices, {
		data: {
			rollHistory: "",
			rollString: "",
			lastRoll: 0,
			rolls: [],

			version: "0.0.1a"
		},

		config: {
			showAll: false,
			multiMod: false,
			dropLowest: 0
		},

		version: function() {
			return dices.data.version;
		},
		
		config: function(option) {
			
		}
	});
	
	doRoll = function(dice, power) {
		if (!dice || dice.length < 3) {
			addResult( "Invalid dice roll\n<br />" );
			return false;
		}
		if (dice.indexOf("+", 0) < 1 && dice.indexOf("-", 0) < 1) {
			dice += "+0";
		}
		lastRoll = roll(dice, power);

		displayRoll(dice, lastRoll);
		return false;
	}

	percRoll = function() {
		lastRoll = roll("1d100+0");
		addResult("Percentage = <strong>"+lastRoll+"%</strong>\n");
	}

	displayRoll = function(dice, result) {
		diceDisplay = dice;
		if (dice.indexOf("+0", 0) > 0) {
			diceDisplay = dice.substring(0, dice.indexOf("+0", 0));
		}
		var output;

		if (dices.config.showAll) {
			output = "<em>{0}</em> = <strong>{1}</strong> ({2})\n".format(diceDisplay, result, rollString);
		}
		else {
			output = "<em>{0}</em> = <strong>{1}</strong>\n".format(diceDisplay, result);
		}
		addResult(output);
	}

	parseRoll = function(dice) {
		var start, index, negative = 0;
		var roll = {
			count: 0,
			sides: 0,
			bonues: 0
		};

		if (!dice || dice == "") {
			return roll;
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
	}

	roll = function(dice, power) {
		var result = 0;
		var rolls = [];
		var temp = "";

		if (!dice) {
			return 0;
		}
		if (!power || power < 1) {
			power = 1;
		}

		var roll = parseRoll(dice);
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
			rolls.sort(sortNumber);
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
	}

	sortNumber = function(a,b) {
		return b - a;
	}

	addResult = function(result) {
		if ($("#results").html().length > 1){
			$("#results").append("<hr />");
		}
		$("#results").append(result);
		$("#results").scrollTop($("#results")[0].scrollHeight);
	}

	$.fn.roll = roll;
})(jQuery);