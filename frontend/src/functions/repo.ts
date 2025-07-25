import axios from "axios";

async function repo (token:String){
    const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });
    return response.data;
    
}

export {repo}