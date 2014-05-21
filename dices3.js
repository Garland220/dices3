/*
 * Dices 3.1
 */
(function() {
  'use strict';


  window.dices = {


    /**
     * Parses a dice string (e.g '1d6') into an object
     * 
     * @param  {string} 
     * @return {object} return an object containing count, sides, and modifier values
     */
    parseRoll: function(roll) {

      /** @private */
      var dice = {},
          arr;

      roll = roll.toLowerCase();

      if (roll.indexOf('d') === -1) {
        return 0;
      }
      else {

        arr = roll.split('d');

        dice.count = parseInt(arr[0], 10);

        if (arr[1]) {
          if (arr[1].indexOf('+') !== -1) {
            arr = arr[1].split('+');
            dice.modifier = parseInt(arr[1], 10);
          }
          else if (arr[1].indexOf('-') !== -1) {
            arr = arr[1].split('-');
            dice.modifier = parseInt(arr[1], 10) * -1;
          }
          else {
            arr[0] = arr[1];
            dice.modifier = 0;
          }
          dice.sides = parseInt(arr[0], 10);
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
          parsedDice,
          i;

      this.roll.history = this.roll.history || [];

      options = this.extend({
        multiMod    :  false, // Add modifier to for each dice rolled, instead of only once.
        dropLowest  :  0,     // Useful for quick character stats generation
        dropHighest :  0,     // I don't know why you'd need this, but here it is anyway!
        multiplier  :  1      // Probably only useful for very specific needs
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

      for (i = 0; i < parsedDice.count; ++i) {

        rolled = Math.round(Math.random() * (parsedDice.sides - 1)) + 1;

        if (options.multiMod) {
          rolled += parsedDice.modifier;
        }

        rolls.push(rolled);
        this.roll.history.push(rolled);

      }


      if (this.isInt(options.dropLowest)) {

        rolls.sort(this.highSort);
        rolls.length -= options.dropLowest;

      }
      if (this.isInt(options.dropHighest)) {

        rolls.sort(this.lowSort);
        rolls.length -= options.dropHighest;

      }


      for (i = 0; i < rolls.length; ++i) {

        total += rolls[i];

      }

      total = total * options.multiplier;

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

      return '3.1.0';

    },


  };


})();
