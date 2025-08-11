/**
 * Format currency to Vietnamese Dong with rounding
 * @param {number|string} amount - The amount to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.showSymbol - Whether to show currency symbol (default: true)
 * @param {string} options.symbol - Currency symbol to use (default: 'đ')
 * @param {boolean} options.symbolPosition - Position of symbol: 'after' or 'before' (default: 'after')
 * @param {number} options.roundTo - Round to nearest value (default: 1000 for thousands)
 * @param {boolean} options.enableRounding - Enable automatic rounding (default: true)
 * @returns {string} Formatted currency string
 */
export const formatVND = (amount, options = {}) => {
  const {
    showSymbol = true,
    symbol = "đ",
    symbolPosition = "after",
    roundTo = 1000,
    enableRounding = true,
  } = options;

  // Handle null, undefined, or invalid values
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? (symbolPosition === "after" ? "0đ" : "đ0") : "0";
  }

  // Convert to number
  let numAmount =
    typeof amount === "string" ? parseFloat(amount) : Number(amount);

  // Round the amount if rounding is enabled
  if (enableRounding && roundTo > 0) {
    numAmount = Math.round(numAmount / roundTo) * roundTo;
  }

  // Format with thousand separators
  const formatted = numAmount.toLocaleString("vi-VN");

  // Add currency symbol
  if (showSymbol) {
    return symbolPosition === "after"
      ? `${formatted}${symbol}`
      : `${symbol}${formatted}`;
  }

  return formatted;
};

/**
 * Format currency with preset rounding options
 */
export const formatVNDRounded = {
  // Round to nearest thousand (1,000đ)
  thousands: (amount) => formatVND(amount, { roundTo: 1000 }),

  // Round to nearest ten thousand (10,000đ)
  tenThousands: (amount) => formatVND(amount, { roundTo: 10000 }),

  // Round to nearest hundred thousand (100,000đ)
  hundredThousands: (amount) => formatVND(amount, { roundTo: 100000 }),

  // No rounding, exact amount
  exact: (amount) => formatVND(amount, { enableRounding: false }),

  // Round to nearest 500đ
  fiveHundreds: (amount) => formatVND(amount, { roundTo: 500 }),
};

/**
 * Format price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice, options = {}) => {
  if (minPrice === maxPrice) {
    return formatVND(minPrice, options);
  }

  return `${formatVND(minPrice, options)} - ${formatVND(maxPrice, options)}`;
};

/**
 * Format discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {string} Formatted discount percentage
 */
export const formatDiscountPercentage = (originalPrice, discountedPrice) => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return "0%";
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(discount)}%`;
};

// Export default function
export default formatVND;
