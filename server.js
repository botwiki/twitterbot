/* Setting things up. */
const express = require( 'express' ),
      app = express(),
      CronJob = require( 'cron' ).CronJob,
      Twit = require( 'twit' ),
      config = {
      /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
        twitter: {
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          access_token: process.env.TWITTER_ACCESS_TOKEN,
          access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        }
      },
      T = new Twit( config.twitter );

app.use( express.static( 'public' ) );

let listener = app.listen( process.env.PORT, function(){
  console.log( 'Your bot is running on port ' + listener.address().port );

  /*
    Set up a new cron job to start tweeting automatically.
    Check out https://www.npmjs.com/package/cron#available-cron-patterns to learn more about cron scheduling patterns.
    
    For a few examples, see https://glitch.com/edit/#!/creative-bots?path=helpers%2Fcron-schedules.js

  */

  ( new CronJob( '0 */2 * * *', function() {
    
    /* The example below tweets out "Hello world 👋" and the current date. */

    const date = new Date().toLocaleString();

    T.post( 'statuses/update', { status: 'Hello world 👋 ' + date }, function( err, data, response ) {
      if ( err ){
        console.log( 'error!', err );
      }
      else {
        console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
      }
    } );
  } ) ).start();
} );
