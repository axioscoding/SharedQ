import axios from "axios"

export const state = () => ({
    token: null,
    session_id: null
})

export const getters = {
    getToken(state) {
        return state.token
    },
    getSessionId(state){
        return state.session_id
    }
}

export const mutations = {
    setToken(state, token){
        state.token = token
    },
    setSessionId(state, id){
        state.session_id = id
    }
}

export const actions = {
    async fetchToken({commit}, code){
        const body = {
            code
        }
        const res = await axios.post("http://localhost:3000/api/token", body)
        console.log(res.data)
        commit("setToken", res.data.access_token);
        return res.data.access_token
    },
    async createSession({commit}){
        const res = await axios.post("http://localhost:3000/api/session")
        console.log(res.data)
        commit("setSessionId", res.data.id)
        return res.data.id
    },
    async searchSpotify({state}, searchString){
        console.log(searchString);
        const config = {
            headers: { Authorization: `Bearer ${state.token}` }
        };
        await axios.get(`https://api.spotify.com/v1/search?q=${searchString}&type=track`, config).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
        return true
        //const response = await axios.get(`https://api.spotify.com/v1/search?q=${searchString}&type=track`, config);
        //console.log(response);
        //return response.data.items
    },
}