# Using the Slack Bot

## /register

**Run this first!**

Use this command to add your Slack ID to the database. Afterwards, you must be approved
in the client program before you can start using the other commands.

## /clockin

Use this command to signal that you have started working for a customer.
Without any arguments, the bot will assume you have started working when you
sent the command, and you will be prompted to select a customer.

Arguments:
* time (optional)
    * Explicitly state the time you started working for a customer
    * Can be a time in the future, to say you will start working for a customer
    * See time section for acceptable inputs
* customer (optional)
    * State the customer you are working for
    * If used, you will not be asked to select a customer
    * This can be either the full name of the customer, or a nickname established
    in the client program
    * Not case sensitive
    * Ex: Apple, APL, apl

Both arguments do not have to be given, but if both are given, they **must** be given
in the above order.

After selecting a customer (if not given in command), a reply will be sent with 
two buttons:
* Clock Out: Signal that you have stopped working with the customer
* Cancel Clockin: Delete this session from the database (aka undo)

## /clockintt

Same as /clockout (above), but will automatically add travel time to the job. This is
used the same way as /clockin.

## /clockout

Use this command to signal that you have stopped working for a customer.
Without any arguments, the bot will assume you stopped working when you sent the command.

Arguments:
* time (optional)
    * Explicitly state the time you stopped working for a customer
    * Can be a time in the future, but cannot be a time that precedes when you
    started working
    * See time section for acceptable inputs
* customer (optional)
    * State the customer you are working for
    * If used, you will not be asked to select a customer
    * This can be either the full name of the customer, or a nickname established
    in the client program
    * Not case sensitive
    * Ex: Apple, APL, apl

Using the Clock Out button in the reply of the /clockin command is equivalent to running
this command with no time argument.

This will reply with information about your session. There will also be a button to undo
and delete the logged hours.

## /nicknames

Lists all the nicknames for a customer. Send the command, then select the customer from the
drop down.

## time arguments

There are many different ways to explicitly give a time to the bot:

* 000, 00000, 0:00, 00:00, 12:00am are all equivalent
* 100, 0100, 1:00, 1:00am, 100a are all equivalent
* 1200, 1200pm, 1200p are all equivalent

Note that the M in AM/PM is not necessary, nor is the case of AM/PM. 
If you do not specify AM or PM, the bot will assume the same 12-hour section as when
the command was sent.
Also note that even though 0:00am is technically not a valid time stamp, it will still be
accepted as being equivalent to 00:00.
