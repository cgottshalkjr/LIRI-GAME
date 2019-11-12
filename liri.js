require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

var userCommand = process.argv[2];
var userRequest = process.argv.slice(3).join(" ");



function runGame(userCommand, userRequest) {
    switch (userCommand) {

        case "movie-this":
            movieFunction(userRequest);
            break;

        case "concert-this":
            concertFunction(userRequest);
            break;

        case "spotify-this-song":
            spotifyFunction(userRequest);
            break;

        case "do-what-it-says":
            doWhatFunction();
            break;

        default:
            console.log("Enter a valid search command")

    }
}

function getRotten(tomatoes) {
    if (tomatoes.Source === "Rotten Tomatoes") {
        console.log("Rotten Tomatoes Rating: ", tomatoes.Value)
    }
}
//Creating movie-this function
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
            response.data.Ratings.map(getRotten);
            // console.log("||||||Ratings: " + "IMDb: " + response.data.Ratings[0].Value + " |" + "Rotten: " + response.data.Ratings.map(getRotten) + " |" + "MetaCritic: " + response.data.Ratings[2].Value);
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

    // fs.appendFile("log.txt")
}
//End of movieFunction

//Creating concert-this funciton
function concertFunction(artistSearch) {

    if (!artistSearch) {
        artistSearch = "Culture Abuse"
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

    axios.get(queryUrl)
        .then(function (response) {
            if (response.data.length > 0) {
                for (var i = 0; i < response.data.length; i++) {
                    console.log("---------------------------------------");
                    console.log("Venue: " + response.data[i].venue.name);
                    console.log("City: " + response.data[i].venue.city + ", " + (response.data[i].venue.region || response.data[i].venue.country));
                    console.log("When: " + moment(response.data[i].datetime).format("LLLL"));
                    console.log("---------------------------------------");
                }
            }
            else {
                console.log("No shows coming up")
            }
        })
}
//End of concertFunction

function spotifyFunction(songTitle) {

    if (!songTitle) {
        songTitle = "PPAP"
    }

    spotify.search({ type: 'track', query: songTitle, limit: 10 }, function (err, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }


        for (var i = 0; i < response.tracks.items.length; i++) {
            console.log("-------------------------------------")
            console.log("Artist: " + response.tracks.items[i].artists[0].name);
            console.log("-------------------------------------")
            console.log("Song: " + response.tracks.items[i].name);
            console.log("URL: " + response.tracks.items[i].preview_url);
            console.log("Album: " + response.tracks.items[i].album.name);
            console.log("======================================");

            var logText = "-------------------------------------\n" +
                "Artist: " + response.tracks.items[i].artists[0].name + "\n" +
                "-------------------------------------\n" +
                "Song: " + response.tracks.items[i].name + "\n" +
                "URL: " + response.tracks.items[i].preview_url + "\n" +
                "Album: " + response.tracks.items[i].album.name + "\n"
                + "======================================\n"

            fs.appendFile("log.txt", logText, function (err) {


            });
        }


    });
};

function doWhatFunction() {

    fs.readFile('random.txt', 'utf8', function (err, response) {
        if (err) {
            return console.log(err);
        }
        var newArr = response.split(',');
        runGame(newArr[0], newArr[1]);
        console.log("==================================================")
        console.log("I ASK YOU SHELBY AND/OR KATHRYN?!?! WHO DID?!?!??")
        console.log("==================================================")
    });
}

runGame(userCommand, userRequest);


// function rulesFunction() {
//     console.log("-------------------------------------")
//     console.log("Rules")
//     console.log("-------------------------------------")
//     console.log("Type 1 of 4 things:\n" + "*movie-this\n" + "*concert-this\n" + "*spotify-this-song\n" + "*do-what-it-says\n" + "After you type in one of the commands, enter a search term and hit enter");
//     console.log("=====================================")
// }


