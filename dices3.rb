
class Dices

  Dice = Struct.new(
    :count,
    :sides,
    :modifier
  )

  Result = Struct.new(
    :rolls,
    :total
  )

  Options = Struct.new(
    :multiMod,    # Add modifier to for each dice rolled, instead of only once.
    :dropLowest,  # Useful for quick character stats generation
    :dropHighest, # I don't know why you'd need this, but here it is anyway!
    :multiplier   # Probably only useful for very specific needs. Multies roll, before adding modifier
  )

  def self.version
    return '3.1.3'
  end


  def self.parseRoll(roll)

    dice = Dice.new(0, 0, 0)

    if roll.empty?
      return dice
    elsif roll.index('d').nil?
      return dice
    else
      arr = roll.split('d')

      dice.count = arr[0].to_i

      if not arr[1].index('+').nil?
        arr2 = arr[1].split('+')
        dice.sides = arr2[0].to_i
        dice.modifier = arr2[1].to_i
      elsif not arr[1].index('-').nil?
        arr2 = arr[1].split('-')
        dice.sides = arr2[0].to_i
        dice.modifier = arr2[1].to_i
      else
        dice.sides = arr[1].to_i
      end

    end

    return dice

  end


  def self.roll(dice, options = {})
    result = Result.new([], 0)

    if dice.empty?
      return result
    elsif dice.is_a? String
      dice = Dices.parseRoll(dice)
    elsif not dice.is_a? Dice
      return result
    end

    for i in 1..dice.count
      rolled = (rand * dice.sides - 1).ceil + 1;

      if options.include? 'multiMod'
        rolled += dice.modifier
      end

      result.rolls.push(rolled)
    end

    result.rolls.each { |x|
      result.total += x
    }

    if not options.include? 'multiMod'
      result.total += dice.modifier
    end

    return result

  end

end

#puts Dices.roll('3d6+1', {})
