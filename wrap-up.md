## Questions

### Please provide instructions on how to run your project in a bulleted list below.

-In the atm-app directory, run "npm start" that will start a local server that you can access at localhost:3000.
-Youll also need to run the command `docker-compose up -d` to start the docker container with the postgres database

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
-The daily limit is a little funky, there are ways to do it via the front end but all of those solutions will either lose 
    context when the app is refreshed or it would require using the devices local storage which doesn't seem like a super great
    soution considering potential traffic. I think the best way to solve this is to add to the database schema a "last withdrawl" field
    for each account so you can keep track of this information globally. 
### If you were to continue building this out, what would you like to add next?
-I would like to see another fields added to the database, such as customer id, this would allow for a nice user experience when 
    accessing their accounts.
-Adding some quick keys for the withdrawl function would be a nice addition (quick cash)
-Supporting different screen sizes/desiging css with more mobile friendly habits
-Update UI to display rules in a easy to understand way so the user isn't left guessing how to use the ATM
### If you have any other comments or info you'd like the reviewers to know, please add them below.