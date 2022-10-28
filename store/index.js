import axios from "axios"

const server_ip = process.env.serverURL;

export const state = () => ({
    session_id: null,
    queue: [],
    next_song: null
})

export const getters = {
    getSessionId(state){
        return state.session_id
    },
    getQueue(state){
        return state.queue
    },
    getNextSong(state){
        return state.next_song
    }
}

export const mutations = {
    setSessionId(state, id){
        state.session_id = id
    },
    setQueue(state, queue){
        state.queue = queue
    },
    addToQueue(state, song){
        state.queue.push(song)
    },
    removeFromQueue(state, song_uri){
        state.queue = state.queue.filter(song => song.uri !== song_uri)
    },
    setNextSongFull(state, song){
        state.nextSong = song
    },
    setNextSong(state, payload){
        state.next_song = {
            uri: payload.uri,
            name: payload.name,
            artist: payload.artist,
            img: payload.img,
            duration_ms: payload.duration_ms,
            song_id: payload.song_id
        }
    },
    voteQueueItem(state, payload){

        state.queue[payload.index].votes += payload.amount
    },
    setVoteState(state, payload, id){
        const {index, vote_state} = payload
        switch(vote_state){
            case 0:
                state.queue[index].upvoted[id] = false
                state.queue[index].downvoted[id] = false
                break
            case 1:
                state.queue[index].upvoted[id] = true
                state.queue[index].downvoted[id] = false
                break
            case 2:
                state.queue[index].upvoted[id] = false
                state.queue[index].downvoted[id] = true
                break
            default:
                state.queue[index].upvoted[id] = false
                state.queue[index].downvoted[id] = false
                break
        }
    }
}

export const actions = {
    async fetchToken({commit}, code){
        const body = {
            code
        }
        const res = await axios.post(`${server_ip}/api/token`, body)
        return {auth_token: res.data.access_token, refresh_token: res.data.refresh_token}
    },
    async createSession({commit}, {auth_token, refresh_token}){
        const body = {
            auth_token,
            refresh_token
        }
        const res = await axios.post(`${server_ip}/api/session`, body)
        commit("setSessionId", res.data.session_id)
        return res.data.session_id
    },
    async searchSpotify({dispatch}, payload){
        console.log(payload)
        
        return new Promise((resolve, reject) => {
            axios.get(`${server_ip}/api/search?` + new URLSearchParams({query: payload.searchString, session_id: payload.session_id})).then(res => {
                resolve(res.data)
            }).catch(err => {
                console.log("ERROR1")
                if(err.response){
                    console.log("ERROR2")
                    if(err.response.status === 401){
                        console.log("REFRESH")
                        dispatch("refreshToken", payload.session_id).then(result => {
                            console.log("YES")
                            resolve(dispatch("searchSpotify", payload))
                        }).catch(error => {
                            console.log("NO")
                            reject(null)
                        })
                    }else{
                        console.log("ERROR3")
                        reject(null)
                    }
                }else{
                    console.log("ERROR4")
                    reject(null)
                }
            })
        })
    },
    async refreshToken({state}, session_id){
        console.log("RERRR")
        console.log(session_id)
        return new Promise((resolve, reject) => {
            axios.post(`${server_ip}/api/refresh`, {session_id}).then(res => {
                console.log("ERROR8")
                resolve(res)
            }).catch(err => {
                console.log("ERROR9")
                reject(null)
            })
        })
    },
    async addQueueItem({state, commit}, payload){

        return new Promise((resolve, reject) => {
            axios.post(`${server_ip}/api/queue`, {session_id: payload.session_id, song_uri: payload.song_uri,
             song_id: payload.song_id , name: payload.name, artist: payload.artist, id: payload.id}).then(res => {
                resolve(true)
            }).catch(err => {
                reject(false)
            })
        })
        

    },
    async removeQueueItem({state, commit}, song_uri){

    },
    async nextSong({commit}, payload){
        return new Promise((resolve, reject) => {
            axios.post(`${server_ip}/api/queue/next`, {session_id: payload.session_id}).then(res => {
                commit("setNextSong", payload.song)
                resolve(res.data.uri)
            }).catch(err => {
                reject(null)
            })
        })
    },
    async voteSong({commit, state}, {song, action, index, session_id, id}){
        //UPVOTE WHEN BOTH CLEAR = 0
        //UPVOTE WHEN UPVOTE     = 1
        //UPVOTE WHEN DOWNVOTE   = 2
        //DOWNVOTE WHEN CLEAR    = 3
        //DOWNVOTE WHEN DOWNVOTE = 4
        //DOWNVOTE WHEN UPVOTE   = 5
        let amount = 0
        let vote_state = 0
        switch(action){
            case 0:
                amount = 1
                vote_state = 1
                break;
            case 1:
                amount = -1
                vote_state = 0
                break;
            case 2:
                amount = 2
                vote_state = 1
                break;
            case 3:
                amount = -1
                vote_state = 2
                break;
            case 4:
                amount = 1
                vote_state = 0
                break;
            case 5:
                amount = -2
                vote_state = 2
                break;
            default:
                amount = 0
        }
        
        //commit("setVoteState", {index, vote_state, id})
        //commit("voteQueueItem", {index, amount})
        axios.post(`${server_ip}/api/vote`, {session_id, song_id: song.song_id, amount, id, vote_state: (action < 3 ? true : false)})
    },
    restoreSession({commit, state}, session_id){
        console.log(session_id)
        return new Promise((resolve, reject) => {
            axios.get(`${server_ip}/api/queue?session_id=` + session_id).then(res => {
                console.log(res.data)
                const {queue, next_song, qrcode} = res.data
                commit("setQueue", queue)
                commit("setNextSongFull", next_song)
                resolve({queue, next_song, qrcode})
            }).catch(err => {
                console.log(err.response)
                reject(false)
            })
        })
    }
}