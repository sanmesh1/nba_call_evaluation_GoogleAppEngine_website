import React, {Component} from 'react';
import logo from './logo.svg';
import scottFosterCp3 from './images/scottFosterCp3.jpg';
import scottFosterAwakenedMedium from './images/scottFosterAwakenedMedium.jpg';
//import './App.css';
import './assets/css/main.css';
import './assets/css/font-awesome.min.css';
import SortingTableComponent from './components/basic.table';
import ErrorTableComponent from './components/basic.tableErrorsAgainstTable';
import { Chart } from "react-google-charts";
import ScriptTag from 'react-script-tag';
// import './assets/js/jquery.min.js';
// import './assets/js/jquery.scrolly.min.js';
// import './assets/js/jquery.scrollex.min.js';
// import './assets/js/skel.min.js';
// import './assets/js/util.js';
// import './assets/js/main.js';

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
			percentErrorsAgainstVsNumErrorsAgainst: [],
			incorrectCallsTableForIndividualJsonOutputObject: [],
			videoTagUrl: "",
		};
		this.callApi = this.callApi.bind(this);
		this.handleChangeTeamOrPlayerName = this.handleChangeTeamOrPlayerName.bind(this);
		this.handleChangeTeamOrPlayer = this.handleChangeTeamOrPlayer.bind(this);
		this.getSpecificPlayerDetails = this.getSpecificPlayerDetails.bind(this);
		this.getJsonFromWebApi = this.getJsonFromWebApi.bind(this);
		this.openVideo = this.openVideo.bind(this);
		this.doNothingEvent = this.doNothingEvent.bind(this);
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
			
			/*
			var percentErrorsAgainstVsNumErrorsAgainst_temp = []
			this.state.playerwiseJsonOutputObject.forEach(function(currentValue, index, array ) {
				percentErrorsAgainstVsNumErrorsAgainst_temp.push([currentValue.percent_errors_against, currentValue.num_errors_against, currentValue.PlayerName]);
			});
			*/
			
			this.setState({
			playerwiseJsonOutputObject: playerwiseJsonOutputObject_temp,
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
	
	componentDidMount () {
		var script = document.createElement("script");
		script.src = "./assets/js/jquery.min.js";
		script.async = true;
		document.body.appendChild(script);
		
		script.src = "./assets/js/jquery.scrolly.min.js";
		document.body.appendChild(script);
		
		script.src = "./assets/js/jquery.scrollex.min.js";
		document.body.appendChild(script);

		script.src = "./assets/js/skel.min.js";
		document.body.appendChild(script);
		
		script.src = "./assets/js/util.js";
		document.body.appendChild(script);

		script.src = "./assets/js/main.js";
		document.body.appendChild(script);
		
		// import './assets/js/jquery.min.js';
// import './assets/js/jquery.scrolly.min.js';
// import './assets/js/jquery.scrollex.min.js';
// import './assets/js/skel.min.js';
// import './assets/js/util.js';
// import './assets/js/main.js';
	}

	handleChangeTeamOrPlayerName(event){
		this.setState({teamOrPlayerName: event.target.value});
	}
	handleChangeTeamOrPlayer(event){
		this.setState({teamOrPlayer: event.target.value});
		console.log("entered handleChangeTeamOrPlayer function")
	}
	
	data_table= [
		['Age', 'Weight'],
		[8, 12],
		[4, 5.5],
		[11, 14],
		[4, 5],
		[3, 3.5],
		[6.5, 7],
	]
  
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
	
	getJsonFromWebApi(webApiUrl) {
		fetch(webApiUrl)
		.then((response) => 
		response.json()
		)
		.then((data) => {
			// console.log('This is your data', data);
			// console.log(typeof data);
			// console.log(Object.getOwnPropertyNames(data));
			JSON.parse(JSON.stringify(data));
		});		
	}
	
	getSpecificPlayerDetails(player_referee_accuracies_object){
		console.log(player_referee_accuracies_object.PlayerName);
		
		var percentErrorsAgainstVsNumErrorsAgainst_temp = [["X", "Y", {role: "style", type: "string"}, { role: "tooltip", type: "string", p: { html: true } }]]
		if (this.state.teamOrPlayer == "Player"){
			var arrayTemp = this.state.playerwiseJsonOutputObject
		}
		else{
			var arrayTemp = this.state.teamwiseJsonOutputObject
		}
		arrayTemp.forEach(function(currentValue, index, array ) {
			var str = "";
			if (currentValue.PlayerName == player_referee_accuracies_object.PlayerName){
				percentErrorsAgainstVsNumErrorsAgainst_temp.push([currentValue.num_errors_against, currentValue.percent_errors_against, 'point { size: 18; shape-type: star; fill-color: #a52714; }', str.concat("player = ", currentValue.PlayerName, ", num = ", currentValue.num_errors_against.toString(), ", % = ", currentValue.percent_errors_against.toString())]);
			}
			else{
				percentErrorsAgainstVsNumErrorsAgainst_temp.push([currentValue.num_errors_against, currentValue.percent_errors_against, 'blue', str.concat("player = ", currentValue.PlayerName, ", num = ", currentValue.num_errors_against.toString(), ", % = ", currentValue.percent_errors_against.toString())]);
			}
		});
		///////////
		var webApiUrl = '';
		var nameWithSpacesMadeUrlFriendly = player_referee_accuracies_object.PlayerName;
		nameWithSpacesMadeUrlFriendly = nameWithSpacesMadeUrlFriendly.replace(/\s/g, '%20');
		webApiUrl = webApiUrl.concat('https://original-spider-273806.ue.r.appspot.com/get_plays_of_errors_against_individuals/', nameWithSpacesMadeUrlFriendly);
		// let data = this.getJsonFromWebApi(webApiUrl);
		
		fetch(webApiUrl)
		.then((response) => 
		response.json()
		)
		.then((data) => {
			// console.log('This is your data', data);
			// console.log(typeof data);
			// console.log(Object.getOwnPropertyNames(data));
			data = JSON.parse(JSON.stringify(data));
		
			console.log("out of getJson function");
			console.log(data);
			
			// var incorrectCallsTableForIndividualJsonOutputObject_temp = {
				// "GameDetails": "",
				// "CallType": "",
				// "committing_player": "",
				// "disadvantaged_player": "",
				// "review_decision": "",
				// "linkTo2minReport": "",
				// "video_link": "",
			// };
			//////////
			
			console.log("Testing concat")
			data.slice().reverse().forEach(function(element2, index, object) {
				var gameDate = element2.GameDate.substring(0, 10);
				var Home_team = element2.Home_team;
				var Away_team = element2.Away_team;
				var HomeTeamScore = element2.HomeTeamScore;
				var VisitorTeamScore = element2.VisitorTeamScore;
				var GameDetails= "";
				GameDetails = GameDetails.concat(gameDate,"\n", Home_team, " @ ",  Away_team, ": ", HomeTeamScore, "-", VisitorTeamScore);
				console.log(GameDetails)
				element2.GameDetails = GameDetails;
			});
			
			this.setState({
				percentErrorsAgainstVsNumErrorsAgainst: percentErrorsAgainstVsNumErrorsAgainst_temp,
				teamOrPlayerName: player_referee_accuracies_object.PlayerName,
				incorrectCallsTableForIndividualJsonOutputObject: data,
			});
			///
			
			
			///
			var elmnt = document.getElementById("RefereeingInput");
			elmnt.scrollIntoView();
		});		
		
		
	}
	
	openVideo(object){
		console.log(object.video_link);
		var video_link = object.video_link;
		var stringToFind = "gameNo=";
		var indexOfFirst = video_link.indexOf(stringToFind)+stringToFind.length;
		var gameId = video_link.substr(indexOfFirst,10);
		
		stringToFind = "eventNum=";
		indexOfFirst = video_link.indexOf(stringToFind)+stringToFind.length;
		var playId = video_link.substr(indexOfFirst);
		
		console.log("gameId")
		console.log(gameId)
		console.log("playId")
		console.log(playId)
		
		var videoTagUrl_temp = "";
		videoTagUrl_temp = videoTagUrl_temp.concat("https://ak-static.cms.nba.com/wp-content/uploads/referee-clips/", gameId, "_", playId, "_DF%20BCAST_1509kbps.mp4")
		console.log("videoTagUrl_temp")
		console.log(videoTagUrl_temp)
		this.setState({
			videoTagUrl: videoTagUrl_temp,
		});
		
		var video = document.getElementById('videoTest');
		video.innerHTML = '';
		var source = document.createElement('source');
		video.pause();
		source.setAttribute('src', videoTagUrl_temp);
		video.appendChild(source);
		video.load();
		video.play();

		// function videoLoad(urlVideoLink)
		// {
			// video.pause();

			// source.setAttribute('src', urlVideoLink); 

			// video.load();
			// video.play();
		// }
		// setTimeout(videoLoad.bind(null, videoTagUrl_temp), 3000);
		// setTimeout(function() {  
			// video.pause();

			// source.setAttribute('src', "https://ak-static.cms.nba.com/wp-content/uploads/referee-clips/0021801109_2267_DF%20BCAST_1509kbps.mp4"); 

			// video.load();
			// video.play();
		// }, 3000);
	}
	
	doNothingEvent(event){
		console.log("doNothingEvent");
	}
	
  render() {
	return (
		<div className="SpecificPlayerTable" id="SpecificPlayerTable">
			<div className="table">
				<SortingTableComponent clickOnRowFunc={this.getSpecificPlayerDetails} submitButtonEvent={this.getSpecificPlayerDetails} onChangeTextboxFunc={this.handleChangeTeamOrPlayerName} onChangeFunc={this.handleChangeTeamOrPlayer} stateOfDropdown={this.state.teamOrPlayer} data={(this.state.teamOrPlayer == 'Player') ? this.state.playerwiseJsonOutputObject : this.state.teamwiseJsonOutputObject}/>
			</div>
			<div className="RefereeingInput" id="RefereeingInput">
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
				<input className="teamOrPlayerName" size="20" type="text" value={this.state.teamOrPlayerName} onChange={this.handleChangeTeamOrPlayerName} />
				<button className="callApi" onClick= {this.callApi}> 
					 Submit
				</button>
				*/}
			</div>
			<div className="RefereeingAccuracyOutput">
				<Greeting isLoggedIn={this.state.percentErrorsAgainstVsNumErrorsAgainst} playerTeamName = {this.state.teamOrPlayerName}
				clickOnRowFunc={this.openVideo} submitButtonEvent={this.getSpecificPlayerDetails} onChangeTextboxFunc={this.doNothingEvent} 
				onChangeFunc={this.doNothingEvent} data={this.state.incorrectCallsTableForIndividualJsonOutputObject}
				videoTagUrl={this.state.videoTagUrl}/>
			</div>
		</div>
	);
  }
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  console.log("Function Greeting")
  console.log(props.videoTagUrl)
  if (isLoggedIn !== undefined && isLoggedIn.length !== 0) {
    return (
		<div>
			<h1> {props.playerTeamName} </h1>
			<p1> <strong>The red star indicates selected player. Hover over graph points to see labels.</strong> </p1>
			<Chart
			  width={'600px'}
			  height={'400px'}
			  chartType="ScatterChart"
			  loader={<div>Loading Chart</div>}
			  data={isLoggedIn}  
			  options={{
				title: '% errors against vs. num errors against',
				hAxis: { title: 'num errors against', minValue: 0, maxValue: 12 },
				vAxis: { title: '% errors against', minValue: 0, maxValue: 60 },
				legend: 'none',
			  }}
			  rootProps={{ 'data-testid': '1' }}
			/>
			<div>
				<h1> Detail on Referee Mistakes Against Individuals. </h1>
			</div>
			<div className="ErrorTableComponent">
				<ErrorTableComponent clickOnRowFunc={props.clickOnRowFunc} submitButtonEvent={props.submitButtonEvent} 
				onChangeTextboxFunc={props.onChangeTextboxFunc} onChangeFunc={props.onChangeFunc} 
				data={props.data}/>
			</div>
			{/*
			<video width="640" height="480" controls>
				<source src={props.videoTagUrl} type="video/mp4"/>
				Your browser does not support the video tag.
			</video>
			*/}
			{/*
			<video controls autoPlay loop muted>
				<source src={"https://ak-static.cms.nba.com/wp-content/uploads/referee-clips/0021801109_2267_DF%20BCAST_1509kbps.mp4"} type="video/mp4" />
			</video>
			*/}
			<video id="videoTest" controls autoPlay loop muted>
			{/*<source src={props.videoTagUrl} type="video/mp4" />*/}
			</video>
		</div>
	);
  }
  else{
	return (
		"Nothing"
	);
  }
}

class App extends Component {
	state = {
		  displayDownButton: false,
		  displayUpButton: false,
		  scrollPosition:0
	}	
	componentDidMount () {
		const script = document.createElement("script");
		script.src = "./assets/js/jquery.min.js";
		script.async = true;
		document.body.appendChild(script);
		
		const script1 = document.createElement("script");
		script1.src = "./assets/js/jquery.scrolly.min.js";
		script1.async = true;
		document.body.appendChild(script1);
		
		const script2 = document.createElement("script");
		script2.src = "./assets/js/jquery.scrollex.min.js";
		script2.async = true;
		document.body.appendChild(script2);
		
		const script3 = document.createElement("script");
		script3.src = "./assets/js/skel.min.js";
		script3.async = true;
		document.body.appendChild(script3);
		
		const script4 = document.createElement("script");
		script4.src = "./assets/js/util.js";
		script4.async = true;
		document.body.appendChild(script4);
		
		const script5 = document.createElement("script");
		script5.src = "./assets/js/main.js";
		script5.async = true;
		document.body.appendChild(script5);
		
		// script.src = "./assets/js/jquery.scrolly.min.js";
		// document.body.appendChild(script);
		
		// script.src = "./assets/js/jquery.scrollex.min.js";
		// document.body.appendChild(script);

		// script.src = "./assets/js/skel.min.js";
		// document.body.appendChild(script);
		
		// script.src = "./assets/js/util.js";
		// document.body.appendChild(script);

		// script.src = "./assets/js/main.js";
		// document.body.appendChild(script);
		
		// import './assets/js/jquery.min.js';
// import './assets/js/jquery.scrolly.min.js';
// import './assets/js/jquery.scrollex.min.js';
// import './assets/js/skel.min.js';
// import './assets/js/util.js';
// import './assets/js/main.js';
	}
	
  render() {
    return (

		<html>
			<head>
				<title>Sanmeshkumar Udhayakumar</title>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="stylesheet" href="assets/css/main.css" />
			</head>
			<body>

			{/*<!-- Header --> */}
					<header id="header" class="alt">
						<div class="logo"><a href="https://github.com/sanmesh1/nba_call_evaluation_ReactFrontEnd_PythonFlaskGoogleAppEngineBackend_website">Sanmeshkumar Udhayakumar</a></div>
						<a href="#menu">Menu</a>
					</header>

				{/*<!-- Nav -->*/}
					<nav id="menu">
						<ul class="links">
							<li><a href="index.html">Home</a></li>
							<li><a href="generic.html">Generic</a></li>
							<li><a href="elements.html">Elements</a></li>
						</ul>
					</nav>

				{/*<!-- Banner -->*/}
					<section id="banner">
						<div class="inner">
							<header>
								<h1>NBA Referee Impact On NBA Players/Teams</h1>
							</header>
							<a href="#main" onClick={this.handleScrollToStats} class="button big scrolly">Scroll Down</a>
						</div>
					</section>

				{/*<!-- Main -->*/}
					<div id="main">

						{/*<!-- Section -->*/}
							<section class="wrapper style2">
								<div class="inner">
									<div class="flex flex-2">
										<div class="col col2">
											<h3>Referees Aren't Perfect</h3>
											<p>If you're a sports fan, you understand that referees are far from perfect. We've all pulled our hair over a missed goal-tending,
											 or the referee swallowing their whistle at the end of games. On the bottom right, you can see a video of Trailblazers Guard CJ 
											 McCollum talk eloquently about a missed goal-tending call by the referees, which cost them the game, but which the referees had the 
											 audacity to tell him, "Was an obvious Non-call". In general, <strong>WE'VE ASSUMED THAT ON THE BALANCE, REFEREES ARE
											  EQUALLY UNBIASED TOWARDS ALL TEAMS</strong>.
											</p>
											
											<h4>BUT ARE REFEREES ACTUALLY UNBIASED?</h4>
											<p>The NBA releases a 2 minute report, which is a report that details all the plays in the last 2 minutes, and whether they are
											Correct Calls (CC), Incorrect Calls (IC), Correct Non-Calls (CNC), and Incorrect Non-Calls (INC) in game, with great detail (<a href="https://official.nba.com/l2m/L2MReport.html?gameId=0041800406">Example</a>). 
											I have mined the 2 minute reports for the 2018-2020 seasons to how much referees incorrectly negatively impact
											players/teams, and whether there is a bias towards certain teams/players.</p>
											<p>In the next section, you will see a table with:</p>
												<li>Table of teams or players listed</li>
												<li># Errors against a team/player</li>
												<li>% Errors against a team/player with respect to all calls made on player/team</li>
												<li>Net points the team/player lost to the referee</li>
											<p>Use the dropdown to select viewing disadvantaged players, or teams in the table</p>
											<a href="#TableInput" onClick={this.handleScrollToStats} class="button">Go To Referee Bias Exploration</a>
										</div>
										<div class="col col1 first">
											<div class="image round fit">
											{/*<a href="generic.html" class="link"><img src="images/pic02.jpg" alt="" /></a>*/}
											< img src={scottFosterAwakenedMedium} width="600" height="338" />
											</div>
											<iframe width="560" height="315" src="https://www.youtube.com/embed/MtBXI6FFIcw?start=197" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
										</div>
									</div>
								</div>
							</section>
					
						{/*<!-- Section -->*/}
							<div id="TableInput">
							<section class="wrapper style1">
								<div class="inner">
									{/*<!-- 2 Columns -->*/}
											<h3>Referee Bias Exploration</h3>
											<strong>
												<li>Make a selection of Player or Team in the dropdown below to update table.</li>
												<li>Click on a table row to see referee details on a particular team/player</li>
												<li>Sort table by any of column fields by clicking on it</li>
												<li>Filter for specific team/player be entering name in box below</li>
											</strong>
											<div className="App">
												<RefereeingUI > </RefereeingUI >
											</div>
								</div>
							</section>
							</div>
						{/*<!-- Section -->*/}
							<section class="wrapper style1">
								<div class="inner">
									<header class="align-center">
										<h2>Aliquam ipsum purus dolor</h2>
										<p>Cras sagittis turpis sit amet est tempus, sit amet consectetur purus tincidunt.</p>
									</header>
									<div class="flex flex-3">
										<div class="col align-center">
											<div class="image round fit">
												<img src="images/pic03.jpg" alt="" />
											</div>
											<p>Sed congue elit malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet. </p>
											<a href="#" class="button">Learn More</a>
										</div>
										<div class="col align-center">
											<div class="image round fit">
												<img src="images/pic05.jpg" alt="" />
											</div>
											<p>Sed congue elit malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet. </p>
											<a href="#" class="button">Learn More</a>
										</div>
										<div class="col align-center">
											<div class="image round fit">
												<img src="images/pic04.jpg" alt="" />
											</div>
											<p>Sed congue elit malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet. </p>
											<a href="#" class="button">Learn More</a>
										</div>
									</div>
								</div>
							</section>

					</div>

				{/*<!-- Footer -->*/}
					<footer id="footer">
						<div class="copyright">
							<ul class="icons">
								<li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
								<li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
								<li><a href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li>
								<li><a href="#" class="icon fa-snapchat"><span class="label">Snapchat</span></a></li>
							</ul>
							<p>&copy; Untitled. All rights reserved. Design: <a href="https://templated.co">TEMPLATED</a>. Images: <a href="https://unsplash.com">Unsplash</a>.</p>
						</div>
					</footer>

					<script type="text/babel" src="assets/js/jquery.min.js"></script>
					<script type="text/babel" src="assets/js/jquery.scrolly.min.js"></script>
					<script type="text/babel" src="assets/js/jquery.scrollex.min.js"></script>
					<script type="text/babel" src="assets/js/skel.min.js"></script>
					<script type="text/babel" src="assets/js/util.js"></script>
					<script type="text/babel" src="assets/js/main.js"></script>
				{/*
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/jquery.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/jquery.scrolly.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/jquery.scrollex.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/skel.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/util.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/main.js" />
				*/}
			</body>
		</html>
    );
  }
}
export default App;