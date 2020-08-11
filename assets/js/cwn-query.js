const CwnQuery = {
  data() {
    return {
      queryWord: "",
      counter: 15,
      senseData: []
    }
  },

  mounted() {
    // use when debugging
    this.querySenseData("字");
  },
  methods: {
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

const CwnDataIO = {
  async fetchWordData(word) {
    const file_idx = await fetch("cwn_web/word_map.json")
      .then((resp) => {
        return resp.json();
      }).then((data) => {
        console.log(data);
        const idx = data[word];
        return idx ? idx : null;
      }).catch((err) => console.error(err));

    if (file_idx !== null) {
      const word_data = await fetch(`cwn_web/cwn_web_data_${file_idx}.json`)
        .then((resp) => {
          return resp.json()
        }).then((data) => {
          return data[word];
        }).catch((err) => console.error(err));
      return word_data;
    } else {
      return [];
    }
  }

}
