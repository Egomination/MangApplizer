// View Scripts

// Needed for Materialize Design
$(document).ready(function() {
    $('select').material_select();
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
});

function source(source){
    if(source=="lhs"){
        $("#content").load("./src/components/lhscans.html");
        console.log("lhs")
    }
    else if(source=="km"){
        //$("#Dow").load("./src/components/.html");
        console.log("km")
    }
}
