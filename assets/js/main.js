// 查詢_api 網址
var apiurl={
  itemdata: "http://140.112.147.120:5201/search/%E8%A9%9E",
  itemsdata: "https://awiclass.monoame.com/api/command.php?type=get&name=itemdata"
};

/*
$.ajax({
  url: apiurl.itemdata,
  success: function(res){
    vmshow.items=(res);
  }
});
*/

// Toggle between showing and hiding the sidebar when clicking the menu icon
var mySidebar = document.getElementById("mySidebar");

function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
  } else {
    mySidebar.style.display = 'block';
  }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
}

// Create tabs on click 
function openContent(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// redirect if request are query
const urlParams = new URLSearchParams(window.location.search);

// Do not change GET parameter name of _query_ and _pos_. 
// They are linked from external sites (e.g. E-HowNet from AI project 2020).
const word = urlParams.get("query");
const pos = urlParams.get("pos");
const cwnId = urlParams.get("cwnid");
let cwnQueryCursor = {}
if(word !== null){
  // window.location.replace("http://lope.linguistics.ntu.edu.tw/cwnvis_beta/index.php/lemmas?word=" + queryParam);
  cwnQueryCursor = {word, pos, cwnId};
  document.getElementById("cwn-query").scrollIntoView();
}

const app = Vue.createApp(CwnQuery);
app.component('cwn-relation', CwnRelation);
app.mount("#cwn-query");
