This document highlights both the [original description](http://markforster.squarespace.com/autofocus-system/) of the AutoFocus "FVP" algorithm (see "Quick Start") as well as the software architect's breakdown of the formula (see "Technical Manual").

## Quick Start (high level overview)

---

The system consists of one long list of everything that you have to do, written in a ruled notebook (25-35 lines to a page ideal). As you think of new items, add them to the end of the list. You work through the list one page at a time in the following manner:

1. Read quickly through all the items on the page without taking action on any of them.
2. Go through the page more slowly looking at the items in order until one stands out for you.
3. Work on that item for as long as you feel like doing so
4. Cross the item off the list, and re-enter it at the end of the list if you haven’t finished it
5. Continue going round the same page in the same way. Don’t move onto the next page until you complete a pass of the page without any item standing out
6. Move onto the next page and repeat the process
7. If you go to a page and no item stands out for you on your first pass through it, then all the outstanding items on that page are dismissed without re-entering them. (N.B. This does not apply to the final page, on which you are still writing items). Use a highlighter to mark dismissed items.
8. Once you’ve finished with the final page, re-start at the first page that is still active.

***

## Technical Manual (algorithm phases/modes/steps)

1. User starts with no list items in what can be called **"menu mode"**. From here the user can decide to enter into any of the three major modes, or conduct other admin activities such as clearing their list, or changing display options, etc..
2. User enters 1 or more list items. This can be called **"add mode"**. User can enter add mode with no pre-requisite steps.
3. User attempts to enter review mode, which prompts the algorithm to do the **"prep step"**: ~~Dot the first item.~~ If there are no dotted items and there exists a dottable item, the first dottable item is dotted, and this dotted item becomes the "current most want to do" item. [Rules for determining dottable items](###Rules for determining dottable items (used in "prep step")).
4. User actually enters **review mode**. [Rules for entering review mode](###Rules for entering review mode) If there are any undotted items, each item is compared with the "current most want to do" item (here on out we will abbreviate to "CMWTD"), like so: `Do you want to do 'current item' more than 'CMWTD'?`  where answering `no` will skip the current item (making no marks) and answering `yes` will both mark the current item with a dot and also designate it as the new CMWTD. Once the user has reached end of the list OR they are ready to stop reviewing early, they now can leave review mode (return back to menu mode)
5. User enters **focus mode**. [Rules for entering focus mode](###Rules for entering focus mode) In focus mode, the CMWTD (the bottom-most marked item) is considered "in-progress". Once the user has decided to stop working on an item, they cross it off (mark as complete). They are then asked, `Is there work remaining on this task?` If there is remaining work left to be done, they answer `yes` and a new duplicate item is added to the end of the list. If they answer `no` then no change to the list occurs.

### Rules for determining dottable items (used in "prep step")

A dottable item is an unmarked todo item that doesn't occur before any marked items. In other words, if there are dotted items after an undotted item, then the undotted item in question is NOT dottable.

### Rules for entering review mode

There must be 1 or more unmarked items at the end of the list AFTER doing the "prep step". 

### Rules for entering focus mode

There must be 1 or more marked items in order to enter focus mode.

