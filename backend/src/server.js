//Import Express
import express from 'express';
import {db, connectToDb} from './db.js'

//Create the express App object or container for the app. 
const app = express();
app.use(express.json());

//Endpoint to display info from the DB.
app.get('/api/articles/:name', async (req, res) => { //configure the get asynchronous request
    const { name } = req.params; //Get the url parameter
    
    //Looks for the article collection and find the article by it's name.
    const article = await db.collection('articles').findOne({ name }); 

    if (article) {
        res.json(article); //respond with a json object.
    } else {
        res.sendStatus(404);
    }
    
});

/*Develop code for upvoting article
To do this, we use the put request
*/
app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params; //Find the name of the article    
    await db.collection('articles').updateOne({ name }, { //Looks for the article collection and find the id.
        $inc: {upvotes: 1}, //Increments the upvotes by 1.
    }); 

    //We need to load the article to see the number of upvotes.
    const article = await db.collection('articles').findOne({ name });
    if (article) { //validates the article's existence.        
        res.send(`The ${name} article has ${article.upvotes} upvotes`); //Send by the response
    } else {
        res.send('That article doesn\'t exist'); //Send this response if there's an error.
    }
});

/*Develop code for upvoting article
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


/*Adding comments
Almost the same code as upvote.
*/
app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params; //Receives the name of the article as a request
    const { postedBy, text } = req.body; //Receives the comment and the commentor as a request  
      
    await db.collection('articles').updateOne({ name }, {
        $push: {comments: {postedBy, text}},
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





