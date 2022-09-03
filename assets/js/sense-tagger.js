const requestApi = async (url) => {
    try {
        const res = await axios.get(url);
        const out = await res.data;
        return out;
    } catch (e) {
        console.log('ERROR!!!');
        console.log(e);
    }
}
// Turn all the input tokens into buttons
const displayToken = async (lemmas, poss, glosss) => {

    const outputToken = document.querySelector('#output-tokens');
    let sent = document.createElement('div');
    sent.setAttribute('class', 'output-sent');

    if (outputToken.textContent.length == 0) {

        for (i = 0; i < lemmas.length; i++) {
            const length = lemmas.length;
            const token = document.createElement('button');
            let id = 'tokens' + i;
            token.setAttribute('class', 'tokens');
            token.innerHTML = lemmas[i];

            // only the clicked button shows its sense card
            token.addEventListener("click", function () {
                for (j = 0; j < length; j++) {
                    let id1 = 'tokens' + j;
                    let d1 = document.getElementById(id1);
                    d1.setAttribute('style', 'display:none');
                }
                let d = document.getElementById(id);
                d.removeAttribute('style');
                d.setAttribute('background-color', 'rgb(84, 175, 188)');
            });
            sent.append(token);
        }

        let card = document.createElement('div');
        // create the sense cards
        for (i = 0; i < lemmas.length; i++) {
            let output = document.createElement('div');
            let lemmaPos = document.createElement('div');
            let id = 'tokens' + i;
            output.setAttribute('style', 'display:none');
            output.setAttribute('id', id);

            let lemma = document.createElement('div');
            let pos = document.createElement('div');
            let gloss = document.createElement('div');
            lemma.innerHTML = lemmas[i];
            lemma.setAttribute('class', 'lemma');
            pos.innerHTML = poss[i];
            pos.setAttribute('class', 'pos');
            gloss.innerHTML = glosss[i];
            gloss.setAttribute('class', 'gloss');
            output.setAttribute('class', 'card-unique');
            lemmaPos.setAttribute('class', 'lemma-pos');

            lemmaPos.appendChild(lemma);
            lemmaPos.appendChild(pos);
            output.appendChild(lemmaPos);
            output.appendChild(gloss);
            card.appendChild(output);
        }

        outputToken.appendChild(sent);
        outputToken.appendChild(card);

    }
    return outputToken;
}

// Ｃheckbox: display all sense tagging results at once
const displayAll = () => {

    const cards = document.querySelectorAll('.card-unique');
    let checkbox = document.querySelector('#display-all-button');

    if (checkbox.checked == true) {
        for (let card of cards) {
            card.removeAttribute('style');
            card.setAttribute('style', 'display:flex ');
            card.setAttribute('class', 'card-unique w3-col l2 m3 s6 w3-padding');
        }
    }
    else if (checkbox.checked == false) {
        for (let card of cards) {
            card.removeAttribute('style');
            card.setAttribute('style', 'display:none');
        }
    }

}

const btn = document.querySelector('#test_api');
btn.addEventListener('click', async () => {

    try {
        // first clean up the content of output-tokens (for multiple searches)
        const outputToken = document.querySelector('#output-tokens');
        outputToken.innerHTML = '';

        // Get user input
        const inputSent = document.querySelector('#tagger-input');
        const data = inputSent.value;
        // const url = `http://140.112.147.132:5655/${data}`;
        const url = `https://lopen.linguistics.ntu.edu.tw/cwntagger/${data}`;
        console.log(`Sending request to sense tagger: ${url}, please patiently wait for the result!`);
        const tagging = await requestApi(url);

        const lemmas = [], poss = [], glosss = [], senseIds = [], confidences = [];
        for (let tags of tagging) {
            console.log('Finish tagging!');
            lemmas.push(tags['lemma']);
            poss.push(tags['pos']);
            glosss.push(tags['gloss']);
            senseIds.push(tags['senseID']);
            confidences.push(tags['confidence']);
        }

        return displayToken(lemmas, poss, glosss);

    } catch (e) {
        console.log('ERROR!!!');
        console.log(e);
    }

});

/*
// Testing json file
const getResult = async (url, position) => {

    var result = {
        length: 0,
        addElem: function addElem(elem) {
            [].push.call(this, elem);
        }
    }

    try {
        const res = await axios.get(url);
        const jsonFile = res.data.data;
        for (i = 0; i < jsonFile[0].length; i++) {
            const lem = jsonFile[0][i][position];
            result.addElem(lem);
        }
        return result;

    } catch (e) {
        console.log('ERROR', e);
    }
}
*/