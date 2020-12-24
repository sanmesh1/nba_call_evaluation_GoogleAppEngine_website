import requests
from flask import jsonify
import pdb
import pandas as pd
import time

def postDataToDatabase(url, myobj):
	x = requests.post(url, json = myobj)
	return x


df = pd.read_csv('2019-20.csv')
# pdb.set_trace()

url = 'https://original-spider-273806.ue.r.appspot.com/post_data'
iter = 0
for index, row in df.iterrows():
	if iter < 2600:
		iter+= 1
		continue
	myobj = {
	"UniqueIdPlay": row["UniqueIdPlay"],
	"GameId": row["GameId"],
	"GameDate": row["GameDate"],
	"link_2minreport": row["link_2minreport"],
	"Home_team": row["Home_team"],
	"Away_team": row["Away_team"],
	"HomeTeamScore": row["HomeTeamScore"],
	"VisitorTeamScore": row["VisitorTeamScore"],
	"CallType": row["CallType"],
	"committing_player": row["committing_player"],
	"committing_team": row["committing_team"],
	"disadvantaged_player": row["disadvantaged_player"],
	"disadvantaged_team": row["disadvantaged_team"],
	"review_decision": row["review_decision"],
	"video_link": row["video_link"],
	"comment": row["comment"],
	"season": row["season"],
	"Difficulty": row["Difficulty"],
	"PCTime": row["PCTime"]
	}
	x = postDataToDatabase(url, myobj)
	if iter%50 == 0:
		print(iter, ": ", row["GameId"], " ", x.text)
		time.sleep(0.01)
	iter+= 1

