import "./App.css";
import React from "react";

import web3 from './web3';
import lotteryContract from './lottery';
import lottery from "./lottery";

class App extends React.Component {

  state = { // Don't forget to initialize state
    manager: '',
    participantCount: 0,
    prize: '',
    value: ''
  };

  async componentDidMount() {
    const contractManager = await lotteryContract.methods.manager().call(); // Get current address of manager then add to state
    const players = await lotteryContract.methods.getParticipants().call();
    const prize = await web3.eth.getBalance(lotteryContract.options.address);

    this.setState({ manager: contractManager, participantCount: players.length, prize: prize });
  };

  onSubmit = async (e) => { // Arrow functions remove need for 'this' keyword
    e.preventDefault();

    const accounts = await web3.eth.getAccounts(); // Get list of accounts 

    await lotteryContract.methods.enterLottery().send( 
      { from: accounts[0], value: web3.utils.toWei(this.state.value)} // Assume current user is the first account in the accounts array, Convert to wei before sending transaction
    );

  };

  render() {

    // Test console logs
    web3.eth.getAccounts()
      .then(console.log(`Web3 version: ${web3.version}`));  
    console.log(this.state.manager);

    return (
      <div>
        <h2>Eth-Lottery</h2>
        <p>Lottery manager: <strong>{this.state.manager}</strong></p>
        <p>
          There are currently: <strong>{this.state.participantCount}</strong> participant(s) entered to win <strong>{web3.utils.fromWei(this.state.prize, 'ether')}</strong> ether.
        </p>
        
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Want to enter?</h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              value={this.state.value} 
              onChange={(event) => this.setState({ value: event.target.value })} 
            />
          </div>
          <button>Enter</button>
        </form>
      </div>
    );
  }
}

export default App;

