import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractErrorMessage } from "../../services/http.js";
import {
	createCommentRequest,
	createPostRequest,
	deleteCommentRequest,
	deletePostRequest,
	getCommentsRequest,
	getPostLikesRequest,
	getPostsRequest,
	likeCommentRequest,
	likePostRequest,
	unlikeCommentRequest,
	unlikePostRequest,
	updateCommentRequest,
	updatePostRequest,
} from "./services/postService.js";

export const fetchPosts = createAsyncThunk("post/fetchPosts", async (params, { rejectWithValue }) => {
	try {
		const response = await getPostsRequest(params);
		return response;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const fetchMorePosts = createAsyncThunk("post/fetchMorePosts", async (params, { rejectWithValue }) => {
	try {
		const response = await getPostsRequest(params);
		return response;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const fetchUserPosts = createAsyncThunk("post/fetchUserPosts", async ({ authorId, page = 1, limit = 10 }, { rejectWithValue }) => {
	try {
		const response = await getPostsRequest({ authorId, page, limit });
		return { ...response, page };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const createPost = createAsyncThunk("post/createPost", async (payload, { rejectWithValue }) => {
	try {
		const response = await createPostRequest(payload);
		return response.data;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const updatePost = createAsyncThunk("post/updatePost", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const response = await updatePostRequest(id, payload);
		return response.data;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const deletePost = createAsyncThunk("post/deletePost", async (id, { rejectWithValue }) => {
	try {
		await deletePostRequest(id);
		return id;
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const fetchPostLikes = createAsyncThunk("post/fetchPostLikes", async (postId, { rejectWithValue }) => {
	try {
		const response = await getPostLikesRequest(postId);
		return { postId, ...response };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const toggleLike = createAsyncThunk("post/toggleLike", async ({ id, liked }, { rejectWithValue }) => {
	try {
		if (liked) {
			await unlikePostRequest(id);
		} else {
			await likePostRequest(id);
		}
		return { id, liked: !liked };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const fetchComments = createAsyncThunk("post/fetchComments", async (postId, { rejectWithValue }) => {
	try {
		const response = await getCommentsRequest(postId);
		return { postId, comments: response.data };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const createComment = createAsyncThunk("post/createComment", async (payload, { rejectWithValue }) => {
	try {
		const response = await createCommentRequest(payload);
		return { postId: payload.postId, comment: response.data };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const updateComment = createAsyncThunk("post/updateComment", async ({ id, postId, content }, { rejectWithValue }) => {
	try {
		const response = await updateCommentRequest(id, content);
		return { postId, comment: response.data };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const deleteComment = createAsyncThunk("post/deleteComment", async ({ id, postId }, { rejectWithValue }) => {
	try {
		await deleteCommentRequest(id);
		return { id, postId };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

export const toggleCommentLike = createAsyncThunk("post/toggleCommentLike", async ({ id, postId, liked }, { rejectWithValue }) => {
	try {
		if (liked) {
			await unlikeCommentRequest(id);
		} else {
			await likeCommentRequest(id);
		}
		return { id, postId, liked: !liked };
	} catch (error) {
		return rejectWithValue(extractErrorMessage(error));
	}
});

//  Slice  
const postSlice = createSlice({
	name: "post",
	initialState: {
		posts: [],
		meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
		status: "idle",
		likedPostIds: {},
		likedCommentIds: {},
		postLikes: {},
		comments: {},
		commentStatus: {},
		// user-specific posts (for profile page)
		userPosts: [],
		userPostsMeta: { page: 1, limit: 10, total: 0, totalPages: 1 },
		userPostsStatus: "idle",
		error: null,
	},
	reducers: {
		clearPostError(state) {
			state.error = null;
		},
		// Seed liked state from outside 
		setLikedPosts(state, action) {
			state.likedPostIds = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// fetch posts
			.addCase(fetchPosts.pending, (state) => { state.status = "loading"; })
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.posts = action.payload.data;
				state.meta = action.payload.meta;
				state.status = "succeeded";
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			// fetch more (pagination)
			.addCase(fetchMorePosts.fulfilled, (state, action) => {
				state.posts = [...state.posts, ...action.payload.data];
				state.meta = action.payload.meta;
			})
			// create post
			.addCase(createPost.fulfilled, (state, action) => {
				state.posts.unshift(action.payload);
				state.meta.total += 1;
			})
			// update post
			.addCase(updatePost.fulfilled, (state, action) => {
				const idx = state.posts.findIndex((p) => p.id === action.payload.id);
				if (idx !== -1) state.posts[idx] = action.payload;
			})
			// delete post
			.addCase(deletePost.fulfilled, (state, action) => {
				state.posts = state.posts.filter((p) => p.id !== action.payload);
				state.meta.total = Math.max(0, state.meta.total - 1);
				// also remove from userPosts
				state.userPosts = state.userPosts.filter((p) => p.id !== action.payload);
				state.userPostsMeta.total = Math.max(0, state.userPostsMeta.total - 1);
			})
			// fetch user posts
			.addCase(fetchUserPosts.pending, (state, action) => {
				state.userPostsStatus = "loading";
			})
			.addCase(fetchUserPosts.fulfilled, (state, action) => {
				if (action.payload.page === 1) {
					state.userPosts = action.payload.data;
				} else {
					state.userPosts = [...state.userPosts, ...action.payload.data];
				}
				state.userPostsMeta = action.payload.meta;
				state.userPostsStatus = "succeeded";
			})
			.addCase(fetchUserPosts.rejected, (state, action) => {
				state.userPostsStatus = "failed";
				state.error = action.payload;
			})
			// toggle like (optimistic UI)
			.addCase(toggleLike.pending, (state, action) => {
				const { id, liked } = action.meta.arg;
				const post = state.posts.find((p) => p.id === id);
				if (post) {
					post.likesCount += liked ? -1 : 1;
					state.likedPostIds[id] = !liked;
				}
			})
			.addCase(toggleLike.rejected, (state, action) => {
				// revert
				const { id, liked } = action.meta.arg;
				const post = state.posts.find((p) => p.id === id);
				if (post) {
					post.likesCount += liked ? 1 : -1;
					state.likedPostIds[id] = liked;
				}
			})
			// fetch post likes
			.addCase(fetchPostLikes.pending, (state, action) => {
				state.postLikes[action.meta.arg] = {
					...(state.postLikes[action.meta.arg] || {}),
					status: "loading",
				};
			})
			.addCase(fetchPostLikes.fulfilled, (state, action) => {
				state.postLikes[action.payload.postId] = {
					status: "succeeded",
					count: action.payload.count,
					users: action.payload.users,
				};
			})
			.addCase(fetchPostLikes.rejected, (state, action) => {
				state.postLikes[action.meta.arg] = {
					...(state.postLikes[action.meta.arg] || {}),
					status: "failed",
					error: action.payload,
				};
			})
			// fetch comments
			.addCase(fetchComments.pending, (state, action) => {
				state.commentStatus[action.meta.arg] = "loading";
			})
			.addCase(fetchComments.fulfilled, (state, action) => {
				const { postId, comments } = action.payload;
				state.comments[postId] = comments;
				state.commentStatus[postId] = "succeeded";
			})
			// create comment
			.addCase(createComment.fulfilled, (state, action) => {
				const { postId, comment } = action.payload;
				if (!state.comments[postId]) state.comments[postId] = [];
				state.comments[postId].push(comment);
				const post = state.posts.find((p) => p.id === postId);
				if (post) post.commentsCount += 1;
			})
			// update comment
			.addCase(updateComment.fulfilled, (state, action) => {
				const { postId, comment } = action.payload;
				if (state.comments[postId]) {
					const idx = state.comments[postId].findIndex((c) => c.id === comment.id);
					if (idx !== -1) state.comments[postId][idx] = comment;
				}
			})
			// delete comment
			.addCase(deleteComment.fulfilled, (state, action) => {
				const { id, postId } = action.payload;
				if (state.comments[postId]) {
					state.comments[postId] = state.comments[postId].filter((c) => c.id !== id);
				}
				const post = state.posts.find((p) => p.id === postId);
				if (post) post.commentsCount = Math.max(0, post.commentsCount - 1);
			})
			// toggle comment like (optimistic)
			.addCase(toggleCommentLike.pending, (state, action) => {
				const { id, postId, liked } = action.meta.arg;
				if (state.comments[postId]) {
					const comment = state.comments[postId].find((c) => c.id === id);
					if (comment) {
						comment.likesCount += liked ? -1 : 1;
						state.likedCommentIds[id] = !liked;
					}
				}
			})
			.addCase(toggleCommentLike.rejected, (state, action) => {
				const { id, postId, liked } = action.meta.arg;
				if (state.comments[postId]) {
					const comment = state.comments[postId].find((c) => c.id === id);
					if (comment) {
						comment.likesCount += liked ? 1 : -1;
						state.likedCommentIds[id] = liked;
					}
				}
			});
	},
});

export const { clearPostError, setLikedPosts } = postSlice.actions;
export default postSlice.reducer;
