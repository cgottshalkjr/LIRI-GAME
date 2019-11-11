require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var userCommand = process.argv[2];
var userRequest = process.argv.slice(3).join(" ");

// console.log(userCommand + userRequest);

switch (userCommand) {

    case "movie-this":
        movieFunction(userRequest);
        break;

    case "concert-this":
        concertFunction(userRequest);
        break;

}


function movieFunction(movieTitle) {

    //If a movie title is not entered we give it something to return automatically
    if (!movieTitle) {
        movieTitle = "The Passion Of Joan Of Arc"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

    // console.log(queryUrl);

    axios.get(queryUrl)
        .then(function (response) {
            console.log("---------------------------------------");
            console.log("Title: " + response.data.Title);
            console.log("---------------------------------------");
            console.log("||||||Directed By: " + response.data.Director);
            console.log("||||||Starring: " + response.data.Actors);
            console.log("||||||Release Year: " + response.data.Year);
            console.log("||||||Ratings: " + "IMDb: " + response.data.Ratings[0].Value + " |" + "Rotten: " + response.data.Ratings[1].Value + " |" + "MetaCritic: " + response.data.Ratings[2].Value);
            console.log("||||||Plot: " + response.data.Plot);
            console.log("||||||Country: " + response.data.Country);
            console.log("||||||Language: " + response.data.Language)
            console.log("===========================================");
        })
        .catch(function (error) {
            if (error.response) {

                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {

                console.log(error.request);
            } else {

                console.log("Error", error.message);
            }
            console.log(error.config);
        })

        fs.appendFile("log.txt", )
}
//End of movieFunction

function concertFunction(artistSearch) {

    if (!artistSearch) {
        artistSearch = "Durand Jones"
    }

 
    var queryUrl = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

    axios.get(queryUrl)
    .then(function (response) {
            
        for (var i = 0; i < response.data.length; i++){

        console.log("---------------------------------------");
        console.log("Venue: " + response.data[i].venue.name);
        console.log("City: " + response.data[i].venue.city);
        console.log("When: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("---------------------------------------");

        }
    })
}
//End of concertFunction
