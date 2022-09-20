const bodyParser = require("body-parser")
const app = require("express")()
const cors = require("cors")
const axios = require("axios")
const nanoid = require("nanoid")

app.use(bodyParser.json())
const corsOptions = {
    origin: "http://localhost:3000/api/login"
}
app.use(cors(corsOptions))

app.get("/1", (req, res) => {
    console.log(req.query)
    res.status(200).json("ok")
})

const stateKey = "spotify_auth_state";
const client_id = "69d25c690d5b4a00ab63d45e015b5567";
const client_secret = "3423c76717d44543bf75897cf919fde4";
const redirect_uri = "http://localhost:3000/queue";

app.post("/token", async (req, res) => {
    const body = {
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri,
        client_id,
        client_secret
    };
    
    axios.post("https://accounts.spotify.com/api/token", new URLSearchParams(body), {headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then(response => { 
        res.status(200).json(response.data)
    }).catch(err => {
        console.log("NAH")
        console.log(err);
        res.status(400).json("failed")
    })
    

})


app.post("/session", async (req, res) => {

    //TODO
    //insert into database

    const id = nanoid.customAlphabet("0123456789", 6)()
    
    console.log(id)
    res.status(200).json({id})

})

module.exports = app