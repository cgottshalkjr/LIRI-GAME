require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// var inquirer = require("inquirer");

//setting commands we will use two variables on spots 2 and 3 after node liri.js
var userCommand = process.argv[2];
var userRequest = process.argv.slice(3).join(" ");

//function containing our switch that will help with our do-what function later
function runGame(userCommand, userRequest) {

    //switch holding all of the functions for the app
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

    } //End of switch
}
//End of run game function

//Function for handling errors with Rotten Tomatoes score
function getRotten(tomatoes) {
    if (tomatoes.Source === "Rotten Tomatoes") {
        console.log("||||||Rotten: ", tomatoes.Value)
    }
}

//Creating movie-this function
function movieFunction(movieTitle) {

    //If a movie title is not entered we give it something to return automatically
    if (!movieTitle) {
        movieTitle = "The Passion Of Joan Of Arc"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl)
        .then(function (response) {

            if (response.data.Title === undefined) {
                return console.log("ENTER IN A REAL GOD DANG MOVIE KAT OR SHELBO, STOP TRYING TO BREAK MY GAME AND TEST MY ERRORS!!!!");
            } else {
                console.log("-------------*MOVIE--INFO*-------------")
                console.log("---------------------------------------");
                console.log("Title: " + response.data.Title);
                console.log("---------------------------------------");
                console.log("||||||Directed By: " + (response.data.Director || "NO INFO"));
                console.log("||||||Starring: " + (response.data.Actors || "NO INFO"));
                console.log("||||||Release Year: " + (response.data.Year || "NO INFO"));
                response.data.Ratings.map(getRotten);
                console.log("||||||IMDb: " + (response.data.Ratings[0].Value || "NO INFO"));
                console.log("||||||Plot: " + (response.data.Plot || "NO INFO"));
                console.log("||||||Country: " + (response.data.Country || "NO INFO"));
                console.log("||||||Language: " + (response.data.Language || "NO INFO"))
                console.log("===========================================");

                var logText = "-------------*MOVIE--INFO*-------------\n" +
                    "-------------------------------------\n" +
                    "Title: " + response.data.Title + "\n" +
                    "-------------------------------------\n" +
                    "Directed By: " + response.data.Director + "\n" +
                    "Starring: " + response.data.Actors + "\n" +
                    "Release Year: " + response.data.Year + "\n" +
                    "||||||IMDb: " + response.data.Ratings[0].Value + "\n" + "||||||Plot: " + response.data.Plot + "\n" + "||||||Country: " + response.data.Country + "\n" + "||||||Language: " + response.data.Language + "\n"
                    + "======================================\n"

                fs.appendFile("log.txt", logText, function (err) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
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
                    console.log("------------------*EVENTS*---------------------");
                    console.log("Venue: " + response.data[i].venue.name);
                    console.log("City: " + response.data[i].venue.city + ", " + (response.data[i].venue.region || response.data[i].venue.country));
                    console.log("When: " + moment(response.data[i].datetime).format("LLLL"));
                    console.log("---------------------------------------");

                    var logText = "------------------*EVENTS*---------------------\n" +
                        "Venue: " + response.data[i].venue.name + "\n" +
                        "-------------------------------------\n" +
                        "City: " + response.data[i].venue.city + ", " + (response.data[i].venue.region || response.data[i].venue.country) + "\n" +
                        "When: " + moment(response.data[i].datetime).format("LLLL") + "\n"
                        + "======================================\n"

                    fs.appendFile("log.txt", logText, function (err) {
                        if (err) {
                            return console.log('Error occurred: ' + err);
                        }
                    });
                }
            } else {
                console.log("No shows coming up")
            }
        })
}
//End of concertFunction

//Creating function to run spotify-this-song
function spotifyFunction(songTitle) {

    if (!songTitle) {
        songTitle = "PPAP"
    }

    spotify.search({ type: 'track', query: songTitle, limit: 10 }, function (err, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }


        for (var i = 0; i < response.tracks.items.length; i++) {
            console.log("****************MUSIC****************");
            console.log("-------------------------------------");
            console.log("Artist: " + response.tracks.items[i].artists[0].name);
            console.log("-------------------------------------");
            console.log("Song: " + response.tracks.items[i].name);
            // console.log("URL: " + response.tracks.items[i].preview_url || "NO PREVIEW FOR YOU!!!");
            if (response.tracks.items[i].preview_url === null) {
                console.log("NO PREVIEW FOR YOU!!!!")
            } else {
                console.log("URL: " + response.tracks.items[i].preview_url);
            }
            console.log("Album: " + response.tracks.items[i].album.name);
            console.log("======================================");


            var logText = "****************MUSIC****************\n" +
                "-------------------------------------\n" +
                "Artist: " + response.tracks.items[i].artists[0].name + "\n" +
                "-------------------------------------\n" +
                "Song: " + response.tracks.items[i].name + "\n" +
                "URL: " + response.tracks.items[i].preview_url + "\n" +
                "Album: " + response.tracks.items[i].album.name + "\n"
                + "======================================\n"

            fs.appendFile("log.txt", logText, function (err) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

            });
        }
    });
};
//End of spotify function

//Creating a function to do-what-it-says
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
//End of do-what function

//function to run game with global command variables passed in as arguments
runGame(userCommand, userRequest);




