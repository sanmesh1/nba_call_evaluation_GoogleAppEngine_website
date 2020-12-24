import requests
from flask import jsonify
import pdb
import pandas as pd
import time

def postDataToDatabase(url, myobj):
	x = requests.post(url, json = myobj)
	return x


df = pd.read_csv('player_table.csv')
# pdb.set_trace()

url = 'https://original-spider-273806.ue.r.appspot.com/post_player_referee_accuracies_data'
iter = 0
for index, row in df.iterrows():
	# if iter < 2600:
		# iter+= 1
		# continue
	myobj = {
	"PlayerName": row["PlayerName"],
	"Committing_CC": row["Committing_CC"],
	"Committing_IC": row["Committing_IC"],
	"Committing_CNC": row["Committing_CNC"],
	"Committing_INC": row["Committing_INC"],
	"Disadvantaged_CC": row["Disadvantaged_CC"],
	"Disadvantaged_IC": row["Disadvantaged_IC"],
	"Disadvantaged_CNC": row["Disadvantaged_CNC"],
	"Disadvantaged_INC": row["Disadvantaged_INC"],
	"num_errors_in_favor": row["num_errors_in_favor"],
	"percent_errors_in_favor": row["percent_errors_in_favor"],
	"num_errors_against": row["num_errors_against"],
	"percent_errors_against": row["percent_errors_against"]
	}
	x = postDataToDatabase(url, myobj)
	if iter%50 == 0:
		print(iter, ": ", row["PlayerName"], " ", x.text)
		time.sleep(0.01)
	iter+= 1

