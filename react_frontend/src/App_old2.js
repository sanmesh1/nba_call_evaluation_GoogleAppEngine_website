import React, {Component} from 'react';
import logo from './logo.svg';
import scottFosterCp3 from './images/scottFosterCp3.jpg';
//import './App.css';
import './assets/css/main.css';
import SortingTableComponent from './components/basic.table';
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
			percentErrorsAgainstVsNumErrorsAgainst: []
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
		
		this.setState({
			percentErrorsAgainstVsNumErrorsAgainst: percentErrorsAgainstVsNumErrorsAgainst_temp,
			teamOrPlayerName: player_referee_accuracies_object.PlayerName
		});
	}
	
  render() {
	return (
		<div className="Parent">
			<div className="table">
				<h3>How much NBA players are impacted by Referees</h3>
				< img src={scottFosterCp3} width="600" height="338" />
				<div>
					<strong>Make a selection of Player or Team in the dropdown below to see the table full of players or teams, and the referee adverse impact on them. 
						You can sort the table by the fields by clicking on the fields. You can also filter out specific teams and players by typing in the dropdown
						below. You can also click on a row to see player or team specific info below the table.
					</strong>
				</div>
				<SortingTableComponent clickOnRowFunc={this.getSpecificPlayerDetails} submitButtonEvent={this.getSpecificPlayerDetails} onChangeTextboxFunc={this.handleChangeTeamOrPlayerName} onChangeFunc={this.handleChangeTeamOrPlayer} stateOfDropdown={this.state.teamOrPlayer} data={(this.state.teamOrPlayer == 'Player') ? this.state.playerwiseJsonOutputObject : this.state.teamwiseJsonOutputObject}/>
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
				<input className="teamOrPlayerName" size="20" type="text" value={this.state.teamOrPlayerName} onChange={this.handleChangeTeamOrPlayerName} />
				<button className="callApi" onClick= {this.callApi}> 
					 Submit
				</button>
				*/}
			</div>
			<div className="RefereeingAccuracyOutput">
				<Greeting isLoggedIn={this.state.percentErrorsAgainstVsNumErrorsAgainst} playerTeamName = {this.state.teamOrPlayerName}/>
			</div>
		</div>
	);
  }
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  console.log("Function Greeting")
  console.log(isLoggedIn)
  if (isLoggedIn !== undefined && isLoggedIn.length !== 0) {
    return (
		<div>
			<h1> {props.playerTeamName} </h1>
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
		</div>
	);
  }
  else{
	return (
		"Nothing"
	);
  }
}

var NewComponent = React.createClass({
  render: function() {
    return (
      <div>
        {/*
	Urban by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/}
        <title>Urban by TEMPLATED</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="assets/css/main.css" />
        {/* Header */}
        <header id="header" className="alt">
          <div className="logo"><a href="index.html">Urban <span>by TEMPLATED</span></a></div>
          <a href="#menu">Menu</a>
        </header>
        {/* Nav */}
        <nav id="menu">
          <ul className="links">
            <li><a href="index.html">Home</a></li>
            <li><a href="generic.html">Generic</a></li>
            <li><a href="elements.html">Elements</a></li>
          </ul>
        </nav>
        {/* Banner */}
        <section id="banner">
          <div className="inner">
            <header>
              <h1>This is Urban</h1>
              <p>Aliquam libero augue varius non odio nec faucibus congue<br />felis quisque a diam rutrum tempus massa accumsan faucibus purus.</p>
            </header>
            <a href="#main" className="button big scrolly">Learn More</a>
          </div>
        </section>
        {/* Main */}
        <div id="main">
          {/* Section */}
          <section className="wrapper style1">
            <div className="inner">
              {/* 2 Columns */}
              <div className="flex flex-2">
                <div className="col col1">
                  <div className="image round fit">
                    <a href="generic.html" className="link"><img src="images/pic01.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col col2">
                  <h3>Maecenas a gravida quam</h3>
                  <p>Etiam posuere hendrerit arcu, ac blandit nulla. Sed congue malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet, enim magna cursus auctor lacinia nunc ex blandit augue. Ut vitae neque fermentum, luctus elit fermentum, porta augue. Nullam ultricies, turpis at fermentum iaculis, nunc justo dictum dui, non aliquet erat nibh non ex.</p>
                  <p>Sed congue malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet, enim magna cursus auctor lacinia nunc ex blandit augue. Ut vitae neque fermentum, luctus elit fermentum, porta augue. Nullam ultricies, turpis at fermentum iaculis, nunc justo dictum dui, non aliquet erat nibh non ex. </p>
                  <a href="#" className="button">Learn More</a>
                </div>
              </div>
            </div>
          </section>
          {/* Section */}
          <section className="wrapper style2">
            <div className="inner">
              <div className="flex flex-2">
                <div className="col col2">
                  <h3>Suspendisse quis massa vel justo</h3>
                  <p>Etiam posuere hendrerit arcu, ac blandit nulla. Sed congue malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet, enim magna cursus auctor lacinia nunc ex blandit augue. Ut vitae neque fermentum, luctus elit fermentum, porta augue. Nullam ultricies, turpis at fermentum iaculis, nunc justo dictum dui, non aliquet erat nibh non ex.</p>
                  <p>Sed congue malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet, enim magna cursus auctor lacinia nunc ex blandit augue. Ut vitae neque fermentum, luctus elit fermentum, porta augue. Nullam ultricies, turpis at fermentum iaculis, nunc justo dictum dui, non aliquet erat nibh non ex. </p>
                  <a href="#" className="button">Learn More</a>
                </div>
                <div className="col col1 first">
                  <div className="image round fit">
                    <a href="generic.html" className="link"><img src="images/pic02.jpg" alt="" /></a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Section */}
          <section className="wrapper style1">
            <div className="inner">
              <header className="align-center">
                <h2>Aliquam ipsum purus dolor</h2>
                <p>Cras sagittis turpis sit amet est tempus, sit amet consectetur purus tincidunt.</p>
              </header>
              <div className="flex flex-3">
                <div className="col align-center">
                  <div className="image round fit">
                    <img src="images/pic03.jpg" alt="" />
                  </div>
                  <p>Sed congue elit malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet. </p>
                  <a href="#" className="button">Learn More</a>
                </div>
                <div className="col align-center">
                  <div className="image round fit">
                    <img src="images/pic05.jpg" alt="" />
                  </div>
                  <p>Sed congue elit malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet. </p>
                  <a href="#" className="button">Learn More</a>
                </div>
                <div className="col align-center">
                  <div className="image round fit">
                    <img src="images/pic04.jpg" alt="" />
                  </div>
                  <p>Sed congue elit malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet. </p>
                  <a href="#" className="button">Learn More</a>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Footer */}
        <footer id="footer">
          <div className="copyright">
            <ul className="icons">
              <li><a href="#" className="icon fa-twitter"><span className="label">Twitter</span></a></li>
              <li><a href="#" className="icon fa-facebook"><span className="label">Facebook</span></a></li>
              <li><a href="#" className="icon fa-instagram"><span className="label">Instagram</span></a></li>
              <li><a href="#" className="icon fa-snapchat"><span className="label">Snapchat</span></a></li>
            </ul>
            <p>© Untitled. All rights reserved. Design: <a href="https://templated.co">TEMPLATED</a>. Images: <a href="https://unsplash.com">Unsplash</a>.</p>
          </div>
        </footer>
        {/* Scripts */}
      </div>
    );
  }
});


class App extends Component {
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
								<h1>This is Urban</h1>
								<p>Aliquam libero augue varius non odio nec faucibus congue<br />felis quisque a diam rutrum tempus massa accumsan faucibus purus.</p>
							</header>
							<a href="#main" class="button big scrolly">Learn More</a>
						</div>
					</section>

				{/*<!-- Main -->*/}
					<div id="main">

						{/*<!-- Section -->*/}
							<section class="wrapper style1">
								<div class="inner">
									{/*<!-- 2 Columns -->*/}
										<div class="flex flex-2">
											<div className="App">
												<RefereeingUI > </RefereeingUI >
											</div>
										</div>
								</div>
							</section>

						{/*<!-- Section -->*/}
							<section class="wrapper style2">
								<div class="inner">
									<div class="flex flex-2">
										<div class="col col2">
											<h3>Suspendisse quis massa vel justo</h3>
											<p>Etiam posuere hendrerit arcu, ac blandit nulla. Sed congue malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet, enim magna cursus auctor lacinia nunc ex blandit augue. Ut vitae neque fermentum, luctus elit fermentum, porta augue. Nullam ultricies, turpis at fermentum iaculis, nunc justo dictum dui, non aliquet erat nibh non ex.</p>
											<p>Sed congue malesuada nibh, a varius odio vehicula aliquet. Aliquam consequat, nunc quis sollicitudin aliquet, enim magna cursus auctor lacinia nunc ex blandit augue. Ut vitae neque fermentum, luctus elit fermentum, porta augue. Nullam ultricies, turpis at fermentum iaculis, nunc justo dictum dui, non aliquet erat nibh non ex. </p>
											<a href="#" class="button">Learn More</a>
										</div>
										<div class="col col1 first">
											<div class="image round fit">
												<a href="generic.html" class="link"><img src="images/pic02.jpg" alt="" /></a>
											</div>
										</div>
									</div>
								</div>
							</section>

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

				{/*<!-- Scripts -->
					// <script src="assets/js/jquery.min.js"></script>
					// <script src="assets/js/jquery.scrolly.min.js"></script>
					// <script src="assets/js/jquery.scrollex.min.js"></script>
					// <script src="assets/js/skel.min.js"></script>
					// <script src="assets/js/util.js"></script>
					// <script src="assets/js/main.js"></script>
				*/}	
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/jquery.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/jquery.scrolly.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/jquery.scrollex.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/skel.min.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/util.js" />
					<ScriptTag isHydrating={true} type="text/javascript" src="assets/js/main.js" />
			
			</body>
		</html>
    );
  }
}
export default App;