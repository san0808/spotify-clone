import React from 'react'

import { getProviders ,signIn} from 'next-auth/react'

function Login({providers}) {
  return (
    <div className='flex flex-col bg-black items-center justify-center min-h-screen w-full'>
        <img className='w-52 mb-5' src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png'    alt='spotify logo' />
        {Object.values(providers).map((provider) => (
            <div key={provider.name}>
                <button onClick={() => signIn(provider.id ,  {callbackUrl: "/" }) } className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg'>
                    Sign in with {provider.name}
                </button>
            </div>
        )
        )}
    
    </div>
  )
}

export default Login

export const getServerSideProps = async () => {
    const providers= await getProviders();

    return {
        props: { providers },
    }
}