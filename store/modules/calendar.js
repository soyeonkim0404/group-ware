import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_HOST = 'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService';
const API_SERVICE_KEY =
  'FeE6SRE31uu7lqhFV8Gpg3lIn1Xz6KnoPgtlG+uW+LdSO8XW8EsS3YTAZK5rmvwRb2Epj5nCKkZzO2m/e136/w==';

const keywords = ['getHoliDeInfo', 'getRestDeInfo', 'getAnniversaryInfo'];
const addHoliday = [{ name: '근로자의 날', date: '0501' }];

export const loadHoliday = createAsyncThunk(
  'calendar/loadHoliday',
  async (year, thunkAPI) => {
    if (!year) year = new Date().getFullYear();
    const promiseData = [];
    let result = [];

    keywords.forEach((keyword) => {
      const api = axios({
        url: `${API_HOST}/${keyword}`,
        params: {
          ServiceKey: API_SERVICE_KEY,
          solYear: year,
          _type: 'json',
          numOfRows: 9999,
        },
      });

      promiseData.push(api);
    });

    await Promise.all(promiseData).then((response) => {
      return response.map(({ data }) => {
        if (!data.response?.body?.items) return;

        const holidayList = result.map((day) => day.locdate);
        const parallelResponse = data.response.body.items.item
          .filter((day) => day.isHoliday === 'Y')
          .filter((day) => !holidayList.includes(day.locdate));
        addHoliday.forEach((o) => {
          parallelResponse.push({
            dateKind: '00',
            dateName: o.name,
            isHoliday: 'Y',
            locdate: Number(year + o.date),
            seq: 1,
          });
        });

        result = [...result, ...parallelResponse];
      });
    });

    return { year: year, data: result };
  }
);

const initialState = {
  data: [],
};

const calendarSlice = createSlice({
  name: 'slice/calendar',
  initialState,
  reducers: {
    destroy: (state, action) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHoliday.pending, (state, action) => {
        console.log('pending');
      })
      .addCase(loadHoliday.fulfilled, (state, action) => {
        console.log('fulfilled');

        return {
          ...state,
          data:
            state.data.filter((o) => o.year === action.payload.year).length > 0
              ? state.data.map((o) =>
                  o.year === action.payload.year
                    ? {
                        year: action.payload.year,
                        data: action.payload.data,
                        version: Date.now(),
                      }
                    : o
                )
              : [
                  ...state.data,
                  {
                    year: action.payload.year,
                    data: action.payload.data,
                    version: Date.now(),
                  },
                ],
        };
      })
      .addCase(loadHoliday.rejected, (state, action) => {
        console.log('rejected');
      });
  },
});

export const { refresh, destroy, get } = calendarSlice.actions;
export default calendarSlice.reducer;
