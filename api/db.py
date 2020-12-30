#db.py
import os
import pymysql
from flask import jsonify

tableName = "main_refereeV3"
player_referee_accuracies_tableName = "player_referee_accuracies"

db_user = os.environ.get('CLOUD_SQL_USERNAME')
db_password = os.environ.get('CLOUD_SQL_PASSWORD')
db_name = os.environ.get('CLOUD_SQL_DATABASE_NAME')
db_connection_name = os.environ.get('CLOUD_SQL_CONNECTION_NAME')


def open_connection():
    unix_socket = '/cloudsql/{}'.format(db_connection_name)
    try:
        if os.environ.get('GAE_ENV') == 'standard':
            conn = pymysql.connect(user=db_user, password=db_password,
                                unix_socket=unix_socket, db=db_name,
                                cursorclass=pymysql.cursors.DictCursor
                                )
    except pymysql.MySQLError as e:
        print(e)

    return conn


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

    
def get_plays_of_errors_against_individuals_db(individualName):
    conn = open_connection()
    with conn.cursor() as cursor:
        #SELECT * FROM main_refereeV3 WHERE (disadvantaged_player = 'Luka Doncic' AND review_decision = 'INC') OR (committing_player = 'Luka Doncic' AND review_decision = 'IC');
        result = cursor.execute('SELECT * FROM ' + tableName + ' WHERE (disadvantaged_player = \'' + individualName +'\' AND review_decision = \'INC\') OR (committing_player = \''+ individualName +'\' AND review_decision = \'IC\');')
        game_referee_info = cursor.fetchall()
        if result > 0:
            got_game_referee_info = jsonify(game_referee_info)
        else:
            got_game_referee_info = 'No plays match parameters'
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
    
def get_player_referee_accuracies_data_db():
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('SELECT * FROM ' + player_referee_accuracies_tableName +';')
        game_referee_info = cursor.fetchall()
        if result > 0:
            got_game_referee_info = jsonify(game_referee_info)
        else:
            got_game_referee_info = 'No player data in DB'
    conn.close()
    return got_game_referee_info

def post_player_referee_accuracies_data_db(game_referee_data_point):
    conn = open_connection()
    num_fields = 13
    variable_string = 'VALUES('+'%s, ' * (num_fields-1)+ '%s)'
    temp = ("INSERT INTO " + player_referee_accuracies_tableName + " " +
      "(PlayerName, Committing_CC, Committing_IC, Committing_CNC, " +
      "Committing_INC, Disadvantaged_CC, Disadvantaged_IC, " +
      "Disadvantaged_CNC, Disadvantaged_INC, num_errors_in_favor, " + 
      "percent_errors_in_favor, num_errors_against, percent_errors_against) " +
      variable_string)
    with conn.cursor() as cursor:
        cursor.execute(temp, (game_referee_data_point["PlayerName"], game_referee_data_point["Committing_CC"], game_referee_data_point["Committing_IC"], game_referee_data_point["Committing_CNC"],
        game_referee_data_point["Committing_INC"],game_referee_data_point["Disadvantaged_CC"],game_referee_data_point["Disadvantaged_IC"],
        game_referee_data_point["Disadvantaged_CNC"],game_referee_data_point["Disadvantaged_INC"],game_referee_data_point["num_errors_in_favor"],
        game_referee_data_point["percent_errors_in_favor"],game_referee_data_point["num_errors_against"],game_referee_data_point["percent_errors_against"]))
    conn.commit()
    conn.close()

def delete_player_referee_accuracies_data_db():
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('DELETE FROM '+player_referee_accuracies_tableName+';')
    conn.commit()
    conn.close()
    return None #add code to make it return status of success