const TOKEN_TYPES = Object.freeze({
  equality: 'equality', 
  inequality: 'inequality',
  preinequality: 'preinequality', // ! this is a filler token
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  multiply: 'multiply',
  divide: 'divide',
  add: 'add',
  subtract: 'subtract',
  accessor: 'accessor',
  assigment: 'assignment',
  leftParen: 'left parenthesis',
  rightParen: 'right parenthesis',
  number: 'number',
  string: 'string',
  character: 'character',
  identifier: 'identifier',


  separator: 'separator',
  backPointer: 'back pointer', // * ../
  prebackPointer: '..', // ! this is a filler token for now to have a state when going to backPointer state ..
  keywordConst: 'const',
  keywordIf: 'if',
  keywordElse: 'else',
  leftBracket: 'left bracket',
  rightBracket: 'right bracket',
  endLine: 'endLine',
  none: 'none'
})

export default TOKEN_TYPES;