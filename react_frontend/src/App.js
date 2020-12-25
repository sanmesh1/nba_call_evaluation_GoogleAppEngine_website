import React, {Component} from 'react';
import logo from './logo.svg';
import scottFosterCp3 from './images/scottFosterCp3.jpg';
import './App.css';
import SortingTableComponent from './components/basic.table';


class RefereeingUI extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			jsonOutputObject: [{
				"Committing_CC": "",
				"Committing_CNC": "",
				"Committing_IC": "",
				"Committing_INC": "",
				"Disadvantaged_CC": "",
				"Disadvantaged_CNC": "",
				"Disadvantaged_IC": "",
				"Disadvantaged_INC": "",
				"PlayerName": "",
				"num_errors_against": "",
				"num_errors_in_favor": "",
				"percent_errors_against": 1.82,
				"percent_errors_in_favor": 5.45
			}],
			counter: 0,
			teamOrPlayer: "Player",
			teamOrPlayerName: "",
			cheating: {disadvantaged: null, commiting: null, totalPercentage: null},
			protecting: {disadvantaged: null, commiting: null, totalPercentage: null},
		};
		this.callApi = this.callApi.bind(this);
		this.handleChangeTeamOrPlayerName = this.handleChangeTeamOrPlayerName.bind(this);
		this.handleChangeTeamOrPlayer = this.handleChangeTeamOrPlayer.bind(this);
/////
		const apiUrl = 'https://original-spider-273806.ue.r.appspot.com/get_player_referee_accuracies_data';
		fetch(apiUrl)
		.then((response) => 
		response.json()
		)
		.then((data) => {
			this.setState({jsonOutputObject: data,
			counter: this.state.counter+1,
			});
		});

//////	
	}
	handleChangeTeamOrPlayerName(event){
		this.setState({teamOrPlayerName: event.target.value});
	}
	handleChangeTeamOrPlayer(event){
		this.setState({teamOrPlayer: event.target.value});
	}
	

	// function getDataFromApi(url) {
		// return p1 * p2;   // The function returns the product of p1 and p2
	// }
	
	callApi(){
		const apiUrl = 'https://original-spider-273806.ue.r.appspot.com/get_player_referee_accuracies_data';
		fetch(apiUrl)
		.then((response) => 
		response.json()
		)
		.then((data) => {
			console.log('This is your data', data);
			console.log(typeof data);
			console.log(Object.getOwnPropertyNames(data));
			// console.log(data[0].gameId);
			// console.log(typeof data[0].gameId);
			this.setState({jsonOutputObject: data,
			counter: this.state.counter+1,
			});
		}
	);
}
  render() {
	return (
		<div className="Parent">
			<div className="table">
				<h3>How much NBA players are impacted by Referees</h3>
				< img src={scottFosterCp3} width="600" height="338" />
				<SortingTableComponent data={this.state.jsonOutputObject}/>
			</div>
			<div className="RefereeingInput">
				{/*
				<h1> {this.state.text} </h1>
				<h1> {this.state.teamOrPlayer} </h1>
				<h1> {this.state.teamOrPlayerName} </h1>
				*/}
				<select className="teamOrPlayer" value={this.state.teamOrPlayer} onChange={this.handleChangeTeamOrPlayer}>
					<option value="Player">Player</option>
					<option value="Team">Team</option>
				</select>
				<input className="teamOrPlayerName" type="text" value={this.state.teamOrPlayerName} onChange={this.handleChangeTeamOrPlayerName} />
				<button className="callApi" onClick= {this.callApi}> 
					 Submit
				</button>
			</div>
			<div className="RefereeingAccuracyOutput">
					How favorable are refs?
					
					<br /><br />REFEREE CHEATING:
					
					<br /><br />Referees being blind to fouls commited by player % = 
					commiting_INC/(commiting_CC+ commiting_INC)
					<br />{this.state.cheating.commiting}
					<br /><br />Referees taking out opponent by calling incorrect fouls against player opponent % = 
					disadv_IC/(disadv_CNC+ disadv_IC)
					<br />{this.state.cheating.disadvantaged}

					<br /><br />Total Cheating %: 
					(commiting_INC+disadv_IC)/(commiting_CC+ commiting_INC + disadv_CNC+ disadv_IC)
					<br />{this.state.cheating.totalPercentage}

					<br /><br />Comparison to avg cheating %:

					<br /><br />Show everything in bar chart and box chart

					<br /><br />PROTECTING PLAYER CORRECTLY:

					<br /><br />Referees not calling fouls on player unnecessarily % = commiting_CNC/(commiting_IC+ commiting_CNC)
					<br />{this.state.protecting.commiting}

					<br /><br />Referees correctly protecting player against opponent fouls % =
					disadv_CC/(disadv_INC+ disadv_CC)
					<br />{this.state.protecting.disadvantaged}

					<br /><br />Total Correct Protection %:
					<br />{this.state.protecting.totalPercentage}					

					<br /><br />Comparison to avg protection %:

					<br /><br /> Show everything in bar chart and box chart
			</div>
		</div>
	);
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
		<RefereeingUI > </RefereeingUI >
      </div>
    );
  }
}
export default App;