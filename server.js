const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.static("view"));
app.set('view engine', 'ejs');
app.options('*', cors());
app.get('/', function(req, res) {
  res.render('index', {});
});



const server = app.listen(3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});