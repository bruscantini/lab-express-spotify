/* jshint esversion: 6 */

const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.use(express.static('public'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('view engine', 'ejs');

app.get("/songs/:albumId", function (req, res){
  let albumId = req.params.albumId;
  console.log('alubm ID is: ', albumId, "yay!");

  // Get tracks in an album
  spotify.getAlbumTracks(albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log("Album info", data.body);
    res.render("songs", {tracks: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.get("/albums/:artistId", function (req, res){
  let artistId = req.params.artistId;
  let artistName = null;
  spotify.getArtist(artistId)
  .then(function(data) {
    //console.log('Artist information', data.body);
    artistName = data.body.name;
    spotify.getArtistAlbums(artistId)
      .then(function(data) {
            console.log('Artist albums', data.body);
            let artistAlbums = data.body.items;
            res.render('albums', {artist: artistName, albums: artistAlbums});
      }, function(err) {
            console.error(err);
    });
  }, function(err) {
    console.error(err);
  });

});

app.get("/artists", function (req, res) {
  let artist = req.query.artist;
  spotify.searchArtists(artist, {}, (err, data) => {
    if (err) throw err;

    let artistsFound = data.body.artists.items;
    console.log(artistsFound);
    imgObj = artistsFound[0].images[0]; //has a height, url, width;
    console.log(imgObj);

    res.render('artists', {artistSearched: artist, artistsFound: artistsFound});
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(3000, () => {
  console.log("express-spotify - running and listening...");
});

/*
spotify.searchArtists("The Beatles", {}, (err, data) => {
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists);
});
*/
