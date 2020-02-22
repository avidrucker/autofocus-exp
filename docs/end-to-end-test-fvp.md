## End to End Tests for Autofocus FVP

Reference: http://markforster.squarespace.com/blog/2015/5/21/the-final-version-perfected-fvp.html

### E2E Test 001: Three Items Example

Create initial list input w/ 3 items:

```markdown
Write report
Check email
Tidy desk
```

Upon entering `Review Mode`, list item 1 is automatically `marked` because it is the first unactioned item, and also saved as the `current most want to do` item.

> Note: temporarily marked "cmwtd" for "current most want to do" ... Also, I'm now considering using the term "benchmark") :

```
- Write report [cmwtd]
Check email
Tidy desk
```

> "Mark this task with a dot to show that it’s now been preselected."

User is now asked, `Do you want to 'Check email' more than 'Write report'? yes/no/quit`.

User answers `y` (for "yes") which means that the `current most want to do` item now becomes the `Check email` todo item, and it is also now marked.

```markdown
- Write report
- Check email [cmwtd]
Tidy desk
```

User is now asked, `Do you want to 'Tidy desk' more than 'Check email'? yes/no/quit`.

The user again answers `y` (for "yes") which shifts the current most want to do item to be the `Tidy desk` todo item.

This ends the review phase, where all items have been reviewed (and in this scenario, coincidentally, also, marked).

```markdown
- Write report
- Check email
- Tidy desk [cmwtd]
```

User now enters "Focus Mode" to start work on current most want to do item `Tidy desk`. Once done working, user marks this item "done".

After this has all transpired, the next "cmwtd" item would become the last marked, uncompleted item (Check email). Another review of all items would happen here, with the starting (first) item to compare with being `Check email`, however, there are no uncompleted items in the list at this point, so no review is required (or even meaningful). Of course, the user *could* clear all their marked items and conduct another review from scratch if they wanted to as well.

### E2E Test 002: A Longer Example

1. Create & add 10 initial tasks:

   ```markdown
   Email
   In-Tray
   Voicemail
   Project X Report
   Tidy Desk
   Call Dissatisfied Customer
   Make Dental Appointment
   File Invoices
   Discuss Project Y with Bob
   Back Up  
   ```

2. Dot first uncompleted item

   ```markdown
   - Email
   ...
   ```

3. Answer `n` ("no") for `Do you want to do X more than email?` until you get to `Voicemail`, then answer `y`:

   ```markdown
   - Email
     In-Tray
   - Voicemail
   ...
   ```

4. Same as #3, until you get to `Tidy Desk`:

   ```markdown
   - Email
     In-Tray
   - Voicemail
     Project X Report
   - Tidy Desk
   ...
   ```

5. Answer `n` for the rest of the items in the list

6. Enter `Focus Mode` to do the `cmwtd` which is `Tidy Desk`. Your list will now look like this:

   > **·** Email
   >   In-Tray
   > **·** Voicemail
   >   Project X Report
   > · ~~Tidy Desk~~
   >   Call Dissatisfied Customer
   >   Make Dental Appointment
   >   File Invoices
   >   Discuss Project Y with Bob
   >   Back Up

7. Enter `Review Mode` and, starting from `Voicemail`, ask yourself, `Do you want to do 'Project X Report' more than 'Voicemail'?` and so on, answering `n` until you get to `Back Up` to which you answer `y`.  Since there are no more items left to review, you then enter `Focus Mode` to work on, and complete, the `cmwtd` which is `Back Up`. The list now reads:

   > **·** Email
   >   In-Tray
   > **·** Voicemail
   >   Project X Report
   > · ~~Tidy Desk~~
   >   Call Dissatisfied Customer
   >   Make Dental Appointment
   >   File Invoices
   >   Discuss Project Y with Bob
   > · ~~Back Up~~

8. Since there are no more items left to review after `Back Up` which you just completed, the next `cmwtd` becomes `Voicemail` which you do, by entering `Focus Mode`. The list now reads:

   > **·** Email
   >   In-Tray
   > · ~~Voicemail~~
   >   Project X Report
   > · ~~Tidy Desk~~
   >   Call Dissatisfied Customer
   >   Make Dental Appointment
   >   File Invoices
   >   Discuss Project Y with Bob
   > · ~~Back Up~~

9. Since the last remaining dotted item is `Email` and there are more todo items after it, we conduct another review, by entering `Review Mode`. We answer `y` to `Make Dental Appointment` and then again `y` to `Discuss Project Y`, then enter `Focus Mode` for `Discuss Project Y`, completing it, and then entering `Focus Mode` again for `Make Dental Appointment`, completing it. The list now reads:

   > **·** Email
   >   In-Tray
   > · ~~Voicemail~~
   >   Project X Report
   > · ~~Tidy Desk~~
   >   Call Dissatisfied Customer
   > · ~~Make Dental Appointment~~
   >   File Invoices
   > · ~~Discuss Project Y with Bob~~
   > · ~~Back Up~~

10. In order of completion, the list can be shown this way as well:

    > **·** Email
    >   In-Tray
    > **·** ~~Voicemail~~ **[3]**
    >   Project X Report
    > **·** ~~Tidy Desk~~ **[1]**
    >   Call Dissatisfied Customer
    > **·** ~~Make Dental Appointment~~ **[5]**
    >   File Invoices
    > **·** ~~Discuss Project Y with Bob~~ **[4]**
    > **·** ~~Back Up~~ **[2]**

