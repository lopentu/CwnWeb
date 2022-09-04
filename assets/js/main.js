// 查詢_api 網址
var apiurl = {
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

// Make the interactive wordcloud
anychart.onDocumentReady(function () {

  anychart.data.loadJsonFile(
    './anyCloud.json',
    function (data) {
      var dataSet = anychart.data.set(data);
      var colors = anychart.scales
        .ordinalColor()
        // .colors(['#26959f', '#f18126', '#3b8ad8', '#60727b', '#e24b26']);
        .colors(['#6B9080', '#f6bd60', '#5fa8d3', '#A4C3B2']);

      var chart = anychart.tagCloud(dataSet);
      chart
        .data(dataSet)
        .colorScale(colors)
        .angles([0])
        .legend(true)
        .textSpacing(5)
        .mode('spiral');

      var tooltip = chart.tooltip();
      // set the tooltip content
      tooltip
        .titleFormat('團隊成員: {%x}！')
        .format('擔任角色：{%category}')
        .fontColor('#f18126');

      var legend = chart.legend();
      legend
        .itemsLayout('vertical-expandable')
        .position('right')
        .drag(true);

      // display the word cloud chart
      chart.container("wordcloud");
      chart.draw();
    })
});

// Create tabs for people on click 
const peopletab = document.querySelectorAll(".peopleTab");
for (i = 0; i < peopletab.length; i++) {
  peopletab[i].style.display = "none";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultPeople").click();
function openPeopleTab(tabName) {
  const peopletab = document.querySelectorAll(".peopleTab");
  for (i = 0; i < peopletab.length; i++) {
    peopletab[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

// redirect if request are query
const urlParams = new URLSearchParams(window.location.search);

// Do not change GET parameter name of _query_ and _pos_. 
// They are linked from external sites (e.g. E-HowNet from AI project 2020).
const word = urlParams.get("query");
const pos = urlParams.get("pos");
const cwnId = urlParams.get("cwnid");
let cwnQueryCursor = {}
if (word !== null) {
  // window.location.replace("http://lope.linguistics.ntu.edu.tw/cwnvis_beta/index.php/lemmas?word=" + queryParam);
  cwnQueryCursor = { word, pos, cwnId };
  document.getElementById("cwn-query").scrollIntoView();
}

const app = Vue.createApp(CwnQuery);
app.component('cwn-relation', CwnRelation);
app.mount("#cwn-query");

const newSearch = document.querySelector('#queryContainer');
newSearch.addEventListener('click', function () {
  var newtab = window.open("https://lopentu.github.io/CwnVisualize/#/", "_blank");
  newtab.focus();
});