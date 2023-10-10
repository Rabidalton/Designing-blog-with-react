//Import Express and all the dependencies
import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import {db, connectToDb} from './db.js'

//Code for loading the credentials package using the node.js readFileSync.
const credentials = JSON.parse(
    fs.readFileSync('./credentials.json') //This will read the file
);

/*Use the credentials to initialize the firebase admin package and 
  use it to connect the server to the firebase.
*/
admin.initializeApp({
    //Telling the firebase admin package what credential 
    //to use in order to connect to the project. 
    credential: admin.credential.cert(credentials), 
});

//Create the express App object or container for the app. 
const app = express();
app.use(express.json());


//Code for express middleware
app.use(async (req, res, next) => {
    //Get the authentication token from the request made by the user.
    const { authtoken } = req.headers; 

    if (authtoken) { //If there is none, just load only basic contents.
        //Use the firebase auth to exract the authtoken, verify that it
        //is valaid, and load the corresponding firebase user for that token.
        //Wrap it in a try and catch incase it doesn't go well.
        try {
            req.user = await admin.auth().verifyIdToken(authtoken); //Verify the user is in firebase.
        } catch (e) {
           return res.sendStatus(400);
        }
        
    }

    //Provide a fefault value for req.user if an authtoken is defined.
    req.user = req.user || {};

    next();
});

//Endpoint to display info from the DB.
app.get('/api/articles/:name', async (req, res) => { //configure the get asynchronous request
    const { name } = req.params; //Get the url parameter
    const { uid } = req.user; //Access the id of the loaded user.

    
    //Looks for the article collection and find the article by it's name.
    const article = await db.collection('articles').findOne({ name });      

    if (article) { //If article exists,
        //Check to see if the user with the id has already upvoted the article.
        //This logic will also be used for the upvote endpoint.
        const upvoteIds = article.upvoteIds  || []; //IDs of users who already upvoted
        article.canUpvote = uid && !upvoteIds.includes(uid); //Verify that the user id 
                                                            //is not already among the upvoteIds.

        res.json(article); //respond with a json object.
    } else {
        res.sendStatus(404);
    }
    
});

//Middleware for protecting the upvote and comment endpoints
app.use((req, res, next) => {
    if (req.use) { //If the user is in firebase
        next(); //Allow the user to upvote and add comment.
    } else {
        res.sendStatus(401);
    } 
});


/*Develop code for upvoting article
To do this, we use the put request
*/
app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params; //Find the name of the article  
    
    const article = await db.collection('articles').findOne({ name });      

    if (article) { //If article exists,
        const upvoteIds = article.upvoteIds  || []; 
        const canUpvote = uid && !upvoteIds.includes(uid); //Determine if the user can vote.

        if (canUpvote) {
            //Looks for the article collection and find the id.
            await db.collection('articles').updateOne({ name }, { 
                $inc: {upvotes: 1}, //Increments the upvotes by 1.
                $push: { upvoteIds: uid },
            }); 
        } 
        
        //We need to load the article to see the number of upvotes.
        const updatedArticle = await db.collection('articles').findOne({ name });               
        res.json(updatedArticle); //Send by the response
    
           
    } else {
        res.send('That article doesn\'t exist'); //Send this response if there's an error.
    }
});



/*Adding comments
Almost the same code as upvote.
*/
app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params; //Receives the name of the article as a request
    const { text } = req.body; //Receives the comment and the commentor as a request 
    const { email } = req.user; 
      
    await db.collection('articles').updateOne({ name }, {
        $push: { comments: {postedBy: email, text } },
    });

    //load article
    const article = await db.collection('articles').findOne({ name });

    if (article) { //If the article exists,
        article.comments.push({ postedBy, text }); //Push the comment to the comments array.
        res.json(article);
    } else {
        res.send('That article doesn\'t exist!'); //Throw this error if it doesn't exist.
    }
});


/*Develop code for downvoting article
To do this, we use the put request
*/
app.put('/api/articles/:name/downvote', async (req, res) => {
    const { name } = req.params; //Find the name of the article    
    await db.collection('articles').updateOne({ name }, { //Looks for the article collection and find the id.
        $inc: {upvotes: -1}, //Increments the upvotes by 1.
    }); 

    //We need to load the article to see the number of upvotes.
    const article = await db.collection('articles').findOne({ name });
    if (article) { //validates the article's existence.        
        res.json(article); //Send by the response
    } else {
        res.send('That article doesn\'t exist'); //Send this response if there's an error.
    }
});

/*Tell the server to listen
Specify which port to listen on.
It takes two arguments: port number and a callback
Before listening, let it connect to db.
*/

connectToDb(() => {
    console.log('Successfully connected to the database.')
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });    
});





