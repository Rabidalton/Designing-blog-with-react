//Import Express
import express from 'express';

//Temporary Express database for storing upvotes 
//To be commented out
let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
    comments: [],
}, {
    name: 'learn-node',
    upvotes: 0,
    comments: [],
}, {
    name: 'mongodb',
    upvotes: 0,
    comments: [],
}]

//Create the express App object or container for the app. 
const app = express();
app.use(express.json());

//Develop code for upvoting article
app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params; //Find the name of the article
    const article = articlesInfo.find(a => a.name === name); //Finds the article of the corresponding name

    if (article) { //validates the article's existence.
        article.upvotes += 1; //Increases the upvotes
        res.send(`The ${name} article has ${article.upvotes} upvotes`); //Send by the response
    } else {
        res.send('That article doesn\'t exist'); //Send this response if there's an error.
    }
});

//Adding comments
app.post('/api/articles/:name/comments', (req, res) => {
    const { name } = req.params; //Receives the name of the article as a request
    const { postedBy, text } = req.body; //Receives the comment and the commentor as a request

    const article = articlesInfo.find(a => a.name === name); //Finds the corresponding article of the name

    if (article) { //If the article exists,
        article.comments.push({ postedBy, text }); //Push the comment to the comments array.
        res.send(article.comments);
    } else {
        res.send('That article doesn\'t exist!'); //Throw this error if it doesn't exist.
    }
});

/*Tell the server to listen
Specify which port to listen on.
It takes two arguments: port number and a callback
*/
app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});




