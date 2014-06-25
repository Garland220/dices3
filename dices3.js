/*
 * Dices 3.1
 */
(function() {
  'use strict';


  window.dices = {

    Version: '3.1.2',


    /**
     * Parses a dice string into an object
     * 
     * @param  {string} dice string to be parsed (e.g '1d6')
     * @return {object} return an object containing count, sides, and modifier values
     */
    parseRoll: function(roll) {

      /** @private */
      var dice = {
            count: 0,
            sides: 0,
            modifier: 0
          },
          indexAt = -1,
          i = 0,
          l = 0;

      for (i=0, l=roll.length; i < l; i++) {
        if (roll.charCodeAt(i) === 100 || roll.charCodeAt(i) === 68) {
          indexAt = i;
          break;
        }
      }

      if (indexAt === -1) {
        return dice;
      }
      else {

        dice.count = parseInt(roll.substring(0, indexAt), 10);

        for (i=0, l=roll.length; i < l; i++) {
          if (roll.charCodeAt(i) === 43) {
            dice.sides = parseInt(roll.substring(indexAt+1, i), 10);
            indexAt = i;
            dice.modifier = parseInt(roll.substring(indexAt+1, l), 10);
            break;
          }
          else if (roll.charCodeAt(i) === 45) {
            dice.sides = parseInt(roll.substring(indexAt+1, i), 10);
            indexAt = i;
            dice.modifier = parseInt(roll.substring(indexAt+1, l), 10) * -1;
            break;
          }
        }

        if (!dice.sides) {
          dice.sides = parseInt(roll.substring(indexAt+1, roll.length), 10);
        }
      }

      return dice;

    },


    /**
     * Rolls the dice, and handles the result based on optional parameters, then returns the result object
     * 
     * @param  {object} dice     The dice to be rolled, if string, calls parseDice.
     * @param  {object} options  An object containing optional parameter overrides.
     * @return {object}          A object containing all of the roll results, as well as the total.
     */
    roll: function(dice, options) {

      /** @private */
      var rolled = 0,
          total = 0,
          rolls = [],
          parsedDice = {},
          i = 0,
          l = 0;

      options = this.extend({
        multiMod    :  false, // Add modifier to for each dice rolled, instead of only once.
        dropLowest  :  0,     // Useful for quick character stats generation
        dropHighest :  0,     // I don't know why you'd need this, but here it is anyway!
        multiplier  :  1      // Probably only useful for very specific needs. Multies roll, before adding modifier
      }, options);


      if (!dice) {
        return 0;
      }
      else if (typeof dice === 'string') {
        parsedDice = this.parseRoll(dice);
      }
      else if (typeof dice === 'object' && this.isInt(dice.count) && this.isInt(dice.sides)) {
        parsedDice = dice;
      }
      else {
        return 0;
      }

      for (i = 0, l = parsedDice.count; i < l; ++i) {

        rolled = Math.round(Math.random() * (parsedDice.sides - 1)) + 1;
        rolled = rolled * options.multiplier;

        if (options.multiMod) {
          rolled += parsedDice.modifier;
        }

        rolls.push(rolled);

      }


      // TODO: Re-sort array back to original state, instead of leaving it sorted by value
      if (this.isInt(options.dropLowest) && options.dropLowest > 0) {

        rolls.sort(this.highSort);
        rolls.length -= options.dropLowest;

      }
      if (this.isInt(options.dropHighest) && options.dropLowest > 0) {

        rolls.sort(this.lowSort);
        rolls.length -= options.dropHighest;

      }


      for (i = 0, l = rolls.length; i < l; ++i) {

        total += rolls[i];

      }

      if (!options.multiMod) {
        total += parsedDice.modifier;
      }

      return {
        rolls: rolls,
        total: total
      };

    },


    /**
     * Overrides values of one object with the values of another.
     */
    extend: function(a, b) {

      for(var key in b) {

        if(b.hasOwnProperty(key)) {
          a[key] = b[key];
        }

      }

      return a;

    },


    /**
     * Sorts from highest to lowest.
     */
    highSort: function(a, b) {

      return b - a;

    },


    /**
     * Sorts from lowest to highest.
     */
    lowSort: function(a, b) {

      return a - b;

    },


    /**
     * Returns true if parameter is integer.
     */
    isInt: function(n) {

      return n === parseInt(n, 10);

    },


    version: function() {

      return this.Version;

    },


  };


})();

