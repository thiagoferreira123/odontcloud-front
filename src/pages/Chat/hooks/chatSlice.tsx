import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVICE_URL } from '../../../config';

const initialState = {
  items: [],
  loading: false,
  selectedPatient: null,
  currentMode: 'chat', // chat - call
  selectedTab: 'messages',
  currentCall: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    receiveService(state, action) {
      const { items, loading } = action.payload;
      state.items = items;
      state.loading = loading;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    chatSetSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
    chatSetSelectedChat(state, action) {
      if (action.payload && action.payload.messages && action.payload.messages.length > 0) {
        state.selectedTab = 'messages';
      }
      state.selectedPatient = action.payload;
    },
    chatSetCurrentCall(state, action) {
      state.currentCall = action.payload;
    },
    chatChangeMode(state, action) {
      state.currentMode = action.payload;
    },
  },
});
const { setLoading, receiveService } = chatSlice.actions;

export const { chatChangeMode, chatSetSelectedChat, chatSetSelectedTab, chatSetCurrentCall } = chatSlice.actions;

export const getItems = () => async (dispatch, getState) => {
  const state = getState();
  dispatch(setLoading(true));
  const response = await axios.get(`${SERVICE_URL}/ferramentas/chat`);
  const items = response.data;
  dispatch(receiveService({ items, loading: false }));
  if (state.chat.selectedPatient === null) dispatch(chatSetSelectedChat(items.filter((x) => x.messages.length > 0)[0]));
};

export const selectChat =
  ({ chat }) =>
  async (dispatch) => {
    if (chat !== null) {
      dispatch(setLoading(true));
      const response = await axios.put(`${SERVICE_URL}/ferramentas/chat/read`, { id: chat.id });
      const items = response.data;
      dispatch(receiveService({ items, loading: false }));
      dispatch(chatSetSelectedChat(items.filter((x) => x.id === chat.id)[0]));
    } else {
      dispatch(chatSetSelectedChat(null));
    }
  };

const chatReducer = chatSlice.reducer;

export default chatReducer;
