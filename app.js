const {google} = require('googleapis');
const key = require('./key.json');

const youtube = google.youtube('v3');

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/youtube'],
  null
);

jwtClient.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  }

  const videoId = 'Q4VGQPk2Dl8';
  const channelId = 'UCBJycsmduvYEL83R_U4JriQ';
  getVideosByChannel(jwtClient, channelId);
  // getVideoMetadata(jwtClient, videoId);
});


let videoIds = [];

// Note that querying with channelId has limitation for 500 items
// Find more on https://developers.google.com/youtube/v3/docs/search/list#channelId
function getVideosByChannel(auth, channelId, pageToken){
  youtube.search.list({
    channelId: channelId,
    auth: auth,
    part: 'id',
    type: 'video',
    maxResults: 50,
    pageToken: pageToken
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    const {data} = response;
    const {nextPageToken} = data;
    const {items} = data;

    const ids = items.map(i => i.id.videoId);
    videoIds = videoIds.concat(ids);

    if(nextPageToken && nextPageToken.length > 0 && items.length > 0){
      getVideosByChannel(auth, channelId, nextPageToken);
    } else {
      console.log('Done', videoIds.length)
    }
  });
}

function getVideoMetadata(auth) {
  youtube.videos.list(
    {
      id: videoId,
      auth: auth,
      part: 'id,snippet,statistics'
    },
    function(err, response) {
      if (err) {
        console.log(err);
      }

      for (item of response.data.items) {
        console.log('Title:', item.snippet.title);
        console.log('Publish Date:', item.snippet.publishedAt);
        console.log('Channel:', item.snippet.channelTitle);
        console.log('Statistics:', item.statistics);
      }
    }
  );
}
