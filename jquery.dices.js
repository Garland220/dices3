/*
 * Dices3 jQuery
 * Author: Garland Davis
 */
(function($) {
	var rollString;
	var lastRoll;
	var largeRoll;

	function test(){
		$(this).html("test");
	}

	function doRoll( dice, power ){
		if ( !dice || dice.length < 3 ){
			addResult( "Invalid dice roll\n<br />" );
			return false;
		}
		if ( dice.indexOf("+", 0) < 1 && dice.indexOf("-", 0) < 1 )
			dice += "+0";
		lastRoll = roll(dice, power);

		displayRoll( dice, lastRoll );
		return false;
	}

	function percRoll(){
		lastRoll = roll("1d100+0");
		addResult( "Percentage = <strong>"+lastRoll+"%</strong>\n" );
	}

	function displayRoll( dice, result ){
		diceDisplay = dice;
		if ( dice.indexOf("+0", 0) > 0 )
			diceDisplay = dice.substring(0, dice.indexOf("+0", 0));
		var output;

		if ( $("#showall").is(':checked') )
			output = "<em>{0}</em> = <strong>{1}</strong> ({2})\n".format( diceDisplay, result, rollString );
		else
			output = "<em>{0}</em> = <strong>{1}</strong>\n".format( diceDisplay, result );
		addResult( output );
	}

	function roll( dice, power ){
		if ( !power || power < 1 )
			power = 1;
		if ( !dice )
			return 0;

		var start = 0;
		var index = dice.indexOf("d", start);

		if (index < start)
			return 0;

		largeRoll = false;
		var myString = dice.substring(start, index);
		var count = parseInt(myString);
		if ( count > 4 )
			largeRoll = true;

		start = index + 1;
		index = dice.indexOf('+', start);

		var negative = (index < start);

		if (negative)
			index = dice.indexOf('-', start);
		if (index < start)
			index = dice.length;

		if (index == dice.length)
			return 0;

		var myString = dice.substring(start, index);
		var sides = parseInt(myString);
		sides /= power;

		start = index + 1;
		index = dice.length;

		var myString = dice.substring(start, index);
		var bonus = parseInt(myString);
		if (negative)
			bonus *= -1;

		var result = 0;

		var rolls = new Array();
		var temp = "";
		for (var i = 0; i < count; ++i){
			var roll = Math.round(Math.random()*(sides-1))+1;
			if ( $("#multimod").is(':checked') )
				roll += bonus;
			result += roll;
			rolls[i] = roll;
			if ( i == 0 )
				temp = roll;
			else
				temp += " + "+roll;
		}

		if ( $("#droplowest").is(':checked') && $("#dropValue").val() > 0 ){
			result = 0;
			rolls.sort(sortNumber);
			rolls.length -= $("#dropValue").val();
			for (var i = 0; i < rolls.length; ++i){
				var roll = rolls[i];
				result += roll;
				if ( i == 0 )
					temp = roll;
				else
					temp += " + "+roll;
			}
		}

		result *= power;
		if ( !$("#multimod").is(':checked') && bonus > 0 ){
			temp += " + "+bonus;
			result += bonus;
		}
		rollString = temp;

		return result;
	}

	function sortNumber(a,b){
		return b - a;
	}

	function addResult( result ){
		if ($("#results").html().length > 1)
			$("#results").append("<hr />");
		$("#results").append(result);
		$("#results").scrollTop($("#results")[0].scrollHeight);
	}

	$.fn.test = test;
	$.fn.roll = roll;
})( jQuery );