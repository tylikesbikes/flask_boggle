class Boggle {
    constructor (gameID, gameLength) {
        this.guessed_words = new Set();
        this.total_score = 0;
        this.time_left = gameLength;
        this.timer = setInterval(this.tick.bind(this),1000);
        this.update_timer(this.time_left);
        $('#guess_form').submit(this.submitWord.bind(this));
        this.gameID = gameID;
        this.showHighScore();
        
    }

    updateScore(word) {
        this.total_score += word.length;
        $('#score').text(this.total_score);
    }

    async showHighScore() {
        let res = await axios.get('/hs');
        let highScore = res.data.hs;

        $('#high_score').text(highScore);

    }

    async submitWord(evt) {
        evt.preventDefault();
        let guessedWord = $('#guess_text').val().toLowerCase();
    
        const word_result = await axios.get('/guess',{params:{guess:guessedWord.toLowerCase()}});
    
        if (word_result.data.result === 'ok') {
            if (!this.guessed_words.has(guessedWord)) {
            this.updateScore(guessedWord);

            $('#score').text(this.total_score);
            this.guessed_words.add(guessedWord);
            }
            }
        
        $('#last_guess').text(`${guessedWord} was: ${word_result.data.result}`);
    
        // const txt = document.getElementById('guess_text');
        $('#guess_text').val('');
    }


    update_timer(secs_left) {
        $('#timer').text(secs_left);
    }

    tick(){
        this.time_left -= 1;
        this.update_timer(this.time_left);
        
    
        if (this.time_left===0) {
            clearInterval(this.timer);
            $('#guess_form').hide();
            $('#score_text').text('Final Score: ');
            this.endGame(this.total_score);
        }
    }

    async endGame(score) {
        console.log('game over');
        let res = await axios.get('/end_game',{params:{last_score:score}});    
        let record = res.data.new_record;

        $('#game_count').text(res.data.times_played);
        $('#high_score').text(res.data.high_score);

        if(record==='yes') {
            $('#new_record').text('New Record!');
        } else {
            $('#new_record').text('Good effort, but not a new record.');
        }
    }
}