# learning about rcv requirements

As a user, I want to understand what RCV is.

I want to visualize votes being 'reused' when a majority has not been reached and votes for the lowest scoring candidate being 'converted' to the second choice for each vote. Visually, this would look like colored segments of a bar graph being consolidated into other candidates' bars to show vote-reuse.

I want to be able to try out different scenarios so I can test my understanding of the algorithm.

I want to see various preset scenarios that illustrate edge cases or key concepts of RCV, like:

- base case, multiple rounds because a majority is not reached in the initial round
- a majority must be reached if voters must rank all candidates
- a majority may not be reached (instead, a plurality is reached) if voters do not rank all candidates
- a tie may be reached
