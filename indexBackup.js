console.log('twit bot lives!!');
var Twit = require('twit');
var config = require('./config');
//var request = require('request');
const http = require('http');

var fs = require('fs');
var path = require('path');
var T = new Twit(config);
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const Watson = new VisualRecognitionV3({
  version: '2018-03-19',
  authenticator: new IamAuthenticator({
    apikey: 'MuzzSGaZ8-1PocJmo6ZuxotS1dF4xQOcuTCr0oosZeLY',
  }),
  url: '',
});

var outputTweet;

var stream = T.stream('statuses/filter', { track: ['@catbot63658091']});
stream.on('tweet', Tweeted);

function Tweeted(tweet){

    var name=tweet.user.screen_name;
    var txt=tweet.text;
    var nameID=tweet.id_str;

    //if there is media in this tweet,  copy the url and console log it
    if(tweet.entities && tweet.entities.media && tweet.entities.media.length > 0) {
        var mediaURL= tweet.entities.media[0].media_url;
        processURL(mediaURL)
        
        //console.log(mediaURL);
        
        //if(outputTweet!==undefined){

        //this will post my reply!!!!
        //this will post my reply!!!!
        txt=txt.replace(/@catbot63658091/g,"");
        var reply = "Hello @"+name+". Here is what I've found in your image:\n"+outputTweet;
        var params = {
            status: reply,
            in_reply_to_status_id: nameID
        };
        //posting a reply tweet 
        T.post('statuses/update', params, function(err, data, response){
            if(err!== undefined){
                console.log(err);
            }else{
                console.log('Tweet: '+params.status);
                
            }
        })
        //this is the end of my reply!!!
        //this is the end of my reply!!!

        //}else{console.log("something is wrong with WATSON")}

        }else{
        console.log('no media found in any tweets')
        }

    
    
};
var test="http://pbs.twimg.com/media/EaYKK6EUEAEt-8k.png";
var test2="https://vignette.wikia.nocookie.net/starwars/images/2/2c/Pazaaktables.jpg";
//processURL(test2);

function processURL(url){
    if(url.match(/^http/) && url.match(/\.(png|gif|jpg|jpeg)$/)){
        //check if it's a valid url
        var filename='./output.jpg';

        var download = function(url, filename, callback) {
            var file = fs.createWriteStream(filename);
            var request = http.get(url, function(response) {
              response.pipe(file);
              file.on('finish', function() {
                file.close(callback);  // close() is async, call callback after close completes.
              });
        })
        }

        download(url,filename,()=>{
        //need request to download the image locally
            const classifyParams = {
                imagesFile: fs.createReadStream(filename),
                //classifierIds: ['food'],
                threshold: 0.6,
            };
                outputTweet=MachineLearn(classifyParams);
        console.log("this should happen first!")
        })
        /*
        download(url,filename,()=>{
            const classifyParams = {
                imagesFile: fs.createReadStream(filename),
                //classifierIds: ['food'],
                threshold: 0.6,
            };

        });
        */


        /*
        //need request to download the image locally
        request({uri:url}).pipe(createWriteStream(filename)).on('close',()=>{
        //once the image is saved locally, upload to watson
        const classifyParams = {
            imagesFile: fs.createReadStream(filename),
            //classifierIds: ['food'],
            threshold: 0.6,
        };
        console.log("I got this far")
        
            //outputTweet=MachineLearn(classifyParams);
        });
        */
    }else{
        console.log('error. bad url');
    }

}
function MachineLearn(data){
this.data=data
Watson.classify(data)
        .then(response => {
         const classifiedImages = response.result;
        //console.log(JSON.stringify(classifiedImages, null, 2));
        //cleaning up the JSON data to be posted on twitter
        //FilterData(this.classifiedImages);
        var output=""
        var input=classifiedImages
        /*
        for(var i=0; len=input.images[0].classifiers[0].classes.length; i++){
            var element=input.images[0].classifiers[0].classes
            if(element[i]!==undefined){
            output+="Class: "+element[i].class+" \n"+"Score: "+element[i].score+"% \n"
            //console.log(element[i].class)
            //console.log(element[i].score)
            console.log(output);
            //PostTweet(this.output);
            }                                        
        }
            console.log('finished at '+input.images[0].classifiers[0].classes.length+" times")
            outputTweet=output;
        */
       outputTweet=(JSON.stringify(input));
       console.log(outputTweet);  
       return outputTweet;
        })
         .catch(err => {
         console.log('error:', err);
         return null;
        });
}
function FilterData(input){
    this.input=input
    var output=""
    for(var i=0; len=input.images[0].classifiers[0].classes.length; i++){
        var element=input.images[0].classifiers[0].classes
        if(element[i]!==undefined){
        output+="Class: "+element[i].class+" \n"+"Score: "+element[i].score+"% \n"
        //console.log(element[i].class)
        //console.log(element[i].score)
        //console.log(output)
        //PostTweet(this.output);
        }                                        
    }
}
function PostTweet(r){
    console.log(r)
    var name=tweeted.user.screen_name;
    var txt=tweeted.text;
    var nameID=tweeted.id_str;
    txt=txt.replace(/@catbot63658091/g,"");
    var reply = "Hello @"+name+". Here is what I've found in your image:\n"+r;
    var params = {
        status: reply,
        in_reply_to_status_id: nameID
    };

//posting a reply tweet 
T.post('statuses/update', params, function(err, data, response){
    if(err!== undefined){
        console.log(err);
    }else{
        console.log('Tweet: '+params.status);
    }
})
}

//T.get('search/tweets',params, gotData);
//function gotData(err, data, response){
//console.log(data)
//}