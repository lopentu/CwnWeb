// Capture input sentences
/*
const form = document.querySelector('#input-sent');
const input = document.querySelector('#sense-tagger-input');
or
const input = input-sent.elements.input.value;
form.addEventListener('submit', function (e) {
    // e.preventDefault();
    const sent = input.value;
})
*/

// 他回到家，一開了門，就放首歌來聽
console.log('hi');

// Read testing json file
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

// Turn all the input tokens into buttons
const displayToken = async () => {

    const lemmas = await getResult('./sense-tagger-test.json', 0);
    const poss = await getResult('./sense-tagger-test.json', 1);
    const glosss = await getResult('./sense-tagger-test.json', 3);

    const outputToken = document.querySelector('#output-tokens');
    let sent = document.createElement('div');
    sent.setAttribute('class', 'output-sent');

    if (document.getElementById('output-tokens').textContent.length == 0) {

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

            if (glosss[i] == '') {
                gloss.innerHTML = '無該字詞';
            } else {
                gloss.innerHTML = glosss[i];
            }
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

// testing
const input = document.getElementById('sense-tagger-input');
input.addEventListener('click', function () { console.log('it works') });

// Create cards for sense tagging result
const displaySenseCard = async () => {

    const senseCard = document.querySelector('#all-sense-cards');

    const lemmas = await getResult('./sense-tagger-test.json', 0);
    const poss = await getResult('./sense-tagger-test.json', 1);
    const glosss = await getResult('./sense-tagger-test.json', 3);

    let sent = document.createElement('div');
    sent.setAttribute('class', 'output-sent');

    for (i = 0; i < lemmas.length; i++) {
        let card = document.createElement('div');
        let lemmaPos = document.createElement('div');
        let wrapper = document.createElement('div');
        let card_id = 'tokens' + i;

        card.setAttribute('class', 'card w3-padding w3-display-container');
        card.setAttribute('id', card_id);
        lemmaPos.setAttribute('class', 'lemma-pos');
        wrapper.setAttribute('class', 'w3-col l2 m3 s6 w3-padding');

        let lemma = document.createElement('div');
        let pos = document.createElement('div');
        let gloss = document.createElement('div');
        let queryButton = document.createElement('button');

        lemma.innerHTML = lemmas[i];
        lemma.setAttribute('class', 'lemma');
        pos.innerHTML = poss[i];
        pos.setAttribute('class', 'pos');
        queryButton.innerHTML = '前往字詞查詢';
        queryButton.setAttribute('class', 'query-button w3-display-bottomright');

        if (glosss[i] == '') {
            gloss.innerHTML = '無該字詞';
        } else {
            gloss.innerHTML = glosss[i];
        }
        gloss.setAttribute('class', 'gloss');

        lemmaPos.appendChild(lemma);
        lemmaPos.appendChild(pos);
        lemmaPos.appendChild(queryButton);
        card.appendChild(lemmaPos);
        card.appendChild(gloss);
        wrapper.appendChild(card);
        sent.appendChild(wrapper);
    }

    senseCard.append(sent);
    senseCard.append(document.createElement('br'));
    return senseCard;
}

// Ｃheckbox: display all sense tagging results at once
const displayAll = async () => {

    if (document.querySelector('#all-sense-cards').textContent.length == 0) {
        displaySenseCard();
    }

    let checkbox = document.querySelector('#display-all-button');
    let content = document.querySelector('#all-sense-cards');

    if (checkbox.checked == true) {
        content.setAttribute('style', 'block');
    }
    else if (checkbox.checked == false) {
        content.setAttribute('style', 'display:none');
    }

}

