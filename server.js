const express = require('express');
const bodyparser = require('body-parser');
const PORT = process.env.PORT || 3333;

const routes = require('./src/routes/routes');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    limit: '50mb',
    extended: false
}));

// Use Routes
app.use(routes);


app.listen(PORT, console.log(`Server ir running on http://localhost:${PORT}`));