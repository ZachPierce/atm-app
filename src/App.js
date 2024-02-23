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


  useEffect(() => {
    fetchData();
  }, []);

  //function to hit our server using axios to get our data from postgres for a give account id
  //this returns a boolean so that we know weather to procced or to stop because of an error
  var fetchData = async (id) => {
    //ensure there is a valid id
      if (id !== "" && id) {
        try {
          const response = await axios.get(`http://localhost:3001/api/data/${id}`);
          if (!response.data.name) {
            //if we didn't get anythign back aka it was a bad account number then
            //set all our values to default and return an
            setAccountName("")
            setAccountBalance(0)
            setAccountType("")
            setErrorMessage("We couldn't find this account number please try again")
            return false
          }
          //once we have our data then we set our state variables to use later
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

  const renderStep = () => {
    //this step is for entering your account number
    if (step === "enter-account") {
      return (
        <div className="enter-acct">
          <h4>Please enter your account number to get started!</h4>
          <input className="account-number" id="account-number" autoFocus={true} type="number"/> 
          <button onClick={getAccountDetails}>Submit</button>
        </div>
      )
    }
    //this step is for selecting what action they would like to take (check balance, withdraw, or deposit)
    if (step === "pick-action") {
      return (
        <div>
          <h4 className="action-info">What would you like to do with <strong>{accountName}</strong> account?</h4>
          <div className="action-buttons">
            <button onClick={() => setStep("check-balance")}>Check Balance</button>
            <button onClick={() => setStep("withdrawl")}>Withdrawl</button>
            <button onClick={() => setStep("deposit")}>Deposit</button>
         </div>
        </div>
      )
    }

    //this step handles the check balance
    if (step === "check-balance") {
      return (
        <div className="check-balance-container">
          <span>Your balance in <strong>{accountName}</strong> is <strong>${accountBalance}</strong></span>
          {needMoreActions()}
        </div>
      )
    }
  //this step handles the withdrawl action
    if (step === "withdrawl") {
      return (
        <div className="withdrawl-container">
          <h4>How much would you like to withdrawl from <strong>{accountName}</strong> today?</h4>
          <input className="withdrawl-amount" id="withdrawl-amount" type="number" autoFocus={true}/>
          <button onClick={handleWithdrawl}>Submit</button>
        </div>
      )
    }
    //this step handles the deposit action
    if (step === "deposit") {
      return (
        <div className='withdrawl-container'>
          <h4>How much would you like to deposit in to <strong>{accountName}</strong> today?</h4>
          <input className="withdrawl-amount" id="deposit-amount" type="number" autoFocus={true}/>
          <button onClick={handleDeposit}>Submit</button>
        </div>
      )
    }
    //this step handles the finished state
    if (step === "finished") {
      return (
        <div>
          Thank you for your service!
          {needMoreActions()}
        </div>
      )
    }
   
  }

  //this is a function to prompt the user if they need to do anything else
  //made this so the code wasn't repeated a bunch above
  const needMoreActions = () => {
    return (
      <div className="more-actions-container">
        <div className='question'>Do you need anything else?</div> 
        <div className='action-buttons'>
          <button onClick={() => setStep("enter-account")}>Yes</button>
          <button onClick={() => setStep("enter-account")}>No</button>
        </div>
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
      setErrorMessage("You can only deposit $1000 at a single time.")
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

    setErrorMessage("")
    setStep("finished")
  }

  const handleWithdrawl = () => {
    //make sure we can actually withdrawl this amount based on rules presented
    
    let totalAllotment = accountBalance
    let withdrawlAmount = document.getElementById("withdrawl-amount").value

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
      setErrorMessage("Insufficient funds")
      return
    }

    //if we made it this far then we want to actually deduct the amount from our postgres database
    let newBalance = parseFloat(accountBalance) - parseFloat(withdrawlAmount)

    alterAccountBalance(accountNumber, newBalance)

    //this is a cheesy way to keep track of this but ive discussed better solutions in the notes
    setTotalWithdrawnToday(totalWithdrawnToday + withdrawlAmount)
    //prompt the user for any more actions
    setErrorMessage("")
    setStep("finished")
    
  }


  return (
    <div className="app-container">
      <header className="header-info">Welcome to BigMoney ATM!</header>
      <div className='error-message'>{errorMessage}</div>
      <div className="screen">{renderStep()}</div>
      <div className='home-button'>
       <button onClick={() => setStep("enter-account")}>Take me home</button>
      </div>
      
    </div>
  );
}

export default App;
