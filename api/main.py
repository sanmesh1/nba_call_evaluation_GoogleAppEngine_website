#main.py
from flask import Flask, jsonify, request
from db import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/songs', methods=['POST', 'GET'])
def songs():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400  

        add_songs(request.get_json())
        return 'Song Added'

    return get_songs()

@app.route('/', methods=['GET'])
def referee():
    return get_game_referee_info()
    
@app.route('/get_data', methods=['GET'])
def get_data():
    return get_game_referee_info()
    
@app.route('/post_data', methods=['POST', 'GET'])
def post_data():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400  

    add_game_referee_info(request.get_json())
    return 'game Added'
    
@app.route('/get_data/<filter_type>/<filter_param>', methods=['GET'])
def get_data_filtered(filter_type = None, filter_param = None):
    if filter_type == None or filter_param == None:
        return jsonify({"msg": "Missing one of params"}), 400
    return get_game_referee_info_filtered(filter_type, filter_param)
    
@app.route('/get_plays_of_errors_against_individuals/<individualName>', methods=['GET'])
def get_plays_of_errors_against_individuals(individualName = None):
    if individualName == None:
        return jsonify({"msg": "Missing one of params"}), 400
    return get_plays_of_errors_against_individuals_db(individualName)

@app.route('/delete_all_table_data', methods=['DELETE'])
def delete_all_table_data():
    isSuccessful = delete_all_table_data_db()
    return 'Deletion of all data'   

@app.route('/delete_data/<filter_type>/<filter_param>', methods=['DELETE'])
def delete_data(filter_type = None, filter_param = None):
    if filter_type == None or filter_param == None:
        return jsonify({"msg": "Missing one of params"}), 400
    isSuccessful = delete_data_db(filter_type, filter_param)  
    return 'Deletion of particular data'

@app.route('/get_player_referee_accuracies_data', methods=['GET'])
def get_player_referee_accuracies_data():
    return get_player_referee_accuracies_data_db()
    
@app.route('/post_player_referee_accuracies_data', methods=['POST'])
def post_player_referee_accuracies_data():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400  

    post_player_referee_accuracies_data_db(request.get_json())
    return 'player data Added'
    
@app.route('/delete_player_referee_accuracies_data', methods=['DELETE'])
def delete_player_referee_accuracies_data():
    isSuccessful = delete_player_referee_accuracies_data_db()
    return 'Deletion of all data'   
    
if __name__ == '__main__':
    app.run()
