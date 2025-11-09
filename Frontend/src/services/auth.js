const tokenKey='token'; 
const userKey='user'; 

const saveUser=(user)=>{
    localStorage.setItem(userKey,JSON.stringify(user)) 
}

const saveAuthToken=(token)=>{
    localStorage.setItem(tokenKey,token)

}

const getCurrentUser = () => {
    try {
        const user = localStorage.getItem(userKey);
        // Check if user exists and is not the string "undefined"
        if (!user || user === 'undefined' || user === 'null') {
            return null;
        }
        return JSON.parse(user);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

const getAuthToken=()=>localStorage.getItem(tokenKey) || null ;

const logoutUser=()=>{
    localStorage.removeItem(userKey) 
    localStorage.removeItem(tokenKey)
}
const auth={
    saveUser, 
    saveAuthToken, 
    getCurrentUser, 
    getAuthToken,
    logoutUser
}; 
export default auth