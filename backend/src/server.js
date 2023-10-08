//Import Express
import express from 'express';

//Create the express App object or container for the app. 
const app = express();

/*
Define different endpoints and what we want 
our server to do when one of those endpoints 
receive a request.  
*/

/*Get request with hello word response
#It takes two arguments: 1. the route and 2. a callback
#The callback takes two arguments: 1. req and 2. res
*/
app.get('/hello', (req, res) => {
    res.send('Hello!') //The app respons with a message.
}); 

/*Tell the server to listen
Specify which port to listen on.
It takes two arguments: port number and a callback
*/
app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});




