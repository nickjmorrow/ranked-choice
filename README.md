# ranked-choice

CircleCI
[![nickjmorrow](https://circleci.com/gh/nickjmorrow/ranked-choice.svg?style=svg)](https://circleci.com/gh/nickjmorrow/ranked-choice)

Create, vote, and simulate polls that use the ranked choice voting algorithm.

~The demo can be found [here](https://ranked-choice.netlify.app).~

EDIT: I've stopped paying for the database for this, but if you want to check out just the (broken) frontend, you still can at the link above :) 

## At a Glance

I tried finding an easy site that lets you vote on polls using ranked choice voting, but couldn't find any. This is that site.

Create polls in which voters can select none or many of the available options and order their options in terms of priority. This lets you pick choices that might not win while still ensuring that your vote is counted.

## How to Run

This application is comprised of a backend Node.js app and a frontend React.js app. The backend references a PostgreSQL database and will apply any unapplied migrations upon connection.

To start the Node.js app and PostgreSQL database inside separate containers from the project root:

```
cd server && docker-compose up
```

To start the frontend application from the project root:

```
cd client && npm run dev
```

## Purpose / Future

I really wanted a simple, standalone app to let me do fundamental poll-related user flows (creation, voting, results viewing). But there's so much more that could be done here:

- animate the ranked choice algorithm to make it more apparent how votes are "reused" across "rounds"
- allow for more structured voting rules, e.g. prevent people from voting twice, only allow certain people to vote
- allow for more configurable poll voting options, e.g. mark questions as required

This project will likely stay as just a simple demo and will not evolve to fulfill the use cases above. Please feel free to fork it.

## Technical Stack

- The **front-end** uses React.js and TypeScript. I work mainly with React and enjoy thinking in components. TypeScript for static type-checking and making it easier to scale code without needing to remember what props go to which component.
- The **back-end** is built with Node.js (using Nest.js framework) with TypeScript. This was my first project using Nest.js and I absolutely love it. The imposition of structure, reasonable opinions, and easy scaffolding have made it a joy to work with.
- The **database** is Postgres. I wanted something relational because polls, questions, and options all have distinct schemas and relationships. Out of various SQL databases, I chose Postgres because the provider (ElephantSQL) is easy to work with for small projects.
- The **deployment tool** is CircleCI. This was my first project using CircleCI (transitioning from TravisCI) and, after hammering out the `config.yml`, it was a complete joy.

## Callouts

- I really like the "reorder voted-upon options within a question to denote higher priority" poll-voting UI that uses drag-and-drop. It just feels natural.
- I'm particularly happy with how each "module" is separate (simulation, poll creation, poll voting, poll results viewing) but uses the same interfaces and data structures where possible. It feels like a good mix of designing shared abstractions while not over-genericizing those abstractions.

## Tracking

The Trello baord for this project can be found [here](https://trello.com/b/47ZNlgx3/ranked-choice).
