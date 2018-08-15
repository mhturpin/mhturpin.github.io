function fillBreakpoints() {
  $("#breakpoints").html("");
  $("#breakpoints").append("<tr id='headers'></tr>");

  $("#headers").append("<th></th>");
  for (var i = 0; i < 16; i++) {
    $("#headers").append("<th>" + i + "</th>");
  }

  for (var i = 60; i < 81; i++) {
    $("#breakpoints").append("<tr><td>" + i/2 + "</td></tr>");
  }

  $.getJSON("GAME_MASTER.json", function(data) {
    console.log(data);
  });
}
