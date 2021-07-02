export const requestHeaders = {
  private: { $ref: '#ApiKeyHeader' },
};

export const requestParams = {
  id: { $ref: '#RouteIdParam' },
};

/**
 * The order of the keys is following the order of the GET
 * routes in Postman
 */
export const requestQuery = {
  topUpHistories: {
    type: 'object',
    properties: {
      orderDirection: { $ref: '#OrderDirectionQuery' },
      orderBy: {
        allOf: [
          { $ref: '#OrderByQuery' },
          { enum: ['created_at', 'balance_request', 'balance_transfer'] },
        ],
      },
      search: { $ref: '#SearchQuery' },
      page: { $ref: '#PageQuery' },
      limit: { $ref: '#LimitQuery' },
    },
  },
  withdrawHistories: {
    type: 'object',
    properties: {
      orderDirection: { $ref: '#OrderDirectionQuery' },
      orderBy: {
        allOf: [{ $ref: '#OrderByQuery' }, { enum: ['created_at', 'balance_request'] }],
      },
      search: { $ref: '#SearchQuery' },
      page: { $ref: '#PageQuery' },
      limit: { $ref: '#LimitQuery' },
    },
  },
  topUp: {
    type: 'object',
    properties: {
      orderDirection: { $ref: '#OrderDirectionQuery' },
      orderBy: {
        allOf: [
          { $ref: '#OrderByQuery' },
          { enum: ['created_at', 'balance_request', 'balance_transfer'] },
        ],
      },
      search: { $ref: '#SearchQuery' },
      page: { $ref: '#PageQuery' },
      limit: { $ref: '#LimitQuery' },
      status: {
        allOf: [{ $ref: '#StatusQuery' }, { enum: ['0', '1', '2'] }],
      },
    },
  },
  withdraw: {
    type: 'object',
    properties: {
      orderDirection: { $ref: '#OrderDirectionQuery' },
      orderBy: {
        allOf: [{ $ref: '#OrderByQuery' }, { enum: ['created_at', 'balance_request'] }],
      },
      search: { $ref: '#SearchQuery' },
      page: { $ref: '#PageQuery' },
      limit: { $ref: '#LimitQuery' },
      status: {
        allOf: [{ $ref: '#StatusQuery' }, { enum: ['0', '1', '2'] }],
      },
    },
  },
};

/**
 * The order of the keys is following the order of the POST / PATCH
 * routes in Postman
 */
export const requestBody = {
  topUp: {
    required: ['balance_request', 'balance_transfer', 'wallet_id'],
    type: 'object',
    properties: {
      wallet_id: { type: 'integer' },
      balance_request: { type: 'integer' },
      balance_transfer: { type: 'integer' },
    },
    additionalProperties: false,
  },
  withdraw: {
    required: ['balance_request', 'wallet_id'],
    type: 'object',
    properties: {
      wallet_id: { type: 'integer' },
      balance_request: { type: 'integer' },
    },
    additionalProperties: false,
  },
  topUpProof: {
    required: ['image'],
    type: 'object',
    properties: {
      image: { type: 'array', items: { $ref: '#MultiPartSchema' } },
    },
    additionalProperties: false,
  },
  updateTopUpStatus: {
    required: ['status'],
    type: 'object',
    properties: { status: { type: 'integer' } },
    additionalProperties: false,
  },
  updateWithdrawStatus: {
    required: ['status'],
    type: 'object',
    properties: { status: { type: 'integer' } },
    additionalProperties: false,
  },
};

export const responses = {
  wallets: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            $ref: '#GetUserWallet',
          },
        },
      },
    ],
  },
  topUpHistories: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#GetTopUp',
            },
          },
        },
      },
    ],
  },
  withdrawHistories: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              allOf: [
                {
                  $ref: '#GetWithdraw',
                },
                {
                  type: 'object',
                  properties: {
                    UserBank: {
                      type: 'object',
                      allOf: [
                        {
                          $ref: '#GetBankUser',
                        },
                        {
                          type: 'object',
                          properties: {
                            Bank: {
                              $ref: '#GetBank',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  topUpDetail: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              allOf: [
                {
                  $ref: '#GetTopUp',
                },
                {
                  type: 'object',
                  properties: {
                    Bank: {
                      type: 'object',
                      allOf: [
                        {
                          $ref: '#GetBank',
                        },
                        {
                          type: 'object',
                          properties: {
                            Utilities: {
                              type: 'array',
                              items: {
                                $ref: '#GetBankUtility',
                              },
                            },
                            Accounts: {
                              type: 'array',
                              items: {
                                $ref: '#GetBankUser',
                              },
                            },
                          },
                        },
                      ],
                    },
                    Media: {
                      $ref: '#GetMedia',
                    },
                    UserWallet: {
                      type: 'object',
                      properties: {
                        id_u_user: {
                          type: 'integer',
                        },
                        u_user: {
                          type: 'object',
                          properties: {
                            id_m_users: {
                              type: 'integer',
                            },
                            m_user: {
                              type: 'object',
                              properties: {
                                full_name: {
                                  type: 'string',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  withdrawDetail: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              allOf: [
                {
                  $ref: '#GetTopUp',
                },
                {
                  type: 'object',
                  properties: {
                    UserBank: {
                      type: 'object',
                      allOf: [
                        {
                          $ref: '#GetBankUser',
                        },
                        {
                          type: 'object',
                          properties: {
                            Bank: {
                              type: 'object',
                              allOf: [
                                {
                                  $ref: '#GetBank',
                                },
                                {
                                  type: 'object',
                                  properties: {
                                    Utilities: {
                                      type: 'array',
                                      items: {
                                        $ref: '#GetBankUtility',
                                      },
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  userTopUp: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#GetTopUp',
            },
          },
        },
      },
    ],
  },
  userWithdraw: {
    type: 'object',
    allOf: [
      {
        $ref: '#ApiResponse',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#GetWithdraw',
            },
          },
        },
      },
    ],
  },
};
