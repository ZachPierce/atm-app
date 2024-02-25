## Questions
- the setup of the credit accounts is a bit confusing since they are all negative, This would usually indicate that the bank actually owes you money like if you returned something or you overpaid your balance. So I wasn't sure exactly sure how to handle that given the rules. For the time being I made it operate as if the negative value is the "available credit" when considering a withdrawl. And for the deposits you can deposit money to get the balance back to 0. This presents some weird functionality though because we don't have a "total credit available" field. 

### Please provide instructions on how to run your project in a bulleted list below.

- In the atm-app directory, run "npm install" then "npm start" that will start a local server that you can access at localhost:3000.
- Then navigate to the "src" folder and run "node server.js" this will start the server that will handle our api requests
- Youll also need to run the command `docker-compose up -d` to start the docker container with the postgres database, by default this will run on port 5432 which is needed for thiss to work

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
- The daily limit is a little funky, there are ways to do it via the front end but all of those solutions will either lose context when the app is refreshed or it would require using the devices local storage which doesn't seem like a super great soution considering potential traffic etc. I think the best way to solve this is to add to the database schema a "last withdrawl" field for each account so you can keep track of this information globally. Curretntly it just doesn't let a user withdrawl the daily limit in one session.
- As mentioned in the questions section, the credit accounts are set up a bit weird so the functionality isn't perfect.
### If you were to continue building this out, what would you like to add next?
- I would like to see more fields added to the database (wasn't sure if that was part of the scope of this challenge), such as customer id, last_withdrawl, and credit limit to  name a few, this would allow for a nice user experience when accessing all their accounts.
- General UI improvements to create a better experience, this was mostly just limited by time
- Better error handling,
- Write more tests, obviously when dealing with money we want this to be bulletproof, so given more time I would like to see this heavily tested
- Supporting different screen sizes/desiging css with more flexibility in mind
- Update UI to display rules in a easy to understand way so the user isn't left guessing how to use the ATM

### If you have any other comments or info you'd like the reviewers to know, please add them below.
- The database needs a bit more information to make this app operate seemlessly, I wasn't sure if that was part of the scope of this project and it limited a few functions but I would love to talk about how I would make that better!
