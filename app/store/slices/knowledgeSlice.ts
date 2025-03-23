import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KnowledgeItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeState {
  items: KnowledgeItem[];
  loading: boolean;
  error: string | null;
  selectedItem: KnowledgeItem | null;
}

const initialState: KnowledgeState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<KnowledgeItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<KnowledgeItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<KnowledgeItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<KnowledgeItem | null>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setLoading,
  setError,
  setSelectedItem,
} = knowledgeSlice.actions;

export default knowledgeSlice.reducer; 