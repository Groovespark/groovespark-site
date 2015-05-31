jsonpproxy = 'http://jsonp.afeld.me/?url=';


$(function() {
  var player = document.createElement("audio");
  var playercover = $(".img-cover");
  var playlists = $('.gs-playlists');
  var playing = false;

  // get playlist
  $("#gs-playsearch").click(function(e) {
    gsplaylist = 'https://raw.githubusercontent.com/'+encodeURI($('.gs-username').val())+'/gs-playlists/master/';
    gsplaylistindex = gsplaylist + 'index.json';
    playlists.html('');

    $.ajax({
      url: jsonpproxy + gsplaylistindex,  
      dataType: 'jsonp',                                                                          
      success: function(data){      
        $.each(data['playlists'], function(i, v) {
          jsonplaylists = data['playlists'][i];
          playlistname = jsonplaylists['pathname'].replace('.json', '');
          playlists.append('<li><a href="#'+ playlistname +'">'+ playlistname + '</a><ul class="gs-playlistall">');
          console.log(jsonpproxy + gsplaylist + decodeURI(jsonplaylists['pathname']));
          $.ajax({
            url: jsonpproxy + gsplaylist + decodeURI(jsonplaylists['pathname']),
            dataType: 'jsonp',
            success: function(dataPlay){
              $.each(dataPlay['songs'], function(j, vj) {
                song = dataPlay['songs'][j];
                $('.gs-playlistall', i).append('<li><a class="gs-playsong" data-songid="'+ song['id']+'" data-artistname="'+ song['artist'] +'" data-songname="' + song['track'] + '" href="#">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
                // $(this).html('<li><a class="gs-playsong" href="#'+ song['id']+'">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
              });
            }
          });
          playlists.append('</ul></li>');
        });
      }
    });
    e.preventDefault();
  });

  // Search songs
  $("#gs-search").click(function(e) {
    gssearch = 'http://pleer.com/browser-extension/search?q='+$('.gs-searchquery').val();

    $.ajax({
      url: jsonpproxy + gssearch,  
      dataType: 'jsonp',
      success: function(data){
        $('.gs-songs').html('');
        console.log(data);
        $.each(data['tracks'], function(index, val) {
          song = data['tracks'][index];
          $('.gs-songs').append('<li><a class="gs-playsong" data-songid="'+ song['id']+'" data-artistname="'+ song['artist'] +'" data-songname="' + song['track'] + '" href="#">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
        });
      }
    });
    e.preventDefault();
  });

  // Music player
  $("body").on('click', '.gs-playsong', function(event) {
    hash = $(this).data('songid');
    song = $(this).data('songname');
    artist = $(this).data('artistname');
    player.src = "http://pleer.com/browser-extension/files/" + hash + ".mp3";
    player.play();
    getArtwork(artist + ' ' + song);
    $('.gs-currentsong').html(song + ' - ' + artist);
  });

  // Playlist expand
  $("body").on('click', '.gs-playlist', function(event) {
    var pl = $(this+".gs-playlistall");
    if (pl.hasClass('ex-playlist')) {
      pl.removeClass('ex-playlist');
    } else {
      pl.addClass('ex-playlist');
    }
  });

  function getArtwork(searchkey) {
    $.ajax({
      url: 'https://itunes.apple.com/search?media=music&limit=1&term=' + searchkey,  
      dataType: 'jsonp',
      success: function(data){
        console.log(data);
        if (data['resultCount'] != 0) {
          playercover.css('background-image', 'url(' + data['results'][0]['artworkUrl100'] + ')');
        } else {
          playercover.css('background-image', 'url(http://placehold.it/100x100)');
        }
      }
    });
  }

  player.addEventListener('playing',function() {
    document.title = "▶ Groovespark";
    $(".player-play").html("▮▮");
    playing = true;
  }); 

  player.addEventListener('pause',function() {
    document.title = "װ Groovespark";
    $(".player-play").html("‣");
    playing = false;
    player.currentTime;
    $(".progress-inner").css('width', player.currentTime / player.duration * 100 + '%');
  });

  player.addEventListener('timeupdate',function() {
    $(".progress-inner").css('width', player.currentTime / player.duration * 100 + '%');
  });

  $('.l-playercontrols').on('click', '.player-play', function(event) {
    console.log(playing);
    if (playing) {
      player.pause();
    } else {
      player.play();
    }
  });
});