from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class testing(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_home(self):
        with self.client as client:
            res = self.client.get('/')

            self.assertIn('high_score',session)
            self.assertEqual(session['high_score'],0)
            self.assertIn(b'<form name',res.data)

    def test_word_check(self):
        with self.client as client:
            with client.session_transaction() as st:
                st['board'] = [['B','X','X','X','X'],
                              ['X','I','X','X','X'],
                              ['X','X','K','X','X'],
                              ['X','X','X','E','X'],
                              ['X','X','X','X','S']]
        res = self.client.get('/guess?guess=bike')
        self.assertEqual(res.json['result'],'ok')

    def test_hs(self):
        with self.client as client:
            with client.session_transaction() as st:
                st['high_score']=17

        res = self.client.get('/hs')
        self.assertEqual(res.json['hs'],17)

    def test_endgame_no_new_record(self):
        with self.client as client:
            with client.session_transaction() as st:
                st['high_score']=10
                st['times_played']=5

        res = self.client.get('/end_game?last_score=5')
        self.assertEqual(res.json['new_record'],'no')

    def test_endgame_new_record(self):
        with self.client as client:
            with client.session_transaction() as st:
                st['high_score']=10
                st['times_played']=5

        res = self.client.get('/end_game?last_score=15')
        self.assertEqual(res.json['new_record'],'yes')