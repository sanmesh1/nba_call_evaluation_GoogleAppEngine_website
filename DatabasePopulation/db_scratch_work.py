#db.py
import os
import pymysql
from flask import jsonify
import pdb
import pandas as pd
import numpy as np

tableName = "main_refereeV3"

CLOUD_SQL_USERNAME = "root"
CLOUD_SQL_PASSWORD = "9Sanmesh4!!"
CLOUD_SQL_DATABASE_NAME = "nba_referee_db"
CLOUD_SQL_CONNECTION_NAME = "original-spider-273806:us-central1:a"
GAE_ENV = 'standard'
  
db_user = CLOUD_SQL_USERNAME#os.environ.get('CLOUD_SQL_USERNAME')
db_password = CLOUD_SQL_PASSWORD#os.environ.get('CLOUD_SQL_PASSWORD')
db_name = CLOUD_SQL_DATABASE_NAME# os.environ.get('CLOUD_SQL_DATABASE_NAME')
db_connection_name = CLOUD_SQL_CONNECTION_NAME#os.environ.get('CLOUD_SQL_CONNECTION_NAME')


def open_connection():
    unix_socket = '/cloudsql/{}'.format(db_connection_name)
    try:
        #if os.environ.get('GAE_ENV') == 'standard':
        if GAE_ENV == 'standard':
            conn = pymysql.connect(user=db_user, password=db_password,
                                unix_socket=unix_socket, db=db_name,
                                cursorclass=pymysql.cursors.DictCursor
                                )
    except pymysql.MySQLError as e:
        print(e)

    return conn


def scratch_work_database():
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('SELECT DISTINCT committing_player FROM ' + tableName +';')
        game_referee_info = cursor.fetchall()
        if result > 0:
            got_game_referee_info = jsonify(game_referee_info)
        else:
            got_game_referee_info = 'No games in DB'
    conn.close()
    pdb.set_trace()
    print(got_game_referee_info)

def turnDataFrameIntoDictionaryOfDictionaries(df):
    df_old_player_table = pd.read_csv('player_table_v2.csv')
    dict_of_player_dict = {}
    for index, row in df_old_player_table.iterrows():
        # pdb.set_trace()
        dictionified = row.to_dict()
        dictionified.pop("Unnamed: 0")
        dict_of_player_dict[row['PlayerName']] = dictionified
    return dict_of_player_dict
    
def populate_player_tables_based_on_csv():

    #load main csv file
    df_input = pd.read_csv('2018-19.csv')
    df_old_player_table = pd.read_csv('player_table_v2.csv')
    
    #create new dataframe
    dataColumns = ['PlayerName', 'Committing_CC', 'Committing_IC', 'Committing_CNC', 
'Committing_INC', 'Disadvantaged_CC', 'Disadvantaged_IC', 
'Disadvantaged_CNC', 'Disadvantaged_INC', 'num_errors_in_favor', 
'percent_errors_in_favor', 'num_errors_against', 'percent_errors_against'
]
    df_output = pd.DataFrame(columns = dataColumns) 
    
    # pdb.set_trace()
    #get unique player names
    unique_player_names_commiting = df_input["committing_player"].unique()
    unique_player_names_disadvantaged = df_input["committing_player"].unique()
    unique_player_names = np.unique(np.concatenate((unique_player_names_commiting, unique_player_names_disadvantaged), axis=0))
    
    dict_of_player_dict = turnDataFrameIntoDictionaryOfDictionaries(df_old_player_table)
    #for each player, populate fields
    
    Committing_CC = Committing_IC = Committing_CNC = Committing_INC = 0
    Disadvantaged_CC = Disadvantaged_IC = Disadvantaged_CNC = Disadvantaged_INC = 0
    i = 0
    for PlayerName  in unique_player_names_commiting:
        if PlayerName not in dict_of_player_dict.keys():
            dict_of_player_dict[PlayerName] = {'PlayerName': PlayerName, 'Committing_CC': 0, 'Committing_IC': 0, 'Committing_CNC': 0, 
            'Committing_INC': 0, 'Disadvantaged_CC': 0, 'Disadvantaged_IC': 0, 
            'Disadvantaged_CNC': 0, 'Disadvantaged_INC': 0, 'num_errors_in_favor': 0, 
            'percent_errors_in_favor': 0, 'num_errors_against': 0, 'percent_errors_against': 0
            }
    
        #get player id
        #ill worry about this later
        commiting_rows = df_input.loc[df_input['committing_player'] == PlayerName]

        for index, row in commiting_rows.iterrows():
            review_decision = row['review_decision']
            if review_decision == 'CC':
                dict_of_player_dict[PlayerName]["Committing_CC"] += 1
            elif review_decision == 'IC':
                dict_of_player_dict[PlayerName]["Committing_IC"] += 1
            elif review_decision == 'CNC':
                dict_of_player_dict[PlayerName]["Committing_CNC"] += 1
            elif review_decision == 'INC':
                dict_of_player_dict[PlayerName]["Committing_INC"] += 1

        print(i)
        i+= 1
        
    i = 0
    for PlayerName in unique_player_names_disadvantaged:
        if PlayerName not in dict_of_player_dict.keys():
            dict_of_player_dict[PlayerName] = {'PlayerName': PlayerName, 'Committing_CC': 0, 'Committing_IC': 0, 'Committing_CNC': 0, 
            'Committing_INC': 0, 'Disadvantaged_CC': 0, 'Disadvantaged_IC': 0, 
            'Disadvantaged_CNC': 0, 'Disadvantaged_INC': 0, 'num_errors_for': 0, 
            'percent_errors_for': 0, 'num_errors_against': 0, 'percent_errors_against': 0
            }
    
        #get player id
        #ill worry about this later
        commiting_rows = df_input.loc[df_input['disadvantaged_player'] == PlayerName]

        for index, row in commiting_rows.iterrows():
            review_decision = row['review_decision']
            if review_decision == 'CC':
                dict_of_player_dict[PlayerName]["Disadvantaged_CC"] += 1
            elif review_decision == 'IC':
                dict_of_player_dict[PlayerName]["Disadvantaged_IC"] += 1
            elif review_decision == 'CNC':
                dict_of_player_dict[PlayerName]["Disadvantaged_CNC"] += 1
            elif review_decision == 'INC':
                dict_of_player_dict[PlayerName]["Disadvantaged_INC"] += 1
        print(i)
        i += 1
    #Disadvantaged_CC = Disadvantaged_IC = Disadvantaged_CNC = Disadvantaged_INC
    
    
    for PlayerName in dict_of_player_dict.keys():
        totalCalls = (dict_of_player_dict[PlayerName]["Committing_CC"] + dict_of_player_dict[PlayerName]["Committing_IC"]
        + dict_of_player_dict[PlayerName]["Committing_CNC"] + dict_of_player_dict[PlayerName]["Committing_INC"]
        + dict_of_player_dict[PlayerName]["Disadvantaged_CC"] + dict_of_player_dict[PlayerName]["Disadvantaged_IC"]
        + dict_of_player_dict[PlayerName]["Disadvantaged_CNC"] + dict_of_player_dict[PlayerName]["Disadvantaged_INC"])
        
        dict_of_player_dict[PlayerName]["num_errors_in_favor"] = dict_of_player_dict[PlayerName]["Committing_INC"] + dict_of_player_dict[PlayerName]["Disadvantaged_IC"]
        dict_of_player_dict[PlayerName]["num_errors_against"] = dict_of_player_dict[PlayerName]["Committing_IC"] + dict_of_player_dict[PlayerName]["Disadvantaged_INC"]
        # pdb.set_trace()
        
        if totalCalls != 0:
            dict_of_player_dict[PlayerName]["percent_errors_in_favor"] = round(float(dict_of_player_dict[PlayerName]["num_errors_in_favor"])/totalCalls*100, 2)
            dict_of_player_dict[PlayerName]["percent_errors_against"] = round(float(dict_of_player_dict[PlayerName]["num_errors_against"])/totalCalls*100, 2)
        else:
            dict_of_player_dict[PlayerName]["percent_errors_in_favor"] = 0
            dict_of_player_dict[PlayerName]["percent_errors_against"] = 0
        
        df_output = df_output.append(dict_of_player_dict[PlayerName], ignore_index = True)
    
    df_output.to_csv("player_table_v3.csv")
    
    

    
def get_songs():
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('SELECT * FROM songs;')
        songs = cursor.fetchall()
        if result > 0:
            got_songs = jsonify(songs)
        else:
            got_songs = 'No Songs in DB'
    conn.close()
    return got_songs

def add_songs(song):
    conn = open_connection()
    with conn.cursor() as cursor:
        cursor.execute('INSERT INTO songs (title, artist, genre) VALUES(%s, %s, %s)', (song["title"], song["artist"], song["genre"]))
    conn.commit()
    conn.close()

def get_game_referee_info():
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('SELECT * FROM ' + tableName +';')
        game_referee_info = cursor.fetchall()
        if result > 0:
            got_game_referee_info = jsonify(game_referee_info)
        else:
            got_game_referee_info = 'No games in DB'
    conn.close()
    return got_game_referee_info
    
def add_game_referee_info(game_referee_data_point):
    conn = open_connection()
    num_fields = 19
    variable_string = 'VALUES('+'%s, ' * (num_fields-1)+ '%s)'
    temp = ("INSERT INTO " + tableName + " " +
      "(UniqueIdPlay, GameId, GameDate, link_2minreport, " +
      "Home_team, Away_team, HomeTeamScore, " +
      "VisitorTeamScore, CallType, committing_player, " + 
      "committing_team, disadvantaged_player, disadvantaged_team, " +
      "review_decision, video_link, comment, " +
      "season, Difficulty, PCTime) " +
      variable_string)
    with conn.cursor() as cursor:
        cursor.execute(temp, (game_referee_data_point["UniqueIdPlay"], game_referee_data_point["GameId"], game_referee_data_point["GameDate"], game_referee_data_point["link_2minreport"],
        game_referee_data_point["Home_team"],game_referee_data_point["Away_team"],game_referee_data_point["HomeTeamScore"],
        game_referee_data_point["VisitorTeamScore"],game_referee_data_point["CallType"],game_referee_data_point["committing_player"],
        game_referee_data_point["committing_team"],game_referee_data_point["disadvantaged_player"],game_referee_data_point["disadvantaged_team"],
        game_referee_data_point["review_decision"],game_referee_data_point["video_link"],game_referee_data_point["comment"],
        game_referee_data_point["season"],game_referee_data_point["Difficulty"],game_referee_data_point["PCTime"]))
    conn.commit()
    conn.close()
    
def get_game_referee_info_filtered(filter_type, filter_param):
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('SELECT * FROM ' + tableName + ' WHERE ' + filter_type +' = '+ filter_param +';')
        game_referee_info = cursor.fetchall()
        if result > 0:
            got_game_referee_info = jsonify(game_referee_info)
        else:
            got_game_referee_info = 'No games match parameters'
    conn.close()
    return got_game_referee_info

def delete_all_table_data_db():
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('DELETE FROM '+tableName+';')
    conn.commit()
    conn.close()
    return None #add code to make it return status of success
    
def delete_data_db(filter_type, filter_param):
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('DELETE FROM ' + tableName + ' WHERE ' + filter_type + '=' + filter_param + ';')
    conn.commit()
    conn.close()
    return None #add code to make it return status of success

    #DELETE FROM main_referee WHERE gameId=0021900244;
    #DELETE FROM main_referee;
    
if __name__ == '__main__':
    # scratch_work_database()
    populate_player_tables_based_on_csv()