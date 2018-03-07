const {google} = require('googleapis');
const key = require('./key.json');

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

  getVideoMetadata(jwtClient, videoId);
});

function getVideoMetadata(auth, videoId) {
  const youtube = google.youtube('v3');
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
