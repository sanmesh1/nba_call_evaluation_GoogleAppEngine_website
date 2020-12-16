#db.py
import os
import pymysql
from flask import jsonify

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
        result = cursor.execute('SELECT * FROM main_referee;')
        game_referee_info = cursor.fetchall()
        if result > 0:
            got_game_referee_info = jsonify(game_referee_info)
        else:
            got_game_referee_info = 'No games in DB'
    conn.close()
    return got_game_referee_info
    
def add_game_referee_info(game_referee_data_point):
    conn = open_connection()
    num_fields = 18
    variable_string = 'VALUES('+'%s, ' * (num_fields-1)+ '%s)'
    temp = ("INSERT INTO main_referee "
      "(GameId, GameDate, link_2minreport, "
      "Home_team, Away_team, HomeTeamScore, "
      "VisitorTeamScore, CallType, committing_player, " 
      "committing_team, disadvantaged_player, disadvantaged_team, "
      "review_decision, video_link, comment, "
      "season, Difficulty, PCTime) "
    ) + variable_string
    with conn.cursor() as cursor:
        cursor.execute(temp, (game_referee_data_point["GameId"], game_referee_data_point["GameDate"], game_referee_data_point["link_2minreport"],
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
        result = cursor.execute('SELECT * FROM main_referee WHERE ' + filter_type +' = '+ filter_param +';')
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
        result = cursor.execute('DELETE FROM main_referee;')
    conn.commit()
    conn.close()
    return None #add code to make it return status of success
    
def delete_data_db(filter_type, filter_param):
    conn = open_connection()
    with conn.cursor() as cursor:
        result = cursor.execute('DELETE FROM main_referee WHERE ' + filter_type + '=' + filter_param + ';')
    conn.commit()
    conn.close()
    return None #add code to make it return status of success

    #DELETE FROM main_referee WHERE gameId=0021900244;
    #DELETE FROM main_referee;