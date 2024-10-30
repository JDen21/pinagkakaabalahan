const lexerTestData = {
  'simple add arithmetic': [
    {
      end: 0,
      line: 1,
      start: 0,
      tokenType: 'number',
      value: '1'
    },
    {
      end: 2,
      line: 1,
      start: 2,
      tokenType: 'add',
      value: '+'
    },
    {
      end: 4,
      line: 1,
      start: 4,
      tokenType: 'number',
      value: '1'
    }
  ],
  'simple subtract arithmetic': [
    {
      end: 0,
      line: 1,
      start: 0,
      tokenType: 'number',
      value: '1'
    },
    {
      end: 2,
      line: 1,
      start: 2,
      tokenType: 'subtract',
      value: '-'
    },
    {
      end: 4,
      line: 1,
      start: 4,
      tokenType: 'number',
      value: '1'
    }
  ],
  'simple multiply arithmetic': [
    {
      end: 0,
      line: 1,
      start: 0,
      tokenType: 'number',
      value: '1'
    },
    {
      end: 2,
      line: 1,
      start: 2,
      tokenType: 'multiply',
      value: '*'
    },
    {
      end: 4,
      line: 1,
      start: 4,
      tokenType: 'number',
      value: '1'
    }
  ],
  'simple divide arithmetic': [
    {
      end: 0,
      line: 1,
      start: 0,
      tokenType: 'number',
      value: '1'
    },
    {
      end: 2,
      line: 1,
      start: 2,
      tokenType: 'divide',
      value: '/'
    },
    {
      end: 4,
      line: 1,
      start: 4,
      tokenType: 'number',
      value: '1'
    }
  ],
  'unaligned operations': [
    {
      "tokenType": "number",
      "value": "1",
      "line": 2,
      "start": 0,
      "end": 0
    },
    {
      "tokenType": "add",
      "value": "+",
      "line": 2,
      "start": 5,
      "end": 5
    },
    {
      "tokenType": "number",
      "value": "1",
      "line": 2,
      "start": 6,
      "end": 6
    }
  ],
  'parenthesized arithmetic': [
    {
      tokenType: 'number',
      value: '1',
      line: 1,
      start: 0,
      end: 0
    },
    {
      tokenType: 'multiply',
      value: '*',
      line: 1,
      start: 1,
      end: 1
      
    },
    {
      tokenType: 'left parenthesis',
      value: '(',
      line: 1,
      start: 2,
      end: 2
    },
    {
      tokenType: 'number',
      value: '1',
      line: 1,
      start: 3,
      end: 3
    },
    {
      tokenType: 'add',
      value: '+',
      line: 1,
      start: 4,
      end: 4
    },
    {
      tokenType: 'number',
      value: '1',
      line: 1,
      start: 5,
      end: 5
    },
    {
      tokenType: 'right parenthesis',
      value: ')',
      line: 1,
      start: 6,
      end: 6
    }
  ],
  'parenthesized arithmetic 2': [
    {
      tokenType: 'left parenthesis',
      value: '(',
      line: 1,
      start: 0,
      end: 0
    },
    {
      tokenType: 'number',
      value: '1',
      line: 1,
      start: 1,
      end: 1
    },
    {
      tokenType: 'add',
      value: '+',
      line: 1,
      start: 2,
      end: 2
    },
    {
      tokenType: 'number',
      value: '1',
      line: 1,
      start: 3,
      end: 3
    },
    {
      tokenType: 'right parenthesis',
      value: ')',
      line: 1,
      start: 4,
      end: 4
    },
    {
      tokenType: 'multiply',
      value: '*',
      line: 1,
      start: 5,
      end: 5
    },
    {
      tokenType: 'number',
      value: '1',
      line: 1,
      start: 6,
      end: 6
    }
  ],
  'parenthesis within parenthesis': [
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
    }
  ],
  'simple character': [
    {
      tokenType: 'character',
      value: '\'a\'',
      line: 1,
      start: 0,
      end: 2
    }
  ],
  'special character': {
    '0': [
      {
        tokenType: 'character',
        value: "'\\''",
        line: 1,
        start: 0,
        end: 3
      }
    ],
    '1': [
      {
        tokenType: 'character',
        value: "'\\\\'",
        line: 1,
        start: 0,
        end: 3
      }
    ]
  },
  'simple string': [
    {
      tokenType: "string",
      value: "\"a simple string\"",
      line: 1,
      start: 0,
      end: 16
    }
  ],
  'string with special characters': [
    {
      "tokenType": "string",
      "value": "\"a table\\'s foo\\\\bar\"",
      "line": 1,
      "start": 0,
      "end": 20
    }
  ],
  'test keyword': [
    {
      tokenType: 'const',
      value: 'const',
      line: 1,
      start: 0,
      end: 4
    }],
    'test identifier': [
      {
        tokenType: 'identifier',
        value: 'validIdentifier_1',
        line: 1,
        start: 0,
        end: 'validIdentifier_1'.length - 1
      }],
    'test assignment': [
      {
        "tokenType": "const",
        "value": "const",
        "line": 1,
        "start": 0,
        "end": 4
      },
      {
        "tokenType": "identifier",
        "value": "a",
        "line": 1,
        "start": 5,
        "end": 6
      },
      {
        "tokenType": "assignment",
        "value": "=",
        "line": 1,
        "start": 8,
        "end": 8
      },
      {
        "tokenType": "string",
        "value": "\"abc\"",
        "line": 1,
        "start": 10,
        "end": 14
      },
      {
        "tokenType": "endLine",
        "value": ";",
        "line": 1,
        "start": 15,
        "end": 15
      }
    ],
  'end line': [
    {
      "tokenType": "const",
      "value": "const",
      "line": 1,
      "start": 0,
      "end": 4
    },
    {
      "tokenType": "identifier",
      "value": "value",
      "line": 1,
      "start": 5,
      "end": 10
    },
    {
      "tokenType": "assignment",
      "value": "=",
      "line": 1,
      "start": 12,
      "end": 12
    },
    {
      "tokenType": "string",
      "value": "\"abc\"",
      "line": 1,
      "start": 14,
      "end": 18
    },
    {
      "tokenType": "endLine",
      "value": ";",
      "line": 1,
      "start": 19,
      "end": 19
    }
  ]
};

export default lexerTestData;