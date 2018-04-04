// Initialize Firebase
var config = {
    apiKey: "AIzaSyDH_OYKSSzBVtLQLjofJ58B5nhL3r6OZnI",
    authDomain: "trainsheet-2b137.firebaseapp.com",
    databaseURL: "https://trainsheet-2b137.firebaseio.com",
    projectId: "trainsheet-2b137",
    storageBucket: "trainsheet-2b137.appspot.com",
    messagingSenderId: "378495248609"
};
firebase.initializeApp(config);
var database = firebase.database();


//   adding onClick to button
$('#add-train').on('click', function () {

    event.preventDefault();
//   creating variables based on our input field
var newTrain = $('#train-input').val();
var destination = $('#train-destination').val();
var newTime = moment($('#train-time').val().trim(), 'min').format('hh:mm');
var arrival = $('#train-arrival').val();


    // attaching our train form to firebase
    database.ref().push({
        train: newTrain,
        destination: destination,
        newTime: newTime,
        arrivalTime: arrival
    });

    // resetting our input fields
    $('#train-input').val('');
    $('#train-destination').val('');
    $('#train-time').val('');
    $('#train-arrival').val('');

});
     
// creating snapshots from our input form to attach on our table
database.ref().on("child_added", function(childSnapshot) {
   
    var newTrain = childSnapshot.val().newTrain;
    var destination = childSnapshot.val().destination;
    var newTime = childSnapshot.val().newTime;
    var arrival = childSnapshot.val().arrival;

    // using momentJS to calculate our time
    var originalTime = moment(newTime, "hh:mm").subtract(1, "years");
    console.log("First Time " + moment(originalTime).format("hh:mm"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // ETA between two trains
    var diffTime = moment().diff(moment(currentTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + moment(diffTime).format("hh:mm"));

    // remaining time till next train
    var tRemainder = diffTime % arrival;
    console.log("REMAINDER " + tRemainder);
    
    // time till next train
    var minutesAway = arrival - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var arrivalTime = moment().add(minutesAway, "minutes");

    arrivalTime = moment(arrivalTime).format("hh:mm A");
    console.log("ARRIVAL TIME: " + arrivalTime);

        // updating our schedule with new trains
    var newTr = $("<tr>");

    // Creating TD displays for the html
    var nameDisplay = $("<td>").text(childSnapshot.val().train);
    var destinationDisplay = $("<td>").text(childSnapshot.val().destination);
    var frequencyDisplay = $("<td>").text(childSnapshot.val().newTime);
    var arrivalDisplay = $("<td>").text(moment(arrival).format("hh:mm"));
    var minutesDisplay = $("<td>").text(minutesAway);

    if(minutesAway === NaN) {
      var minutesDisplay = $("<td>").text("Unavailable");
    };

    // // Appending the user input to the html
    newTr.append(nameDisplay, destinationDisplay, frequencyDisplay, arrivalDisplay, minutesDisplay);
    $("#schedule").append(newTr);
});