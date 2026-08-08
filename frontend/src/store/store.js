import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import postReducer from "../features/post/postSlice.js";
import userReducer from "../features/user/userSlice.js";
import groupReducer from "../features/group/groupSlice.js";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		post: postReducer,
		user: userReducer,
		group: groupReducer,
	},
});

