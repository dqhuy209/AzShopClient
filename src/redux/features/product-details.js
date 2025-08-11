import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    id: 0,
    name: "",
    title: "", // keep for backward compatibility
    description: "",
    statusDisplayName: "",
    sellingPrice: 0,
    discountPercent: 0,
    finalPrice: 0,
    images: [],
    videos: [],
    currentCondition: "",
    categoryName: "",
    attributes: [],
    initialSlideIndex: 0, // Thêm field này để lưu vị trí slide bắt đầu
    // Legacy fields for backward compatibility
    reviews: 0,
    price: 0,
    discountedPrice: 0,
    img: "",
    imgs: { thumbnails: [], previews: [] },
  },
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      const payload = action.payload;
      return {
        value: {
          ...payload,
          // Map new API structure to legacy fields for backward compatibility
          title: payload.name || payload.title || "",
          price: payload.sellingPrice || payload.price || 0,
          discountedPrice: payload.finalPrice || payload.discountedPrice || 0,
          imgs: {
            thumbnails: payload.images || [],
            previews: payload.images || [],
          },
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
