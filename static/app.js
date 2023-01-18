
let total_score = 0;
let time_left = 60;

const guessed_words = new Set();

function updateScore(word) {
    total_score += word.length;
    const score_area = document.getElementById('score');

    score_area.innerText=total_score;
}

async function submitWord(evt) {
    evt.preventDefault();
    let guessedWord = document.getElementById('guess_text').value;

    const word_result = await axios.get('/guess',{params:{guess:guessedWord}});

    if (word_result.data.result === 'ok' && !guessed_words.has(guessedWord)) {
        updateScore(guessedWord);
        guessed_words.add(guessedWord);
        }
    
    const last_guess = document.getElementById('last_guess');
    last_guess.innerText = `${guessedWord} was: ${word_result.data.result}`;

    const txt = document.getElementById('guess_text');
    guess_text.value='';
}

const guessform = document.getElementById('guess_form');

guessform.addEventListener('submit', submitWord, false);

const timer = setInterval(tick,1000);

tmr = document.getElementById('timer');
tmr.innerText = time_left;

function update_timer(secs_left) {
    tmr = document.getElementById('timer');
    tmr.innerText = secs_left;
}

async function endGame(score) {
    res = await axios.get('/end_game',{params:{last_score:score}});

    record = res.data.new_record;
    let gc = document.getElementById('game_count');
    gc.innerText = res.data.times_played;

    let hs = document.getElementById('high_score');
    hs.innerText = res.data.high_score;
    if(record==='yes') {
        const record_text = document.getElementById('new_record');

        record_text.innerText="New Record!";
    } else {
        const record_text = document.getElementById('new_record');

        record_text.innerText="Good effort, but not a new record!";
    }
}

function tick(){
    time_left -= 1;
    update_timer(time_left);

    if (time_left===0) {
        clearInterval(timer);
        submitForm = document.getElementById('guess_form');
        submitForm.style.display="none";

        score_text = document.getElementById('score_text');
        score_text.innerText='Final Score: ';
        endGame(total_score);
    }
}