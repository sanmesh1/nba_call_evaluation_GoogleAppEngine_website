import pandas as pd
import pdb

df_old_player_table = pd.read_csv('player_table_v2.csv')
dict_of_player_dict = {}
for index, row in df_old_player_table.iterrows():
	# pdb.set_trace()
	dictionified = row.to_dict()
	dictionified.pop("Unnamed: 0")
	dict_of_player_dict[row['PlayerName']] = dictionified
print(dict_of_player_dict)