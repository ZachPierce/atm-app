## Questions

### Please provide instructions on how to run your project in a bulleted list below.

-In the atm-app directory, run "npm install" then "npm start" that will start a local server that you can access at localhost:3000.
-Then navigate to the "src" folder and run "node server.js" this will start the server that will handle our api requests
-Youll also need to run the command `docker-compose up -d` to start the docker container with the postgres database, by default this will run on port 5432 which is needed for thiss to work

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
-The daily limit is a little funky, there are ways to do it via the front end but all of those solutions will either lose 
    context when the app is refreshed or it would require using the devices local storage which doesn't seem like a super great
    soution considering potential traffic etc. I think the best way to solve this is to add to the database schema a "last withdrawl" field
    for each account so you can keep track of this information globally. 
### If you were to continue building this out, what would you like to add next?
-I would like to see another fields added to the database, such as customer id, this would allow for a nice user experience when 
    accessing all their accounts.
-Adding some quick keys for the withdrawl function would be a nice addition (quick cash)
-General UI improvements to create a better experience, this was mostly just limited by my time
-Better error handling, again time limited this
-Write more tests, obviously when dealing with money we want this to be bulletproof, so given more time I would like to see this 
heavily tested
-Supporting different screen sizes/desiging css with more flexibility in mind
-Update UI to display rules in a easy to understand way so the user isn't left guessing how to use the ATM
### If you have any other comments or info you'd like the reviewers to know, please add them below.