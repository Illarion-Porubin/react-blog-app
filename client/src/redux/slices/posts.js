import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts')
  return data;
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags')
  return data;
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  const { data } = await axios.delete(`/posts/${id}`)
  return data;
})

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  }
}

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      console.log(action.payload, 'получение статей')

      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.posts.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      console.log(action.payload, 'получение тегов')

      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    // удаление статей
    [fetchRemovePost.fulfilled]: (state, action) => {
      // console.log(action.payload, 'удаление статей')
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
    },
  }
});

export const postsReducer = postSlice.reducer;