import axios from "axios"

async function getAccessToken() {

     //code 
    const code = new URLSearchParams(window.location.search).get('code')

      const res = await axios.post(
      "/login/oauth/access_token",
      {
        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
        client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
        code:code
      }
      
    )
 
    const access_token = new URLSearchParams(res.data).get('access_token')
    return access_token
    
}

async function getUserData(access_token: string) {
  const userResponse = await axios.get(
    "/user",
    {
        headers: {
            'Authorization':`Bearer ${access_token}`
        }
    }
)
return userResponse.data

}

export  {getAccessToken, getUserData}