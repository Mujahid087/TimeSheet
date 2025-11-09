// import { createSlice,combineReducers } from "@reduxjs/toolkit"; 
// import auth from "../../services/auth";

// const loggedInUser=auth.getCurrentUser() 

// const initalAuthState={
//     isLoggedIn:!!loggedInUser, 
//     user:loggedInUser
// }

// const authSlice=createSlice({
//     name:'auth',
//     initialState:initalAuthState
// }) 

// export default combineReducers({
//     userLogin:authSlice.reducer
// })

// export const isUserLoggedIn=(state)=>state.auth.userLogin.isLoggedIn 
// export const selectUser=(state)=>state.auth.userLogin.user; 
// export const getUserRole=(state)=>{
//     const role=state.auth.userLogin.user?.role.roleName; 
//     return !role ? '' : role.charAt(0).toUpperCase() + role.slice(1);
// }


import { createSlice, combineReducers } from "@reduxjs/toolkit"; 
import auth from "../../services/auth";

const loggedInUser = auth.getCurrentUser();

const initialAuthState = {
    isLoggedIn: !!loggedInUser, 
    user: loggedInUser
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        // ✅ Add these actions
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        }
    }
});

// ✅ Export the actions
export const { setCredentials, logout } = authSlice.actions;

// Keep your existing combineReducers structure
export default combineReducers({
    userLogin: authSlice.reducer
});

// Keep your existing selectors
export const isUserLoggedIn = (state) => state.auth.userLogin.isLoggedIn;
export const selectUser = (state) => state.auth.userLogin.user;
export const getUserRole = (state) => {
    const role = state.auth.userLogin.user?.role?.roleName; // ✅ Added optional chaining
    return !role ? '' : role.charAt(0).toUpperCase() + role.slice(1);
}