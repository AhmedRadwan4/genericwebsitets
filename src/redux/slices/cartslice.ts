import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  cartItems: any[];
};

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
});

export default cartSlice.reducer;
