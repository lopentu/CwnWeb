// 查詢_api 網址
var apiurl={
  itemdata: "http://140.112.147.120:5201/search/%E8%A9%9E",
  itemsdata: "https://awiclass.monoame.com/api/command.php?type=get&name=itemdata"
};

// 呈現查詢的資料
var vmshow= new Vue({
  el: "#appshow",
  data: {
    items: []
  }
});

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
