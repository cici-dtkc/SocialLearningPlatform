import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractErrorMessage } from "../../services/http.js";
import {
	getCurrentUserRequest,
	loginRequest,
	logoutRequest,
	registerRequest,
	updateAvatarRequest,
	updateMeRequest,
} from "./services/authService.js";

const tokenKey = "slp_token";
const storedToken = localStorage.getItem(tokenKey);

const persistSession = (token) => {
	if (token) localStorage.setItem(tokenKey, token);
	else localStorage.removeItem(tokenKey);
};

const initialState = {
	token: storedToken,
	user: null,
	status: storedToken ? "loading" : "idle",
	initialized: !storedToken,
	error: null,
};

export const loadCurrentUser = createAsyncThunk("auth/loadCurrentUser", async (_, { rejectWithValue }) => {
	try {
		const response = await getCurrentUserRequest();
		return response.data;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
	try {
		const response = await loginRequest(payload);
		return { token: response.accessToken, user: response.data };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const registerUser = createAsyncThunk("auth/registerUser", async (payload, { rejectWithValue }) => {
	try {
		const response = await registerRequest(payload);
		return { token: null, user: response.data };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
	try {
		await logoutRequest();
		return true;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const updateMe = createAsyncThunk("auth/updateMe", async (payload, { rejectWithValue }) => {
	try {
		const response = await updateMeRequest(payload);
		return response.data;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const updateAvatar = createAsyncThunk("auth/updateAvatar", async (file, { rejectWithValue }) => {
	try {
		const response = await updateAvatarRequest(file);
		return response.data;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearAuthError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadCurrentUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loadCurrentUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.status = "succeeded";
				state.initialized = true;
			})
			.addCase(loadCurrentUser.rejected, (state) => {
				persistSession(null);
				state.token = null;
				state.user = null;
				state.status = "failed";
				state.initialized = true;
			})
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.token = action.payload.token;
				state.user = action.payload.user;
				state.status = "succeeded";
				state.initialized = true;
				persistSession(action.payload.token);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Login failed";
			})
			.addCase(registerUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.status = "succeeded";
				state.initialized = true;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Register failed";
			})
			.addCase(logoutUser.fulfilled, (state) => {
				persistSession(null);
				state.token = null;
				state.user = null;
				state.status = "idle";
				state.initialized = true;
			})
			.addCase(updateMe.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(updateAvatar.fulfilled, (state, action) => {
				state.user = action.payload;
			});
	},
});

export const { clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthInitialized = (state) => state.auth.initialized;

export default authSlice.reducer;

