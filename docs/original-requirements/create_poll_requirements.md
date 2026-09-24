# create poll requirements

As a user, I want to be able to create polls so that people may vote on some question. Each poll contains 'options' (like candidates). A vote is comprised of a voterId (who is making the vote?) and a list of choices. Each choice has an 'orderId' and 'optionId'.

## Sharing

I want to be able to share my poll via a link because that is most convenient.

## Voter Authentication

Sometimes, I want to create a 'simple' poll to quickly gather feedback.

I also want the option to create a 'secure' poll where I can be confident that:

- I can enforce exactly who is allowed to vote
- Voters can only vote once

In the secure poll, voters should be provided a token. When voting, a voter must submit that token to authenticate their vote.

In simple polls, voters may optionally provide a name.

[Not Sure]
As a user, I want to be able to update my vote after it has been cast. For secure polls, I need only to provide my token. For simple polls, I (1) am required to be logged in while casting my vote to allow for it to be later updated, or (2) I am provided an updateToken after vote submission that allows me to update my vote. Leaning towards 1 as it feels too easy for people to lose the updateToken or not notice it after casting a vote.

## Poll Creation Input

On creating a poll, a creator must provide the following:

- title of the poll (e.g. 'Lynn County General Election')
- optional description for any additional information
- ordered list of questions, each of which contains
  - a content (e.g. 'For Secretary of State')
  - an optional description (e.g. 'Choose no more than 1.')
  - a boolean flag, isRequired
  - a list of ordered options, each of which contains
    - a label (e.g. 'Rod Plum')
    - an optional description (e.g. 'Republican Party')

In an additional feature, option ordering will be varied across voters to prevent bias.

## Voter Input

Given a link, a voter is directed to a page.

They can see the name of the poll, description of the poll, and the list of questions.

For each question, they can see:

- question content
- question description
- whether the question is required
- the list of options
  - the label and description for each option

Design goals:

- It's easy for users to see all options available
- Easy to rank all the options that the user wants to rank (cannot assume user will rank every option)
- Easy to update ranking, or remove option from list of rankings

All options initially have some design to show they are unranked (gray? lower opacity?). When a user clicks an option, it is moved to be the next-highest rank in the user's list of already-ranked options (e.g. if the user has ranked 3 options, the clicked option becomes rank 4. If no options have been ranked so far, it becomes rank 1).

When a user hovers over an unranked option, a rank appears near the option to show what rank the option would have if it were clicked. This lets the user know the control is interactive.

Ranked options have some 'remove' button. If a user clicks it, the option is put back into the list of unranked options. The ordering of unranked options is maintained (e.g. if I rank the 5th option, then unrank it, it is put back in the 5th index).

They may optionally specify their name.

There is a submit button.
