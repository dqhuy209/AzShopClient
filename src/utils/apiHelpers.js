export const withCustomLoading = (config = {}) => ({
  ...config,
  showLoading: true,
})

export const withoutLoading = (config = {}) => ({
  ...config,
  showLoading: false,
})
