import './App.css';
import {useState} from 'react';

function App() {
  
  //all of our state values managed here
  //account details first
  var [accountNumber, setAccountNumber] = useState(null);
  var [accountName, setAccountName] = useState("John")
  var [accountBalance, setAccountBalance] = useState(123456)
  var [accountType, setAccountType] = useState("")
  var [step, setStep] = useState("enter-account");
  var [errorMessage, setErrorMessage] = useState("")
  
  

  //this is the first step in our process, prompting the user for their account number
  const getAccountDetails = () => {
    //get the number from our input field
    let acctNumber = document.getElementById("account-number").value
    
    //grab the data from postgres and set state so its helpful

    setAccountNumber(acctNumber)
    
    //update our step so they can move forward
    setStep("pick-action")

  }

  const renderStep = () => {
    //this step is for entering your account number
    if (step === "enter-account") {
      return (
        <div className="enter-acct">
          <h4>Please enter your account number to get started!</h4>
          <input calssName="account-number" id="account-number"></input> <button onClick={getAccountDetails}>Submit</button>
        </div>
      )
    }
    //this step is for selecting what action they would like to take (check balance, withdraw, or deposit)
    if (step === "pick-action") {
      return (
        <div>
          <h4>Thank you {accountName} what would you like to do now?</h4>
          <div className="action-buttons">
            <button onClick={() => setStep("check-balance")}>Check Balance</button>
            <button onClick={() => setStep("withdrawl")}>Withdraw</button>
            <button onClick={() => setStep("deposit")}>Deposit</button>
         </div>
        </div>
      )
    }

    //this step handles the check balance
    if (step === "check-balance") {
      return (
        <div className="check-balance-container">
          <span>{accountName}, your balance is <strong>${accountBalance}</strong></span>
          {needMoreActions()}
        </div>
      )
    }
  //this step handles the withdrawl action
    if (step === "withdrawl") {
      return (
        <div className="withdrawl-container">
          <h4>How much would you like to withdrawl today?</h4>
          <input className="withdrawl-amount" id="withdrawl-amount"></input><button onClick={handleWithdrawl}>Submit</button>
        </div>
      )
    }
    //this step handles the deposit action
    if (step === "deposit") {
      return (
        <div className='withdrawl-container'>
          <h4>How Much would you like to deposit today?</h4>
          <input className="withdrawl-amount" id="deposit-amount"></input><button onClick={handleDeposit}>Submit</button>
        </div>
      )
    }
    //this step handles the finished state
    if (step === "finished") {
      return (
        <div>
          Thank you for your service {accountName}!
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
    let totalBalance = 500

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

    setErrorMessage("")
    setStep("finished")
  }

  const handleWithdrawl = () => {
    //make sure we can actually withdrawl this amount based on rules presented
    let totalWithdrawnToday = 0
    let totalAllotment = 399
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
      setErrorMessage("Please enter a value that is divisible by 5")
      return
    }

    //checking that they have the funds to do so
    if (withdrawlAmount > totalAllotment) {
      //display message that says they don't have sufficient funds...rip
      setErrorMessage("Insufficient funds, you have x amount remaining")
      return
    }

    //if we made it this far then we want to actually deduct the amount from our postgres database

    //prompt the user for any more actions
    setErrorMessage("")
    setStep("finished")
    
  }


  return (
    <div className="app-container">
      <header className="header-info">Welcome to BigMoney ATM!</header>
      <div className='error-message'>{errorMessage}</div>
      <div className="screen">{renderStep()}</div>
    </div>
  );
}

export default App;
