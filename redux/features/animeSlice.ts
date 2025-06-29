import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface CoverImage {
  large?: string;
  extraLarge?: string;
}

export interface Studio {
  name: string;
}

export interface StartDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  description?: string;
  coverImage: CoverImage;
  bannerImage?: string;
  genres?: string[];
  episodes?: number;
  status?: string;
  startDate?: StartDate;
  endDate?: StartDate;
  averageScore?: number;
  popularity?: number;
  studios?: {
    nodes: Studio[];
  };
  trailer?: Trailer;
}

interface AnimeState {
  trendingAnime: Anime[];
  popularAnime: Anime[];
  selectedAnime: Anime | null;
  loading: boolean;
  error: string | null;
  searchResults: Anime[];
  searchLoading: boolean;
}

const initialState: AnimeState = {
  trendingAnime: [],
  popularAnime: [],
  selectedAnime: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    // Trending anime actions
    fetchTrendingAnimeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTrendingAnimeSuccess: (state, action: PayloadAction<Anime[]>) => {
      state.loading = false;
      state.trendingAnime = action.payload;
      state.error = null;
    },
    fetchTrendingAnimeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Popular anime actions
    fetchPopularAnimeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPopularAnimeSuccess: (state, action: PayloadAction<Anime[]>) => {
      state.loading = false;
      state.popularAnime = action.payload;
      state.error = null;
    },
    fetchPopularAnimeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Selected anime actions
    fetchAnimeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSelectedAnimeSuccess: (state, action: PayloadAction<Anime>) => {
      state.loading = false;
      state.selectedAnime = action.payload;
      state.error = null;
    },
    fetchAnimeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedAnime: (state) => {
      state.selectedAnime = null;
    },

    // Search actions
    searchAnimeStart: (state) => {
      state.searchLoading = true;
      state.error = null;
    },
    searchAnimeSuccess: (state, action: PayloadAction<Anime[]>) => {
      state.searchLoading = false;
      state.searchResults = action.payload;
      state.error = null;
    },
    searchAnimeFailure: (state, action: PayloadAction<string>) => {
      state.searchLoading = false;
      state.error = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
});

export const {
  fetchTrendingAnimeStart,
  fetchTrendingAnimeSuccess,
  fetchTrendingAnimeFailure,
  fetchPopularAnimeStart,
  fetchPopularAnimeSuccess,
  fetchPopularAnimeFailure,
  fetchAnimeStart,
  fetchSelectedAnimeSuccess,
  fetchAnimeFailure,
  clearSelectedAnime,
  searchAnimeStart,
  searchAnimeSuccess,
  searchAnimeFailure,
  clearSearchResults,
} = animeSlice.actions;

export default animeSlice.reducer;