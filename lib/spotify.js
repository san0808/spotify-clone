import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'streaming',
    'user-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-follow-read',
].join(',');

const params ={
    scope: scopes,

}

const queryParamString = new URLSearchParams(params).toString();

//const LOGIN_URL =  `https://accounts.spotify.com/authorize?${queryParamString}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`;
const LOGIN_URL ='https://accounts.spotify.com/authorize?' + queryParamString.toString();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});



export default spotifyApi ;
export { LOGIN_URL};

// user-read-private: This scope allows your application to read a user's private information, such as their display name and profile picture.
// user-library-read: This scope allows your application to read a user's saved tracks and albums.
// user-follow-read: This scope allows your application to read a user's followed artists and users.
// playlist-read-private: This scope allows your application to read a user's private playlists.
// playlist-modify-public: This scope allows your application to modify a user's public playlists.
// playlist-modify-private: This scope allows your application to modify a user's private playlists.