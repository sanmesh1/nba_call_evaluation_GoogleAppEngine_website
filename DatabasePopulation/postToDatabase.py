import requests
from flask import jsonify

url = 'https://original-spider-273806.ue.r.appspot.com/post_data'
myobj = {
    "gameId": "7657567",
    "date": "",
    "link_2minreport": "",
    "home_team": "",
    "away_team": "",
    "home_team_score": "",
    "away_team_score": "",
    "call_type": "",
    "committing_player": "",
    "committing_team": "",
    "disadvantaged_player": "",
    "disadvantaged_team": "",
    "review_decision": "",
    "video_link": "",
    "comment": ""
}

x = requests.post(url, json = myobj)

print(x.text)