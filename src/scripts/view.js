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
<<<<<<< HEAD
        $("#Dow").load("./src/components/kissmanga.html");
=======
        $("#content").load("./src/components/kissmanga.html");
>>>>>>> 0f5344cbbcf0c69142dde89ea4b205d43ae7c436
        console.log("km")
    }
}
