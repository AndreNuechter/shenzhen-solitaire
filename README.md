# Shenzhen Solitaire

A variant of the popular card-game, introduced in the fantastic [Shenzhen I/O](http://www.zachtronics.com/shenzhen-io/).

You can play it in the [browser](https://andrenuechter.github.io/shenzhen-solitaire/).

## Rules

Overall there are 40 cards in the game, consisting of three colored suits and a color-less card, called the "flower card".
Each suit consists of 9 valued cards (1 to 9) and 4 value-less cards, called the "dragon cards".

The goal of the game is to sort the cards dealt at the start: the flower card should be moved to its slot in the middle of the top row and the suits should be sorted from 1 to 9 in the three slots on the right side of the top row; the three slots to the left of the top row are for temporarily storing an arbitrary card or all four dragon cards, once they're exposed.
Put another way, the game is won once all eight of the slots on the lower row are empty.

To achieve this you may move the cards around on the lower stacks, where You can stack valued cards in descending order, while alternating colors. You can also temporarily store a single card on an unoccupied dragon slot (one of the three top-left).

When the 1 of a color is exposed, you can move it to one of the three card-slots on the top-right and start collecting that suit there.

Once the flower is exposed, it can be moved to its dedicated slot in the middle of the top-row.

Once all four dragons of a color are exposed, they may be "summoned" by clicking on the respective button. This will move them to one of the available three slots in the top-left, making it unavailable for further card storage.

The game is lost when there are no more moves left.