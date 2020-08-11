const CwnQuery = {
  posLabels: {},
  data() {
    return {
      queryWord: "",
      counter: 15,
      senseData: [],
      showFullExamples: {}
    }
  },

  mounted() {
    // use when debugging
    this.querySenseData("樹");
    CwnDataIO.fetchPosLabels().then((data)=>{
      this.posLabels = data;      
    });    
  },
  methods: {
    toShowFullExamples(cwnid){      
      return (cwnid in this.showFullExamples)? 
        this.showFullExamples[cwnid]: false;
    },

    toggleShowFullExamples(cwnid) {            
      this.showFullExamples[cwnid] = cwnid in this.showFullExamples?
        !this.showFullExamples[cwnid]: true;
    },

    querySenseData(word) {
      CwnDataIO.fetchWordData(word).then(data => {
        console.log("sense data");
        console.log(data);
        this.senseData = data;        
      }).catch((err) => {
        console.error(err);        
      });
    },
    onQuerWordKeyup(ev) {
      if (ev.key === "Enter") {
        const word = ev.target.value;
        this.querySenseData(word);
      }
    }
  }

};

const CwnRelation = {
  data() {
    return {
      labels: CwnDataIO.relation_labels
    }
  },  
  props: ['relation', 'sense'],
  template: `
  <div class="relation-wrapper
    w3-tag w3-dark-gray w3-small w3-margin-right" v-if="relation in sense.relations">
    {{this.labels[relation]}}    
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
      Object.values(pos_label_data).map((x)=>[x["pos"], x["label"]]));    
    return posLabels;
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
