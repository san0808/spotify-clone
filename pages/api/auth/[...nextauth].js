import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
  try{
    spotifyApi.setRefreshToken(token.refreshToken)
    spotifyApi.setAccessToken(token.accessToken)

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
      signIn: "/login",
    },
    callbacks: {
      async jwt({ token, user, account }) {
        //initial sign in
        if(account&& user)
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
    }

}}

export default NextAuth(authOptions)