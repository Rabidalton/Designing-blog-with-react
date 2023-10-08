//Import Express
import express from 'express';

//Temporary Express database for storing upvotes 
//To be commented out
let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
}, {
    name: 'learn-node',
    upvotes: 0,
}, {
    name: 'mongodb',
    upvotes: 0,
}]

//Create the express App object or container for the app. 
const app = express();
app.use(express.json());

//Develop code for upvoting article
app.put('api/articles/:name/upvote', (res, req) => {
    const { name } = req.params; //Find the name of the article to upvote
    const article = articlesInfo.find(a => a.name === name); //Find corresponding article with that name.
    if (article) { //Validates the article's existence
        article.upvotes += 1;
        res.send(`The ${name} article now has ${article.upvotes} upvotes.`);
    } else {
        res.send('The article does not exist');
    }    
});

/*Tell the server to listen
Specify which port to listen on.
It takes two arguments: port number and a callback
*/
app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});




