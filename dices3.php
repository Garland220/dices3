<?php
/*
 * Dices3
 * Author: Garland Davis
 */
class dices {
	private $version = "3.0.2";

	private $rollHistory = "";
	private $rollString = "";
	private $lastRoll = 0;
	private $rolls = array();

	private $showAll = false;
	private $multiMod = false;
	private $dropLowest = 0;

	public function version() {
		return $this->version;
	}

	public function parseRoll($dice) {
		$start = $index = $negative = 0;
		$roll = array(
			"count" => 0,
			"sides" => 0,
			"bonues" => 0
		);

		if (empty($dice)) {
			return $roll;
		}

		if (strrpos($dice,"+") === FALSE && strrpos($dice,"-") === FALSE) {
			$dice += "+0";
		}

		$dice = strtolower($dice);
		$index = strrpos($dice,"d");

		if ($index < $start) {
			return $roll;
		}

		$myString = substr($dice, $start, $index);
		$roll['count'] = intval($myString);

		$start = $index + 1;
		$index = strrpos($dice,'+');

		$negative = ($index < $start);

		if ($negative) {
			$index = strrpos($dice,'-');
		}

		if ($index < $start) {
			$index = strlen($dice);
		}

		if ($index == strlen($dice)) {
			return $roll;
		}

		$myString = substr($dice, $start, $index);
		$roll['sides'] = intval($myString);

		$start = $index + 1;
		$index = strlen($dice);

		$myString = substr($dice, $start, $index);
		$roll['bonus'] = intval($myString);

		if ($negative) {
			$roll['bonus'] *= -1;
		}

		return $roll;
	}

	public function roll($dice, $power=1) {
		$result = 0;
		$rolls = array();
		$temp = "";

		if (empty($dice)) {
			return 0;
		}

		if (empty($power) || $power < 1){
			$power = 1;
		}

		$roll = $this->parseRoll($dice);
		$roll['sides'] /= $power;

		for ($i = 0; $i < $roll['count']; ++$i) {
			$r = ceil(lcg_value() * $roll['sides']-1)+1;
			if ($this->multiMod) {
				$r += $roll['bonus'];
			}
			$result += $r;
			if ($i == 0) {
				$temp = $r;
			}
			else {
				$temp .= " + " . $r;
			}
		}

		if ($this->dropLowest) {
			$result = 0;
			natsort($rolls);
		}

		$result *= $power;
		if ($this->multiMod && $roll['bonus'] > 0) {
			$temp .= " + " . $roll['bonus'];
			$result += $roll['bonus'];
		}
		$this->rollString = $temp;

		return $result;
	}
}