const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const nocache     = require('nocache');
const path        = require('path');
const morgan      = require('morgan');
const compression = require('compression');
const firebase    = require("firebase");
const _           = require("lodash");

const app = express();
app.set('json spaces', 3);

// Just for development:
app.use(morgan('dev'));
app.use(cors());
app.use(nocache());

app.use( compression({threshold: 1}) );
app.use( bodyParser.text() );

app.use(express.static(path.join(__dirname, 'client-side')));

   let firebase_config = {
      databaseURL: "https://hacker-news.firebaseio.com"
   };
   hn_firebase = firebase.initializeApp(firebase_config);

   let hnTopStoriesRef =  hn_firebase.database().ref("/v0/topstories");

   let hnTopStoryCache = {}      // This map from item_id -> item object is an index to the storyList to
                                 //     quickly check if an item is already in the StoryList.
   let hnTopStoryList = null;    // This is the data we send in response to GET requests for top stories;
   let nextTopStoryCache;        // These var holds the data while we're still loading stories from
                                 //    firebase after an update. As soon as everything is loaded,
                                 //    this datastructure is complete, and we replace the official
                                 //    cache with this one.

   let cacheLoadedPromise = new Promise( (fulfill,reject) => {
      hnTopStoriesRef.on("value", function(snapshot) {
         console.log("Top Stories Update:", new Date().toLocaleTimeString('en-US', {hour12:false}))
         getNewHNCache( snapshot.val() ).then( (storyList) => {
            let firstTimeLoaded = (hnTopStoryList === null);
            hnTopStoryList = storyList.filter( itm => itm && itm.type === "story" && itm.url != undefined );
            console.log("   Cache contains "+ hnTopStoryList.length + " stories.")
            hnTopStoryCache = nextTopStoryCache;
            nextTopStoryCache = null;
            if( firstTimeLoaded ) {
               fulfill(true);  // cacheLoadedPromise can now be fullfilled, allowing the server to respond to GET requests; We fullfill with a dummy value. the true data is in hnTopStoryList and hnTopStoryCache;
            }
         })
      })
   })

   function getNewHNCache( idList ) {
      let cacheHits = 0;
      nextTopStoryCache = {};
      allItemLoadTasks = idList.map( id => {
         if( hnTopStoryCache[id] !== undefined ) {
            cacheHits ++;
            nextTopStoryCache[id] = hnTopStoryCache[id];
            return Promise.resolve( hnTopStoryCache[id] );
         } else {
            return new Promise( (fullfill,reject) => {
               let itemRef = hn_firebase.database().ref("/v0/item/" + id);
               itemRef.once("value", ss => {
                  if(ss.val() == null) {
                     console.log("   WEIRD: ss.val() for item.id="+id, ss.val() );
                  } else if( ss.val().type == "story" && hnTopStoryList !== null) {
                     console.log("   Loaded story:", ss.val().title );
                  }

                  nextTopStoryCache[id] = ss.val();
                  fullfill( ss.val() );
               })
            })
         }
      })
      console.log("   Cache hits:", cacheHits);
      return Promise.all( allItemLoadTasks );
   }

  let hnRoutes = express.Router();

  hnRoutes.get('/topstories', function(request, response) {
     cacheLoadedPromise.then( dummyValue => {
        response.json(hnTopStoryList);
     });  // end promise.then
  });  // end get(/topstories)

  app.use("/hn",hnRoutes);


//---------A restish API for itemStatuses -----------------------------------

var mongo    = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;



mongo.connect('mongodb://localhost:27017/RrHN', { useNewUrlParser: true }, (err, client) => {
  if(err) throw err;

  var db = client.db('RrHN');
  var collection = db.collection('itemStatuses');

  var itemStatusRoutes = express.Router();

  // get the list of itemStatuses
  itemStatusRoutes.get('/', function(request, response) {
      collection.find().toArray( function(err, resultArray){
         if(err) throw err;
         var mapping = {}
         resultArray.forEach(item => {
            mapping[ item._id ] = item.status
         })
         response.json(mapping);
      }); // end collection.find.toArray
   }); // end router.get

  itemStatusRoutes.put('/:id', function(request, response) {
     console.log("BODY:", request.body);
     if(request.body == undefined ) {
        console.log("REQUEST", request);
     }
     var theID = parseInt(request.params.id);
     var record = { _id: theID, status: request.body, modified_at: new Date() }
     console.log("RECORD:", record);

     collection.save(record, function(err, result) {
        if(err) throw err;
        response.json({ok:true, data: record});
     });
  });

  app.use("/itemStatuses",itemStatusRoutes);

});

app.listen(3000);
console.log("Server running on port 3000.");
