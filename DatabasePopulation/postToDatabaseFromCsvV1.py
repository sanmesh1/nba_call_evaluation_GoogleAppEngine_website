import requests
from flask import jsonify

url = 'https://original-spider-273806.ue.r.appspot.com/post_data'
myobj = {
    "gameId": "123",
    "date": "rap",
    "link_2minreport": "Tedt",
    "home_team": "Rockstar",
    "away_team": "Rockstar",
    "home_team_score": "Rockstar",
    "away_team_score": "Rockstar",
    "call_type": "Rockstar",
    "committing_player": "Rockstar",
    "committing_team": "Rockstar",
    "disadvantaged_player": "Rockstar",
    "disadvantaged_team": "Rockstar",
    "review_decision": "Rockstar",
    "video_link": "Rockstar",
    "comment": "Rockstar"
}

x = requests.post(url, json = myobj)

print(x.text)