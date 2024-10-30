const astTestData = {
  'basic add operation': {
    tokens: [
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "add",
        "value": "+",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 3,
        "end": 3
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 0,
            "end": 0
          },
          "operator": {
            "tokenType": "add",
            "value": "+",
            "line": 1,
            "start": 1,
            "end": 1
          },
          "rOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 2,
            "end": 2
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  },
  'basic subtract operation': {
    tokens: [
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "subtract",
        "value": "-",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 3,
        "end": 3
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 0,
            "end": 0
          },
          "operator": {
            "tokenType": "subtract",
            "value": "-",
            "line": 1,
            "start": 1,
            "end": 1
          },
          "rOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 2,
            "end": 2
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  },
  'basic multiply operation': {
    tokens: [
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "multiply",
        "value": "*",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 3,
        "end": 3
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 0,
            "end": 0
          },
          "operator": {
            "tokenType": "multiply",
            "value": "*",
            "line": 1,
            "start": 1,
            "end": 1
          },
          "rOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 2,
            "end": 2
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  },
  'basic divide operation': {
    tokens: [
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "divide",
        "value": "/",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 3,
        "end": 3
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 0,
            "end": 0
          },
          "operator": {
            "tokenType": "divide",
            "value": "/",
            "line": 1,
            "start": 1,
            "end": 1
          },
          "rOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 2,
            "end": 2
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  },
  'parenthesis arithmetic': {
    tokens: [
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "multiply",
        "value": "*",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "left parenthesis",
        "value": "(",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 3,
        "end": 3
      },
      {
        "tokenType": "add",
        "value": "+",
        "line": 1,
        "start": 4,
        "end": 4
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 5,
        "end": 5
      },
      {
        "tokenType": "right parenthesis",
        "value": ")",
        "line": 1,
        "start": 6,
        "end": 6
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 7,
        "end": 7
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 0,
            "end": 0
          },
          "operator": {
            "tokenType": "multiply",
            "value": "*",
            "line": 1,
            "start": 1,
            "end": 1
          },
          "rOperand": {
            "lOperand": {
              "tokenType": "number",
              "value": "1",
              "line": 1,
              "start": 3,
              "end": 3
            },
            "operator": {
              "tokenType": "add",
              "value": "+",
              "line": 1,
              "start": 4,
              "end": 4
            },
            "rOperand": {
              "tokenType": "number",
              "value": "1",
              "line": 1,
              "start": 5,
              "end": 5
            }
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  },
  'parenthesis arithmetic 2': {
    tokens: [
      {
        "tokenType": "left parenthesis",
        "value": "(",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "add",
        "value": "+",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 3,
        "end": 3
      },
      {
        "tokenType": "right parenthesis",
        "value": ")",
        "line": 1,
        "start": 4,
        "end": 4
      },
      {
        "tokenType": "multiply",
        "value": "*",
        "line": 1,
        "start": 5,
        "end": 5
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 6,
        "end": 6
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 7,
        "end": 7
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "lOperand": {
              "tokenType": "number",
              "value": "1",
              "line": 1,
              "start": 1,
              "end": 1
            },
            "operator": {
              "tokenType": "add",
              "value": "+",
              "line": 1,
              "start": 2,
              "end": 2
            },
            "rOperand": {
              "tokenType": "number",
              "value": "1",
              "line": 1,
              "start": 3,
              "end": 3
            }
          },
          "operator": {
            "tokenType": "multiply",
            "value": "*",
            "line": 1,
            "start": 5,
            "end": 5
          },
          "rOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 6,
            "end": 6
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  },
  'parenthesis within parenthesis': {
    tokens: [
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 0,
        "end": 0
      },
      {
        "tokenType": "add",
        "value": "+",
        "line": 1,
        "start": 1,
        "end": 1
      },
      {
        "tokenType": "left parenthesis",
        "value": "(",
        "line": 1,
        "start": 2,
        "end": 2
      },
      {
        "tokenType": "number",
        "value": "2",
        "line": 1,
        "start": 3,
        "end": 3
      },
      {
        "tokenType": "multiply",
        "value": "*",
        "line": 1,
        "start": 4,
        "end": 4
      },
      {
        "tokenType": "left parenthesis",
        "value": "(",
        "line": 1,
        "start": 5,
        "end": 5
      },
      {
        "tokenType": "number",
        "value": "5",
        "line": 1,
        "start": 6,
        "end": 6
      },
      {
        "tokenType": "add",
        "value": "+",
        "line": 1,
        "start": 7,
        "end": 7
      },
      {
        "tokenType": "number",
        "value": "1",
        "line": 1,
        "start": 8,
        "end": 8
      },
      {
        "tokenType": "right parenthesis",
        "value": ")",
        "line": 1,
        "start": 9,
        "end": 9
      },
      {
        "tokenType": "right parenthesis",
        "value": ")",
        "line": 1,
        "start": 10,
        "end": 10
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 11,
        "end": 11
      }
    ],
    expect: {
      "callStack": [
        {
          "lOperand": {
            "tokenType": "number",
            "value": "1",
            "line": 1,
            "start": 0,
            "end": 0
          },
          "operator": {
            "tokenType": "add",
            "value": "+",
            "line": 1,
            "start": 1,
            "end": 1
          },
          "rOperand": {
            "lOperand": {
              "tokenType": "number",
              "value": "2",
              "line": 1,
              "start": 3,
              "end": 3
            },
            "operator": {
              "tokenType": "multiply",
              "value": "*",
              "line": 1,
              "start": 4,
              "end": 4
            },
            "rOperand": {
              "lOperand": {
                "tokenType": "number",
                "value": "5",
                "line": 1,
                "start": 6,
                "end": 6
              },
              "operator": {
                "tokenType": "add",
                "value": "+",
                "line": 1,
                "start": 7,
                "end": 7
              },
              "rOperand": {
                "tokenType": "number",
                "value": "1",
                "line": 1,
                "start": 8,
                "end": 8
              }
            }
          }
        },
        {
          "tokenType": "null",
          "value": "null"
        }
      ]
    }
  }
};

export default astTestData;
