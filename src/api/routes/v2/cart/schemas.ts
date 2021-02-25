const requests = {
  "add-to-cart": {
    required: ["id_m_products", "id_merchant", "qty"],
    type: "object",
    properties: {
      qty: { type: "integer" },
      id_merchant: { type: "integer" },
      id_m_products: { type: "integer" },
    },
    additionalProperties: false,
  },
  "update-product-qty": {
    required: ["qty"],
    type: "object",
    properties: { qty: { type: "integer" } },
    additionalProperties: false,
  },
  checkout: {
    required: ["price_total"],
    type: "object",
    properties: { price_total: { type: "integer" } },
    additionalProperties: false,
  },
};

const responses = {
  carts: {
    type: "object",
    properties: {
      ApiResponse: {
        $ref: "#ApiResponse",
      },
      data: {
        type: "array",
        items: { $ref: "#GetCart" },
      },
    },
  },
};

export default { requests, responses };