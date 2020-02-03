## End to End Test FVP 1

Reference: http://markforster.squarespace.com/blog/2015/5/21/the-final-version-perfected-fvp.html

For initial list input:

```markdown
Write report
Check email
Tidy desk
```

List item 1 is automatically `marked` because it is the first unactioned item, and also saved as the `current most want to do` item (note: temporarily marked "cmwtd" for "current most want to do") :

```
- Write report [cmwtd]
Check email
Tidy desk
```

User is asked, `Which do you want to do more, 'A: Write report' or 'B: Check email'? a/b`.

User answers `B` which means that the `current most want to do` item now becomes the `Check email` todo item, and it is also now marked.

```markdown
- Write report
- Check email [cmwtd]
Tidy desk
```

User is asked, `Which do you want to do more, 'A: Check email' or 'B: Tidy desk'? a/b`.

The user again answers `B` which shifts the current most want to do item to be the `Tidy desk` todo item.

Lastly, the user is asked, `What do you want to do more than 'Tidy desk', 'A: Nothing' or 'B: Another task'`
