<?php

/*
 * Dices3.1
 */
class dices {

	private static $version = '3.1.3';


	/**
	 * Parses a dice string (e.g '1d6') into an array
	 *
	 * @param  {string}
	 * @return {array} return an array containing count, sides, and modifier values
	 */
	public static function parseRoll($roll) {

		$dice = array(
			'count' => 0,
			'sides' => 0,
			'modifier' => 0
		);
		$array = array();

		if (empty($roll)) {
			return $dice;
		}
		else if (stripos($roll, 'd') === -1) {
			return $dice;
		}
		else {
			$array = explode('d', $roll);

			$dice['count'] = (int)$array[0];

			if ($array[1]) {

				if (strrpos($array[1], '+') !== false) {
					$array = explode('+', $array[1]);
					$dice['modifier'] = (int)$array[1];
				}
				else if (strrpos($array[1], '-') !== false) {
					$array = explode('-', $array[1]);
					$dice['modifier'] = (int)$array[1] * -1;
				}
				else {
					$array[0] = (int)$array[1];
				}

				$dice['sides'] = $array[0];
			}
		}

		return $dice;

	}


	/**
	 * Rolls the dice, and handles the result based on optional parameters, then returns the result array
	 *
	 * @param  {array} dice     The dice to be rolled, if string, calls parseDice.
	 * @param  {array} options  An array containing optional parameter overrides.
	 * @return {array}          A array containing all of the roll results, as well as the total.
	 */
	public static function roll($dice, $options = array()) {

		$result = array(
			'rolls' => array(),
			'total' => 0,
		);
		$parsedDice;

		$options = array_merge(array(
			'multiMod' 	  =>  false, // Add modifier to for each dice rolled, instead of only once.
			'dropLowest'  =>  0,     // Useful for quick character stats generation
			'dropHighest' =>  0,     // I don't know why you'd need this, but here it is anyway!
			'multiplier'  =>  1      // Probably only useful for very specific needs. Multies roll, before adding modifier
		), $options);

		if (empty($dice)) {
			return $result;
		}
		else if (is_string($dice)) {
			$parsedDice = self::parseRoll($dice);
		}
		else if (is_array($dice)) {
			$parsedDice = $dice;
		}
		else {
			return $result;
		}

		$count = (int)$parsedDice['count'];
		for ($i = 0; $i < $count; ++$i) {
			$rolled = ceil(lcg_value() * $parsedDice['sides'] - 1) + 1;
			$rolled = $rolled * $options['multiplier'];

			if ($options['multiMod']) {
				$rolled += $parsedDice['modifier'];
			}

			$result['rolls'][$i] = $rolled;
		}


		if (!empty($options['dropLowest'])) {

			natsort($result['rolls']);

			$result['rolls'] = array_slice(
				$result['rolls'],
				count($result['rolls']) - $options['dropLowest'],
				count($result['rolls'])
			);

		}


		if (!empty($options['dropHighest'])) {

			self::rnatsort($result['rolls']);

			$result['rolls'] = array_slice(
				$result['rolls'],
				count($result['rolls']) - $options['dropHighest'],
				count($result['rolls'])
			);

		}


		$count = (int)count($result['rolls']);
		for ($i = 0; $i < $count; ++$i) {

			$result['total'] += $result['rolls'][$i];

		}


		if (!$options['multiMod']) {
			$result['total'] += $parsedDice['modifier'];
		}


		return $result;

	}


	/**
	 * Prevent construction, should always be treated as static
	 */
	private function __construct() {}


	/**
	 * Reverse Natural Sorts the array.
	 *
	 * @param  [array] $arr Takes an array
	 * @return [array]      Returns same array, reverse natural sorted
	 */
	public static function rnatsort(&$array){

		natsort($array);

		$array = array_reverse($arr, true);

	}


	public static function version() {

		return self::$version;

	}

}
