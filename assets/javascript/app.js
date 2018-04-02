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

//   creating variables based on our input field
var newTrain = $('#train-input').val();
var destination = $('#train-destination').val();
var newTime = moment($('#train-time').val().trim(),"Min").format('hh:mm');
var arrival = $('#train-arrival').val();


//   adding onClick to button
$('#add-train').on('click', function () {

    event.preventDefault();

    // attaching our train form to firebase
    database.ref().set({
        train: $('#train-input').val().trim(),
        destination: $('#train-destination').val().trim(),
        newTime: $('#train-time').val().trim(),
        arrivalTime: $('#train-arrival').val().trim()
    });

    // resetting our input fields
    $('#train-input').val('');
    $('#train-destination').val('');
    $('#train-time').val('');
    $('#train-arrival').val('');
   
});

// creating snapshots from our input form to attach on our table
database.ref().on('child_added', function (childSnapshot, preChildKey) {
    console.log(childSnapshot.val());
    var newTrain = childSnapshot.val().newTrain;
    var destination = childSnapshot.val().destination;
    var newTime = childSnapshot.val().newTime;
    var arrival = childSnapshot.val().arrival;

    // using momentJS to calculate our time
    var orignalTime = moment(newTime, "HH:mm").subtract(1, "years");
    console.log("First Time " + orignalTime.format("hh:mm"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // ETA between two trains
    var diffTime = moment().diff(moment(orignalTime), "minutes");
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
$('#schedule').append("<tr><td>" +
newTrain + "</td><td>" +
destination + "</td><td>" +
arrival + "</td><td>" +
arrivalTime + "</td><td>" +
minutesAway + "</td></tr>");
})