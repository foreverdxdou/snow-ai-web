import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import * as api from '@/api/knowledge';
import type { KnowledgeState } from '../../types/knowledge';

const initialState: KnowledgeState = {
  knowledgeBases: [],
  categories: [],
  documents: [],
  tags: [],
  loading: false,
  error: null
};

// 异步 Action
export const fetchKnowledgeBases = createAsyncThunk(
  'knowledge/fetchKnowledgeBases',
  async (params: any) => {
    const response = await api.getKnowledgeBaseList(params);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'knowledge/fetchCategories',
  async (kbId: number) => {
    const response = await api.getCategoryTree(kbId);
    return response.data;
  }
);

export const fetchDocuments = createAsyncThunk(
  'knowledge/fetchDocuments',
  async (params: any) => {
    const response = await api.getDocumentList(params);
    return response.data;
  }
);

export const fetchTags = createAsyncThunk(
  'knowledge/fetchTags',
  async (params: any) => {
    const response = await api.getTagList(params);
    return response.data;
  }
);

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 知识库列表
      .addCase(fetchKnowledgeBases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKnowledgeBases.fulfilled, (state, action) => {
        state.loading = false;
        state.knowledgeBases = action.payload.records;
      })
      .addCase(fetchKnowledgeBases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      // 分类树
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      // 文档列表
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.records;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      // 标签列表
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.records;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  }
});

export const { clearError } = knowledgeSlice.actions;

export default knowledgeSlice.reducer; 