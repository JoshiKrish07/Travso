
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const stateCityUrl = import.meta.env.VITE_STATE_CITY_URL;

// Async thunk to fetch cities for a given state
export const fetchCities = createAsyncThunk(
    'stateCity/fetchCities',
    async ({ state, country }, { rejectWithValue }) => {
      try {
        const response = await fetch(stateCityUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country,
            state,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
  
        const { data } = await response.json();
        return data || []; // Returning the list of cities
      } catch (error) {
        console.error('Error fetching cities:', error);
        return rejectWithValue(error.message); // Rejecting the thunk with the error message
      }
    }
  );

// New thunk to fetch states for a given country
export const fetchStates = createAsyncThunk(
    'stateCity/fetchStates',
    async (country, { rejectWithValue }) => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          // mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
  
        const { data } = await response.json();
        // console.log("====state data===>", data.states);
        return data.states || []; // Returning the list of states
      } catch (error) {
        console.error('Error fetching states:', error);
        return rejectWithValue(error.message); // Rejecting the thunk with the error message
      }
    }
  );
  
  

const stateCitySlice = createSlice({
  name: 'stateCity',
  initialState: {
    states: [],
    cities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload; // Save cities to store
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // New fetchStates thunk
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload; // Save states to store
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Capture the error message from the rejected thunk
      });
  },
});

export default stateCitySlice.reducer;
