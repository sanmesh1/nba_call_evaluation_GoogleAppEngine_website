import requests
from flask import jsonify

url = 'https://original-spider-273806.ue.r.appspot.com/post_data'
myobj = {
	"UniqueIdPlay": "124",
	"GameId": "543432",
	"GameDate": "2019-11-15T00:00:00",
	"link_2minreport" : "",
	"Home_team": "",
	"Away_team": "",
	"HomeTeamScore": "123",
	"VisitorTeamScore": "123",
	"CallType": "",
	"committing_player": "",
	"committing_team": "",
	"disadvantaged_player": "",
	"disadvantaged_team": "",
	"review_decision": "",
	"video_link": "",
	"comment": "",
	"season": "",
	"Difficulty": "",
	"PCTime": "00:01:56"
}

x = requests.post(url, json = myobj)

print(x.text)