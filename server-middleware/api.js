const bodyParser = require("body-parser")
const express = require("express")
const axios = require("axios")
const nanoid = require("nanoid")
const expressWs = require('express-ws');
const eWs = expressWs(express())
const app = eWs.app
const db = require("./db")

app.use(bodyParser.json())

const client_id = "69d25c690d5b4a00ab63d45e015b5567";
const client_secret = "3423c76717d44543bf75897cf919fde4";
const redirect_uri = "http://localhost:3000/queue";
const BASE_URL = "http://localhost:3000"




app.post("/token", async (req, res) => {
    const body = {
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri
    };

    
    axios.post("https://accounts.spotify.com/api/token", new URLSearchParams(body), {headers:{'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')}}).then(response => { 
        res.status(200).json(response.data)
    }).catch(err => {
        console.log(err);
        res.status(400).json("failed")
    })

})


app.post("/refresh", async (req, res) => {
    console.log(req.body)

    if(req.body.session_id === undefined || req.body.session_id === null){
        res.status(400).json({error: "invalid session"})
    }
    db.query(`SELECT spotify_auth_token, spotify_refresh_token FROM sessions WHERE session_id = '${req.body.session_id}';`, (error, response) => {
        if(error){
            res.status(500).json({error: "Database error"})
        }else{
            if(response.rowCount > 0){
                const {spotify_auth_token, spotify_refresh_token} = response.rows[0]
                console.log("TOKEN:")
                console.log(spotify_refresh_token)
                const body = {
                    grant_type: "refresh_token",
                    refresh_token: spotify_refresh_token
                }
                axios.post("https://accounts.spotify.com/api/token", new URLSearchParams(body), {headers:{'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')}}).then(response2 => {
                    db.query(`UPDATE sessions SET spotify_auth_token = '${response2.data.access_token}' WHERE session_id = '${req.body.session_id}';`, (error, result) => {
                        if(error){
                            console.log(error)
                            console.log("REFRESH DB ERROR")
                            res.status(500).json({error: "Server error"})
                        }else{
                            console.log("REFRESH SUCCESS")
                            res.status(200).json({access_token: response2.data.access_token})
                        }
                    })
                    
                }).catch(err => {
                    console.log("REFRESH SPOTIFY ERROR")
                    console.log(err)
                    res.status(400).json({error: "Bad request"})
                })
            
                
            }else{
                res.status(400).json({error: "Invalid session"})
            }
        }
    })


    
})

app.post("/session", async (req, res) => {
    console.log(req.body)

    const id = nanoid.customAlphabet("0123456789", 6)()
    const text = `INSERT INTO sessions(session_id, spotify_auth_token, spotify_refresh_token, time_created) VALUES($1, $2, $3, now());`
    const values = [id, req.body.auth_token, req.body.refresh_token]

    db.query(text, values, (err, response) => {
        if(err){
            console.log(err.stack)
            res.status(500).json({error: "Database error"})
        }else{
            res.status(200).json({session_id: id})
        }   
    })


})


app.get("/search", async (req, res) => {

    if(req.query.session_id === undefined || req.query.session_id === null){
        res.status(400).json({error: "invalid session"})
    }
    db.query(`SELECT spotify_auth_token, spotify_refresh_token FROM sessions WHERE session_id = '${req.query.session_id}';`, (error, response) => {
        if(error){
            res.status(500).json({error: "Database error"})
        }else{
            if(response.rowCount > 0){
                const {spotify_auth_token, spotify_refresh_token} = response.rows[0]

                let {query} = req.query

                let config = {
                    headers: { Authorization: `Bearer ${spotify_auth_token}` }
                };
                axios.get("https://api.spotify.com/v1/search?" + new URLSearchParams({q: query, type: "track"}), config).then(result => {
                    res.status(200).json(result.data.tracks)
                }).catch(err => {
                    console.log("ERR1")
                    console.log(err)
                    if(err.response){
                        if(err.response.status === 401){
                            console.log("AUTH EXP")
                            res.status(401).json({error: "Authorization expired"})
                        }else{
                            console.log("ERR2")
                            res.status(400).json({error: "Bad Request"})
                        }
                    }else{
                        console.log("ERR3")
                        res.status(500).json({error: "Server error"})
                    }
                })



            }else{
                res.status(400).json({error: "Invalid session"})
            }
        }
    })
})


app.post("/queue", async (req, res) => {
    console.log(req.body)
    const {session_id, song_uri, song_id, name, artist} = req.body

    db.query(`SELECT queue FROM sessions WHERE session_id = '${session_id}';`, (error, result) => {
        if(error){
            console.log(error.stack)
            res.status(500).json({error: "Database error"})
        }else{
            if(result.rowCount > 0){
                let queue = result.rows[0].queue
                console.log(queue)
                if(queue === null || queue === {}){
                    const newQueueItem = {uri: song_uri, song_id, name, artist, votes: 0}
                    queue = []
                    queue.push(newQueueItem)
                    const queueString = JSON.stringify(queue)
                    console.log(queueString)
                    db.query(`UPDATE sessions SET queue = '${queueString}' WHERE session_id = '${session_id}'`, (error2, result2) => {
                        if(error2){
                            console.log(error2.stack)
                            res.status(500).json({error: "Database error"})
                        }else{
                            res.status(200).json({song_uri})
                        }
                    })
                }else{
                    if(queue.some(e => e.uri === song_uri)){
                        console.log("exists")
                        res.status(400).json({error: "Song already exists", error_code: 0})
                    }else{
                        const newQueueItem = {uri: song_uri, song_id, name, artist, votes: 0}
                        queue.push(newQueueItem)
                        const queueString = JSON.stringify(queue)
                        console.log(queueString)
                        db.query(`UPDATE sessions SET queue = '${queueString}' WHERE session_id = '${session_id}'`, (error2, result2) => {
                            if(error2){
                                console.log(error2.stack)
                                res.status(500).json({error: "Database error"})
                            }else{
                                res.status(200).json({song_uri})
                            }
                        })
                    }
                }
                    

                
            }
        }
    })

})

app.delete("/queue", async (req, res) => {

})


app.get("/queue", (req, res) => {
    if(req.query.session_id === undefined || req.query.session_id === null){
        res.status(400).json({error: "Missing session"})
    }else{
        const session_id = req.query.session_id

        db.query(`SELECT queue, next_song, spotify_auth_token FROM sessions WHERE session_id = '${session_id}';`, (error, result) => {
            if(error){
                res.status(500).json({error: "Database error"})
            }else{
                if(result.rowCount > 0){
                    const {queue, next_song, spotify_auth_token} = result.rows[0]
                    let song_string = "ids="
                    if(queue !== undefined && queue !== null){
                        queue.forEach(element => {
                            song_string += element.song_id
                            song_string += ","
                        });
                    }
                    
                    song_string += next_song
                    console.log("sfafd")
                    console.log(song_string)
                    const config = {
                        headers: { Authorization: `Bearer ${spotify_auth_token}` }
                    };
                    axios.get("https://api.spotify.com/v1/tracks?" + song_string, config).then(response => {
                        console.log("sdlhfdöogih")
                        const {tracks} = response.data
                        const queue2 = []
                        for(let i = 0; i < tracks.length - 1; i++){
                            queue2.push({
                                uri: tracks[i].uri,
                                name: tracks[i].name,
                                artist: tracks[i].artists[0].name,
                                img: tracks[i].album.images[0].url,
                                duration_ms: tracks[i].duration_ms,
                                song_id: tracks[i].id,
                                votes: queue[i].votes
                            })
                        }

                        const next_song2 = {
                            uri: tracks[tracks.length-1].uri,
                            name: tracks[tracks.length-1].name,
                            artist: tracks[tracks.length-1].artists[0].name,
                            img: tracks[tracks.length-1].album.images[0].url,
                            duration_ms: tracks[tracks.length-1].duration_ms,
                            song_id: tracks[tracks.length-1].id
                        }
                        console.log("aöolkdshklesg")
                        res.status(200).json({queue: queue2, next_song: next_song2})
                    }).catch(err => {
                        console.log(err.response)
                        res.status(400).json({error: "Spotify error"})
                    })

                }else{
                    res.status(400).json({error: "Invalid session"})
                }
            }
        })
    }
})

app.post("/queue/next", (req, res) => {
    const {session_id} = req.body
    console.log("NEXT SONG")
    console.log(session_id)
    db.query(`SELECT queue, spotify_auth_token FROM sessions WHERE session_id = '${session_id}';`, (error, result) => {
        if(error){
            res.status(500).json({error: "Database error"})
        }else{
            if(result.rowCount > 0){
                let {spotify_auth_token, queue} = result.rows[0]
                if(queue === undefined || queue === null || queue.length === 0 || queue === {}){
                    res.status(400).json({error: "Empty queue"})
                }else{
                    const max_votes = queue.reduce((a,b) => a.votes>b.votes?a:b)
                    queue = queue.filter(e => {return e.uri !== max_votes.uri})
                    console.log(max_votes.song_id)
                    console.log(queue)
                    if(queue.length === 0) queue = null
                    const text = "UPDATE sessions SET queue = $1, next_song = $2 WHERE session_id = $3"
                    const values = [queue, max_votes.song_id, session_id]

                    db.query(text, values, (error2, result2) => {
                        if(error2){
                            res.status(500).json({error: "Database error"})
                        }else{


                            console.log("SPOTIFY ACTION:")
                            console.log(max_votes)
                            console.log(spotify_auth_token)

                            const config = {
                                headers: { Authorization: `Bearer ${spotify_auth_token}` }
                            };

                            const body = {
                                uri: max_votes.uri
                            }

                            axios.post("https://api.spotify.com/v1/me/player/queue?" + new URLSearchParams(body), {}, config).then(res2 => {
                                console.log("YES!")
                                res.status(200).json({uri: max_votes.song_id})
                            }).catch(err2 => {
                                console.log(err2.response.data)
                                if(err2.response.status === 404){
                                    res.status(404).json({error: "No active device"})
                                }else{
                                    res.status(500).json({error: "Spotify error"})
                                }
                                
                            })


                            
                        }
                    })

                    
                }
            }else{
                res.status(400).json({error: "Invalid session"})
            }
        }
    })
})


app.get("/songs", (req, res) => {
    const {session_id, ids} = req.query

    db.query(`SELECT spotify_auth_token FROM sessions WHERE session_id = '${session_id}';`, (error, result) => {
        if(error){
            res.status(500).json({error: "Database error"})
        }else{
            if(result.rowCount > 0){
                const {spotify_auth_token} = result.rows[0]
                const config = {
                    headers: { Authorization: `Bearer ${spotify_auth_token}` }
                };
                axios.get("https://api.spotify.com/v1/tracks?" + ids, config).then(res => {
                    res.status(200).json(res.data)
                }).catch(err => {
                    res.status(400).json({error: "Spotify error"})
                })
            }else{
                res.status(400).json({error: "Invalid session"})
            }
        }
    })

    
})

app.post("/vote", (req, res) => {
    const {session_id, song_id, amount} = req.body
    console.log(req.body)
    db.query(`SELECT queue FROM sessions WHERE session_id = '${session_id}';`, (error, result) => {
        if(error){
            res.status(500).json({error: "Database error"})
        }else{
            if(result.rowCount > 0){
                const {queue} = result.rows[0]
                const index = queue.findIndex(elem => elem.song_id === song_id)
                if(index === null){
                    res.status(400).json({error: "Bad request"})
                }else{
                    queue[index].votes += amount
                    const text = "UPDATE sessions SET queue = $1 WHERE session_id = $2;"
                    const values = [JSON.stringify(queue), session_id]
                    db.query(text, values, (error2, result2) => {
                        if(error2){
                            res.status(500).json({error: "Database error"})
                        }else{
                            res.status(200).json({song_id})
                        }   
                    })
                }
            }else{
                res.status(400).json({error: "Invalid session"})
            }
        }
    })
})

const pollSongStatus = () => {
    db.query("SELECT session_id, spotify_auth_token, spotify_refresh_token, time_created, queue, next_song FROM sessions;", (error, result) => {
        const sessions = []
        for(let i = 0; i < result.rows.length; i++){
            const day= 1000 * 60 * 60 * 24;
            if((Date.now() - day) > result.rows[i].time_created){
                continue
            }else{
                sessions.push(result.rows[i])
            }
        }
        
        sessions.forEach(session => {
            const config = {
                headers: { Authorization: `Bearer ${session.spotify_auth_token}` }
            };
            axios.get("https://api.spotify.com/v1/me/player/queue", config).then(res => {
                const {currently_playing} = res.data
                const spotify_queue = res.data.queue

                if(spotify_queue.filter(elem => elem.id === session.next_song).length === 0){
                    //NEXT SONG
                    if(session.queue.length > 0){
                        let nextsong = session.queue.reduce((max, song) => max.votes > song.votes ? max : song)
                        if(nextsong.votes === 0) nextsong = session.queue[0]
                        let newQueue = session.queue.filter(elem => elem.song_id !== nextsong.song_id)
                        const newNextSong = nextsong.song_id
                        if(newQueue.length === 0) newQueue = null
                        console.log("UPDATE")
                        const text = "UPDATE sessions SET queue = $1, next_song = $2 WHERE session_id = $3;"
                        const values = [JSON.stringify(newQueue), newNextSong, session.session_id]
                        db.query(text, values, (error2, result2) => {
                            if(error2){
                                console.log("ERROR2")
                                console.log(error2.stack)
                            }else{

                                axios.post("https://api.spotify.com/v1/me/player/queue?uri="+nextsong.uri, {}, config).then(res2 => {
                                    //POLL USERS
                                    console.log("YES")
                                }).catch(err2 => {
                                    console.log(err2)
                                })

                            }
                        })
                    }
                }else{
                    console.log("IN QUEUE")
                }
                

            }).catch(err => {
                console.log(err)
                if(err.response.status === 401){
                    const body = {
                        grant_type: "refresh_token",
                        refresh_token: session.spotify_refresh_token
                    }
                    axios.post("https://accounts.spotify.com/api/token", new URLSearchParams(body), {headers:{'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')}}).then(response2 => {
                        db.query(`UPDATE sessions SET spotify_auth_token = '${response2.data.access_token}' WHERE session_id = '${session.session_id}';`, (error, result) => {
                            if(error){
                                console.log("error1")
                            }else{
                                console.log("error2")
                                pollSongStatus()
                            }
                        })
                        
                    }).catch(err => {
                        console.log("error13")
                    })
                }
            })
        })
    })
}


/*

const task = setInterval(() => {
    pollSongStatus()
}, 60000)
*/

app.ws("/socket", (ws, req) => {
    ws.on("message", (msg) => {
        console.log("msg")
    })
    console.log("socket", req)
})

console.log(eWs.getWss().clients)

module.exports = app
