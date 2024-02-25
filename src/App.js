import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
 
  //all of our state values managed here
  //account details first
  var [accountNumber, setAccountNumber] = useState(null);
  var [accountName, setAccountName] = useState("")
  var [accountBalance, setAccountBalance] = useState(0)
  var [accountType, setAccountType] = useState("")
  var [step, setStep] = useState("enter-account");
  var [errorMessage, setErrorMessage] = useState("")
  var [totalWithdrawnToday, setTotalWithdrawnToday] = useState(0)
  var [customerName, setCustomerName] = useState("")
  var [actionType, setActionType] = useState("") //this is used for checkbalance, withdrawl and deposit

  useEffect(() => {
    fetchData();
  }, []);

  //function to hit our server using axios to get our data from postgres for a given account id
  //this returns a boolean so that we know weather to procced or to stop because of an error
  var fetchData = async (id) => {
    //ensure there is a valid id
      if (id !== "" && id) {
        try {
          //hit our api endpoint to get postgres data
          const response = await axios.get(`http://localhost:3001/api/data/${id}`);
          if (!response.data.name) {
            //if we didn't get anythign back aka it was a bad account number then
            //set all our values to default and return
            setAccountName("")
            setAccountBalance(0)
            setAccountType("")
            setErrorMessage("We couldn't find this account number please try again")
            return false
          }
          //once we have our data then we set our state variables to use later
          let tempString = response.data.name.split(" ")
          let customerName = tempString[0]
          setCustomerName(customerName.slice(0,-1))
          setAccountName(response.data.name)
          setAccountBalance(response.data.amount)
          setAccountType(response.data.type)
          setErrorMessage("")
          return true
        } catch (error) {
          console.error('Error fetching data', error);
          setErrorMessage("We couldn't find your account please enter a different account number.")
          return false
        }
      }
      return false
  };

  //this is a function to either deposit or wihdrawl for the account with a give id
  var alterAccountBalance = async (id, newBalance) => {
    //ensure there is a valid id
      if (id !== "" && id) {
        try {
          const response = await axios.post('http://localhost:3001/api/alterBalance', { id, newBalance });
          
        } catch (error) {
          console.error('Error fetching data', error);
          setErrorMessage("We encountered an error updating your account please try again .")
        }
      }

  };

  
  //this is the first step in our process, prompting the user for their account number
  const getAccountDetails = async () => {
   
    //get the number from our input field
    let acctNumber = document.getElementById("account-number").value
    if (!acctNumber) {
      setErrorMessage("Please enter a valid account number")
      return
    }
    
    //grab the data from postgres and set state so its helpful
    let success = await fetchData(acctNumber)
  
    //using this as a check for the "daily withdrawl limit", if the account we encountered
    //is different than the previous one then we reset this value. This doesn't really
    //work in a lot of edge cases and there are better ways to do this that I'd like to chat about
    if (acctNumber !== accountNumber) {
      setTotalWithdrawnToday(0)
    }

    setAccountNumber(acctNumber)
    
    //update our step so they can move forward if it was a success
    //we check to make sure the fetch call was successful here before moving on to the
    //next step
    if (success) setStep("pick-action")

  }

  const renderLogin = () => {
  //this step is for entering your account number
    if (step === "enter-account") {
      return (
        <div className="enter-acct">
          <h4 className="enter-acct-text">Please enter your account number to get started!</h4>
          <input className="account-number" id="account-number" autoFocus={true} type="number"/> 
          <button onClick={getAccountDetails}>Submit</button>
        </div>
      )
    }
  }

  const renderHome = () => {
  
    //this step is for selecting what action they would like to take (check balance, withdraw, or deposit)
    if (step !== "enter-account") {
      return (
        <div className='home-actions-container'>

          <div className='row'>
            
            <div className='child'>
              <h4 className="action-info">Welcome</h4>
              <div className='customer-name'>{customerName}</div>
            </div>
            
            <div className="child action-buttons">
              <button  className="btn" onClick={() => setStep("withdrawl")}>Withdrawl</button>
              <button  className="btn" onClick={() => setStep("deposit")}>Deposit</button>
            </div>

          </div>

          <div className='row'>
            
            <div className='child'>
              <h4 className="action-info">Account</h4>
              <div className='customer-name'>{accountName}</div>
            </div>
            
            <div className="child action-buttons">
              <button className="btn" onClick={() => setStep("check-balance")}>Check Balance</button>
              <button o className="btn" onClick={() => handleWithdrawl(20)}>Quick Cash $20</button>
            </div>

          </div>

        </div>
      )
    }
    
  
  }

  const renderActions = () => {
    
    //this step handles the check balance
    if (step === "check-balance") {
      return (
        <div className="check-balance-container">
          <div className='balance-details'>The balance of your account "{accountName}" is ${accountBalance}</div>
          {renderDone()}
        </div>
      )
    }
  //this step handles the withdrawl action
    if (step === "withdrawl") {
      return (
        <div className="withdrawl-container">
          <h4 className='withdrawl-details'>{customerName}, how much would you like to withdrawl from your account "{accountName}" today?</h4>
          <input className="withdrawl-amount" id="withdrawl-amount" type="number" autoFocus={true}/>
          <button onClick={() =>handleWithdrawl(document.getElementById("withdrawl-amount").value)}>Submit</button>
        </div>
      )
    }
    //this step handles the deposit action
    if (step === "deposit") {
      return (
        <div className='withdrawl-container'>
          <h4 className='withdrawl-details'>How much would you like to deposit into <strong>{accountName}</strong> today?</h4>
          <input className="withdrawl-amount" id="deposit-amount" type="number" autoFocus={true}/>
          <button onClick={handleDeposit}>Submit</button>
        </div>
      )
    }

      //this step handles the finished state
      if (step === "finished") {
        //render a different message here depending on the action that the user did
        let message = "Thank you, have a nice day!"
        if (actionType === "withdrawl") {
          message = "Your withdrawl from " + accountName + " was successful!"
        }

        if (actionType === "deposit") {
          message = "Your deposit into " + accountName + " was successful!"
        }

        return (
          <div className='finished-message'>
            {message}
            {renderDone()}
          </div>
        )
    }
     
  }

  //this simply sends the user back to the enter account number screen
  const renderDone = () => {
    return (
      <div className='done-button'>
        <button onClick={() => setStep("enter-account")}>I'm Done</button>
      </div>
    )
  }

  const handleDeposit = () => {
    let depositAmount = document.getElementById("deposit-amount").value
    let totalBalance = 1000

    //determing the total balance of their credit account to limit the deposit
    if (accountType === "credit") {
      totalBalance = Math.abs(accountBalance)
    }

    //error handling
    if (depositAmount > 1000) {
      setErrorMessage("You can only deposit $1000 at a time.")
      return
    }

    if (depositAmount > totalBalance) {
      setErrorMessage("You can't deposit more than your total due balance.")
      return
    }

    //no errors so lets set some stuff in postgres here so it updates their accounts
    //making sure that the values are not strings
    let newBalance = parseFloat(accountBalance) + parseFloat(depositAmount)
   
    alterAccountBalance(accountNumber, newBalance)
   
    //set our new values
    setAccountBalance(newBalance)
    setErrorMessage("")
    setActionType("deposit")
    setStep("finished")
  }

  const handleWithdrawl = (withdrawlAmount) => {
    //make sure we can actually withdrawl this amount based on rules presented
    
    //setting their totalallotment to the account balance for obvious reasons, we 
    //do an absolute value for the credit accounts, this is a bit funky but I added some notes 
    //to the wrap up about it
    let totalAllotment = Math.abs(accountBalance)
    
    //error handling here
    if (withdrawlAmount > 200) {
      //display message that you aren't allowed to withdrawl this much
      setErrorMessage("The withdrawl limit for this atm is $200 please re-enter an amount to withdrawl.")
      return
    }

    if (totalWithdrawnToday > 400) {
      //display message that you aren't allowed to withdrawl this much
      setErrorMessage("The daily limit for this ATM is $400 please enter a different amount.")
      return
    }

    //this client is allowing any withdrawls as long as they are in $5 increments
    if (withdrawlAmount % 5 !== 0) {
      //display message that say you have to enter denominations of 5
      setErrorMessage("You can only withdrawl in increments of $5.")
      return
    }

    //checking that they have the funds to do so
    if (withdrawlAmount > totalAllotment) {
      //display message that says they don't have sufficient funds...rip
      setErrorMessage("Insufficient funds, please try again.")
      return
    }

    //if we made it this far then we want to actually deduct the amount from our postgres database
    let newBalance = parseFloat(accountBalance) - parseFloat(withdrawlAmount)

    alterAccountBalance(accountNumber, newBalance)

    //this is a cheesy way to keep track of this but ive discussed better solutions in the notes
    setTotalWithdrawnToday(totalWithdrawnToday + withdrawlAmount)
    //set our new values and advance the step
    setAccountBalance(newBalance)
    setActionType("withdrawl")
    setErrorMessage("")
    setStep("finished")
    
  }



  //the idea here is that we have a stepped approach to rendering the app, enter acct number aka render login
  //render our home sreen which displays all the available actions they can take
  //the render actions function will show the details of the actions that they took aka how much to withdrawl etc
  //then we have our error handling at the bottom
  return (
    <div className="app-container">
      <header className="header-info">
        <div>ATM</div>
        <div className="home-button" onClick={() => setStep("enter-account")}>Start Over</div>
      </header>
      
      <div className="screen">{renderLogin()}</div>
      <div className="screen">{renderHome()}</div>
      <div className="screen">{renderActions()}</div>
      <div className='error-message'>{errorMessage}</div>
    </div>
  );
}

export default App;
