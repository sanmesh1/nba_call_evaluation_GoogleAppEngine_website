import React, {Component} from 'react';
import logo from './logo.svg';
import scottFosterCp3 from './images/scottFosterCp3.jpg';
import './App.css';
import SortingTableComponent from './components/basic.table';


class RefereeingUI extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			playerwiseJsonOutputObject: [{
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
				"percent_errors_against": "",
				"percent_errors_in_favor": ""
			}],
			teamwiseJsonOutputObject: [{
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
				"percent_errors_against": "",
				"percent_errors_in_favor": ""
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
		this.getSpecificPlayerDetails = this.getSpecificPlayerDetails.bind(this);
/////
		const apiUrl = 'https://original-spider-273806.ue.r.appspot.com/get_player_referee_accuracies_data';
		fetch(apiUrl)
		.then((response) => 
		response.json()
		)
		.then((data) => {
			var playerwiseJsonOutputObject_temp = JSON.parse(JSON.stringify(data));
			var teamwiseJsonOutputObject_temp = JSON.parse(JSON.stringify(data));
			
			/*
			playerwiseJsonOutputObject_temp.forEach(function (element, index, array) {
				element.pointsLostByReferee = (element.num_errors_against - element.num_errors_in_favor) * 2;
				if (element.PlayerName.split(' ').length ===  1 || element.PlayerName.match(/^ *$/) !== null){
					array.splice(index, 1);
				}
			});
			
			
			teamwiseJsonOutputObject_temp.forEach(function (element, index, array) {
				element.pointsLostByReferee = (element.num_errors_against - element.num_errors_in_favor) * 2;
				if (element.PlayerName.split(' ').length !==  1 || element.PlayerName.match(/^ *$/) !== null){
					array.splice(index, 1);
				}
			});
			
			this.setState({playerwiseJsonOutputObject: playerwiseJsonOutputObject_temp,
			teamwiseJsonOutputObject: teamwiseJsonOutputObject_temp,
			counter: this.state.counter+1,
			});
			console.log("teamwise")
			console.log(teamwiseJsonOutputObject_temp)
			console.log(this.state.teamwiseJsonOutputObject)
			*/
			
			teamwiseJsonOutputObject_temp.slice().reverse().forEach(function(element2, index, object) {
				element2.pointsLostByReferee = (element2.num_errors_against - element2.num_errors_in_favor) * 2;
				if (element2.PlayerName.split(' ').length !==  1 || element2.PlayerName.match(/^ *$/) !== null){
					//console.log(element.PlayerName);
					teamwiseJsonOutputObject_temp.splice(object.length - 1 - index, 1);
				}
				else{
					//console.log(element.PlayerName);
				}
			});
			
			playerwiseJsonOutputObject_temp.slice().reverse().forEach(function(element2, index, object) {
				element2.pointsLostByReferee = (element2.num_errors_against - element2.num_errors_in_favor) * 2;
				if (element2.PlayerName.split(' ').length ===  1 || element2.PlayerName.match(/^ *$/) !== null){
					//console.log(element.PlayerName);
					playerwiseJsonOutputObject_temp.splice(object.length - 1 - index, 1);
				}
				else{
					//console.log(element.PlayerName);
				}
			});
			
			this.setState({playerwiseJsonOutputObject: playerwiseJsonOutputObject_temp,
			teamwiseJsonOutputObject: teamwiseJsonOutputObject_temp,
			counter: this.state.counter+1,
			});
			
			console.log("teamwise");
			console.log(teamwiseJsonOutputObject_temp);
			var index = 1;
			console.log(this.state.teamwiseJsonOutputObject);
			// var element = teamwiseJsonOutputObject_temp[index];
			// console.log(element.PlayerName.split(' ').length);
		    // console.log((element.PlayerName.split(' ').length !==  1 || element.PlayerName.match(/^ *$/) !== null));
			
			
			
		});

//////	
	}
	handleChangeTeamOrPlayerName(event){
		this.setState({teamOrPlayerName: event.target.value});
	}
	handleChangeTeamOrPlayer(event){
		this.setState({teamOrPlayer: event.target.value});
		console.log("entered handleChangeTeamOrPlayer function")
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
			this.setState({playerwiseJsonOutputObject: data,
			counter: this.state.counter+1,
			});
		});
	}
	
	getSpecificPlayerDetails(){
		console.log(this.state.teamOrPlayerName)
	}
	
  render() {
	return (
		<div className="Parent">
			<div className="table">
				<h3>How much NBA players are impacted by Referees</h3>
				< img src={scottFosterCp3} width="600" height="338" />
				<SortingTableComponent submitButtonEvent={this.getSpecificPlayerDetails} onChangeTextboxFunc={this.handleChangeTeamOrPlayerName} onChangeFunc={this.handleChangeTeamOrPlayer} stateOfDropdown={this.state.teamOrPlayer} data={(this.state.teamOrPlayer == 'Player') ? this.state.playerwiseJsonOutputObject : this.state.teamwiseJsonOutputObject}/>
			</div>
			<div className="RefereeingInput">
				{/*
				<h1> {this.state.text} </h1>
				<h1> {this.state.teamOrPlayer} </h1>
				<h1> {this.state.teamOrPlayerName} </h1>
				*/}
				{/*
				<select className="teamOrPlayer" value={this.state.teamOrPlayer} onChange={this.handleChangeTeamOrPlayer}>
					<option value="Player">Player</option>
					<option value="Team">Team</option>
				</select>
				*/}
				<input className="teamOrPlayerName" size="20" type="text" value={this.state.teamOrPlayerName} onChange={this.handleChangeTeamOrPlayerName} />
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