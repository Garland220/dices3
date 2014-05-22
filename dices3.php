<?php

/*
 * Dices3.1
 */
class dices {

	private static $version = '3.1.0';

	/**
     * Parses a dice string (e.g '1d6') into an array
     * 
     * @param  {string} 
     * @return {array} return an array containing count, sides, and modifier values
     */
	public function parseRoll($roll) {

		$dice = array(
			'count' => 0,
			'sides' => 0,
			'modifier' => 0
		);
		$arr = array();
		$roll = strtolower($roll);

		if (empty($roll)) {
			return $dice;
		}
		else if (strrpos($roll, 'd') === -1) {
			return $dice;
		}
		else {
			$arr = split('d', $roll);

			$dice['count'] = intval($roll[0], 10);

			if ($arr[1]) {
				if (strrpos($arr[1], '+')) {
					$arr = split($arr[1], '+');
					$dice['modifier'] = intval($arr[1], 10);
				}
				else if (strrpos($arr[1], '-')) {
					$arr = split($arr[1], '-');
					$dice['modifier'] = intval($arr[1], 10) * -1;
				}
				else {
					$arr[0] = intval($arr[1], 10);
				}

				$dice['sides'] = $arr[0];
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
	public function roll($dice, $options = array()) {

		$result = array(
			'rolls' => array(),
			'total' => 0,
		);	
		$parsedDice;

		$options = array_merge(array(
			'multiMod' 	  =>  false, // Add modifier to for each dice rolled, instead of only once.
			'dropLowest'  =>  0,     // Useful for quick character stats generation
	        'dropHighest' =>  0,     // I don't know why you'd need this, but here it is anyway!
	        'multiplier'  =>  1      // Probably only useful for very specific needs
		), $options);

		if (empty($dice)) {
			echo 'empty';
			return $result;
		}
		else if (is_string($dice)) {
			$parsedDice = self::parseRoll($dice);
		}
		else if (is_array($dice)) {
			$parsedDice = $dice;
		}
		else {
			echo 'test';
			return $result;
		}

		echo $options['multiplier'];

		for ($i = 0; $i < $parsedDice['count']; ++$i) {
			$rolled = ceil(lcg_value() * $parsedDice['sides'] - 1) + 1;
			$rolled = $rolled * $options['multiplier'];

			if ($options['multiMod']) {
				$rolled += $parsedDice['modifier'];
			}

			echo $rolled . " | ";

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


		for ($i = 0; $i < count($result['rolls']); ++$i) {

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
	public function rnatsort(&$arr){

	    natsort($arr);

	    $arr = array_reverse($arr, true);

	}


	public function version() {
		return self::$version;
	}

}
