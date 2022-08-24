const express = require('express');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.static(__dirname + '/public/'));


app.get('/', (req, res) => {
    res.render('home');
})


async function start() {
    try {
        app.set('port', (process.env.PORT || 3000));
        app.listen(app.get('port'), () => console.log('Server is running'));
    } catch (e) {
        console.log(e);
    }
}

start();

