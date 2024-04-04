const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");

const app = express();

const port = 3000;

app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}`);
});

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/save', urlencodedParser, (req, res) => {
    let date = moment().format('MMMM Do Y h:mm:ss a');
    let str = `${req.body.jmeno}, ${req.body.prijmeni}, ${req.body.singer}, ${req.body.song}, ${req.body.vyber}, ${req.body.platform}, ${date}\n`;

    fs.appendFile('data/vysledky.csv', str, function (err) {
        if(err){
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "Nastala chyba během ukládání souboru"
            });
        }
    });
    res.redirect(301, '/');
});

app.get("/vysledky", (req, res) => {
    csvtojson({headers:['jmeno','prijmeni','singer','song','vyber','platforma','date']}).fromFile(path.join(__dirname, 'data/vysledky.csv'))
        .then(data => {
            console.log(data)
            res.render('index', {nadpis: "Dotazník", vysledky: data});
        })
        .catch(err => {
            console.log(err);
            res.render('error', {nadpis: "Chyba v aplikaci", chyba: err});
        })
});
