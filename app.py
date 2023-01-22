from flask import Flask, redirect, render_template, flash, session, request, jsonify
#from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "keeta"



boggle_game = Boggle()

@app.route("/")
def show_board():
    # if not session['times_played']:
    #     session['times_played']= 0
    if not session.get('times_played'):
        session['times_played'] = 0
    if not session.get('high_score'):
        session['high_score'] = 0
    board = boggle_game.make_board()
    session['board'] = board

    return render_template("board.html", board = session['board'], times_played=session['times_played'],high_score=session['high_score'])

@app.route("/guess",methods=['GET'])
def check_guess():
    guess = request.args.get('guess')
    word_check = boggle_game.check_valid_word(session['board'],guess)

    return jsonify({'result':word_check} )

@app.route('/end_game',methods=['GET'])
def end_game():

    plays = session['times_played']
    plays +=1
    session['times_played'] = plays
    high_score = session['high_score']
    last_score = int(request.args.get('last_score'))
    new_record='no'


    if last_score>high_score:
        session['high_score'] = last_score
        new_record='yes'
        
    return jsonify ({'new_record':new_record,'last_score':last_score,'high_score':session['high_score'],'times_played':plays})

@app.route('/hs',methods=['GET'])
def high_score():
    return jsonify({'hs':session['high_score']})