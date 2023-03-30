import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
  try{
    spotifyApi.setRefreshToken(token.refreshToken)
    spotifyApi.setAccessToken(token.accessToken)

    const refreshedToken = await spotifyApi.refreshAccessToken();
    console.log("refreshed token", refreshedToken);

    return{
    ...token,
    accessToken: refreshedToken.access_Token,
    accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,//= one hour as 3600 seconds returns from spotify api
    refreshToken: refreshedToken.refresh_Token ?? token.refreshToken, //replace if new token is given or fall back to old one
      
  }
}
  catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
      

    }
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],

    secret: process.env.JWT_SECRET,
    pages: {
      signIn: "/Login",
    },
    secret: process.env.JWT_SECRET,
    callbacks: {
      async jwt({ token, user, account }) {
        //initial sign in
        if(account && user)
        {
          return {
            ...token,
            accessToken: account.access_Token,
            refreshToken: account.refresh_Token,
            username: account.providerAccountId,
            accessTokenExpires: account.expires_at + 1000,
          }
        }
        //return previous tokenif not expired yet
        if (Date.now() < token.accessTokenExpires) {
          return token
        }
        //access token expires, refresh it
        console.log ("refreshing token has EXPIRED , REFRESHING")
        return await refreshAccessToken(token)
        

    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    
    },

}}

export default NextAuth(authOptions)