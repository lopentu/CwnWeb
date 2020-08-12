const CwnQuery = {
  posLabels: {},
  data() {
    return {
      queryWord: "",
      currentWord: "",
      counter: 15,
      senseData: [],
      senseGroups: {},
      showFullExamples: {},
      queryCursor: {}
    }
  },

  mounted() {
    // redirect if request are query
    const urlParams = new URLSearchParams(window.location.search);

    // Do not change GET parameter name of _query_ and _pos_. 
    // They are linked from external sites (e.g. E-HowNet from AI project 2020).
    const word = urlParams.get("query");
    const pos = urlParams.get("pos");
    const cwnId = urlParams.get("cwnid");    
    if (word !== null) {
      // window.location.replace("http://lope.linguistics.ntu.edu.tw/cwnvis_beta/index.php/lemmas?word=" + queryParam);
      this.queryCursor = { word, pos, cwnId };
      document.getElementById("cwn-query").scrollIntoView();
    }
    // use when debugging    
    this.queryWord = cwnQueryCursor.word ? cwnQueryCursor.word : "字";
    this.querySenseData(this.queryWord);    
    CwnDataIO.fetchPosLabels().then((data) => {
      this.posLabels = data;
    });
  },

  updated() {
    if (this.queryCursor.cwnId) {
      const el = this.$refs["sense-" + this.queryCursor.cwnId];
      if (el) {
        el.scrollIntoView();
      }
    }
  },

  methods: {
    toShowFullExamples(cwnid) {
      return (cwnid in this.showFullExamples) ?
        this.showFullExamples[cwnid] : false;
    },

    toggleShowFullExamples(cwnid) {
      this.showFullExamples[cwnid] = cwnid in this.showFullExamples ?
        !this.showFullExamples[cwnid] : true;
    },

    isSenseFocus(sense) {
      return (!this.queryCursor.cwnId && sense.pos.indexOf(this.queryCursor.pos) >= 0) ||
        (sense.cwn_id == this.queryCursor.cwnId);
    },

    querySenseData(word) {
      CwnDataIO.fetchWordData(word).then(data => {        
        this.senseData = data;        
        this.senseGroups = CwnDataIO.groupByZhuYin(data);
        // console.log(this.senseGroups);
        this.currentWord = word;
      }).catch((err) => {
        console.error(err);
      });
    },
    onQuerWordKeyup(ev) {
      if (ev.key === "Enter") {
        const word = ev.target.value;
        this.querySenseData(word);
      }
    },

    copySenseUrl(sense) {
      const senseUrl = window.location.protocol + "//"
        + window.location.host
        + window.location.pathname + "?"
        + "query=" + sense.lemma
        + "&cwnid=" + sense.cwn_id
        + "#cwn-query";
      navigator.clipboard.writeText(senseUrl).then(() => {
        console.log(senseUrl + "copied");
      }).catch((err) => {
        console.error("could not copy");
      });
    }
  }

};

const CwnRelation = {
  data() {
    const rel_senses = this.sense.relations[this.relation];
    const rel_words = rel_senses ? rel_senses.map((x) => x[0]) : [];
    return {
      labels: CwnDataIO.relation_labels,
      rel_senses,
      rel_words
    }
  },
  props: ['relation', 'sense', 'isFocus'],
  template: `
  <div v-if="rel_senses !== undefined"
    class="relation-wrapper w3-cell-row">
    <div class="w3-cell" style="width: 70px">
      <div class="tag-wrapper
        w3-tag w3-small w3-margin-right" 
        @click="$emit('on-relation-click', relation)">
        {{this.labels[relation]}}
      </div>      
    </div>
    <div class="word-wrapper w3-cell">
      <a v-for="word in rel_words" 
        style="margin-right: 8pt"
        :href="'?query=' + word + '#cwn-query'">
        {{word}}</a>
    </div>
  </div>
  `
}

const CwnDataIO = {
  async fetchWordData(word) {
    const file_idx = await fetch("cwn_web/word_map.json")
      .then((resp) => {
        return resp.json();
      }).then((data) => {
        console.log(data);
        const idx = data[word];
        return idx ? idx : null;
      }).catch((err) => {
        console.error(err)
        return null;
      });

    if (file_idx !== null) {
      const word_data = await fetch(`cwn_web/cwn_web_data_${file_idx}.json`)
        .then((resp) => {
          return resp.json()
        }).then((data) => {
          return data[word];
        }).catch((err) => {
          console.error(err);
          return [];
        });
      return word_data;
    } else {
      return [];
    }
  },

  async fetchPosLabels() {
    const resp = await fetch("cwn_web/cwn-pos-label.json");
    const pos_label_data = await resp.json();
    posLabels = Object.fromEntries(
      Object.values(pos_label_data).map((x) => [x["pos"], x["label"]]));
    return posLabels;
  },

  groupByZhuYin(senseData) {
    const senseGroups = senseData.reduce((obj, x)=>{
      const zhuyin = x.zhuyin;      
      obj[zhuyin] = obj[zhuyin] || [];
      obj[zhuyin].push(x);
      return obj;
    }, {});
    return senseGroups
  },

  relation_labels: {
    holonym: "整體詞",
    antonym: "反義詞",
    meronym: "部分詞",
    hypernym: "上位詞",
    hyponym: "下位詞",
    variant: "異體詞",
    nearsynonym: "近義詞",
    paranym: "類義詞",
    synonym: "同義詞",
    varword: "異體詞"
  }

}
