import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Product = {
  id: string;
  imgSrc: string;
  title: string;
  price: string;
  amount: number;
};

type CartState = {
  cart: Product[];
};

const initialState: CartState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      //product
      state.cart.push(action.payload);
    },
    deleteItem(state, action: PayloadAction<string>) {
      //product Id
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    increaseAmount(state, action: PayloadAction<string>) {
      //product Id
      const item = state.cart.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },
    decreaseAmount(state, action: PayloadAction<string>) {
      //product Id
      const item = state.cart.find((item) => item.id === action.payload);
      if (item && item.amount > 1) {
        item.amount -= 1;
      }
    },
  },
});

export const { addItem, deleteItem, increaseAmount, decreaseAmount } =
  cartSlice.actions;
export default cartSlice.reducer;
