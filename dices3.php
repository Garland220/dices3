<?php
/*
 * Dices3
 * Author: Garland Davis
 */
class dices {
	private $version = "3.0.4";

	private static $app = null;

	private $rollHistory = "";
	private $rollString = "";
	private $lastRoll = 0;
	private $rolls = array();

	private $showAll = false;
	private $multiMod = false;
	private $dropLowest = 0;

	public function setShowAll($x) { $this->showAll = $x; }
	public function setMultiMod($x) { $this->multiMod = $x; }
	public function setDropLowest($x) { $this->dropLowest = $x; }

	public function getShowAll() { return $this->showAll; }
	public function getMultiMod() { return $this->multiMod; }
	public function getDropLowest() { return $this->dropLowest; }

	public function app() {
		if (self::$app == null) {
			self::$app = new dices();
		}
		return self::$app;
	}

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

	public function parse($dice) {
		return $this->parseRoll($dice);
	}

	public function getResult($count, $sides, $bonus) {
		$result = array(
			"total" => 0,
			"rolls" => array(),
			"rollString" => ""
		);

		for ($i = 0; $i < $count; ++$i) {
			$r = ceil(lcg_value() * $sides-1)+1;
			if ($this->multiMod) {
				$r += $bonus;
			}

			$result['rolls'][$i] = $r;
		}

		if (!empty($this->dropLowest)) {
			natsort($result['rolls']);

			$result['rolls'] = array_slice(
				$result['rolls'],
				count($result['rolls']) - $this->dropLowest,
				count($result['rolls'])
			);
		}

		for ($i = 0; $i < count($result['rolls']); ++$i) {
			$r = $result['rolls'][$i];
			$result['total'] += $r;

			if ($i == 0) {
				$result['rollString'] = $r;
			}
			else {
				$result['rollString'] .= " + " . $r;
			}
		}

		if (!$this->multiMod && $bonus > 0) {
			$result['rollString'] .= " + " . $bonus;
			$result['total'] += $bonus;
		}

		$this->rollString = $result['rollString'];

		return $result;
	}

	public function roll($dice) {
		if (empty($dice)) {
			return 0;
		}

		$d = $this->parseRoll($dice);
		$r = $this->getResult($d['count'], $d['sides'], $d['bonus']);

		return $r['total'];
	}

	public function r($dice) {
		$this->roll($dice);
	}
}

echo dices::app()->roll("1d6+0");