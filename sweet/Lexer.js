import TOKEN_TYPES from "./tokenTypes.js";
import fs from 'fs';
export default class Lexer {
  tokens= [];
  #currChar = '';
  #tokenStart = 0;
  #tokenEnd = 0;
  #currCol = 0;
  #currLine = 1;
  #currTokenValue = '';
  #currTokenType = TOKEN_TYPES.none;

  constructor (program) {
    // * normalize program
    program = program.toString();
    program = [...program];
    let currIdx = 0;
    while (program.length) {
      this.#currChar = program.shift();

      switch (this.#currChar) {
        case ' ': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.keywordIf:
            case TOKEN_TYPES.keywordElse:
            case TOKEN_TYPES.identifier: {
              // * This will have a residue token of type currTokenType, which must be filtered later on when pushing next token.
              // * in this way next token will know the type of prev token instead of just defaulting to none type
              this.#pushToken(this.#currTokenType);
              break;
            }
            case TOKEN_TYPES.prebackPointer: 
            case TOKEN_TYPES.preinequality: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue) === false) {
                this.#eat();
              }
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue) === false) {
                this.#eat();
              }
              break;
            }
            default: break;
          }
          break;
        };
        case ';': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: {
              this.#eat(TOKEN_TYPES.endLine);
              break;
            }
            case TOKEN_TYPES.endLine: {
              this.#pushToken();
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              this.#pushToken(TOKEN_TYPES.endLine);
              break;
            }
            case TOKEN_TYPES.leftBracket: {
              const message = `Unclosed bracket. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst:  {
              const messsage = `Inoperable assignment. ${this.#currLine}:${this.#currCol}`;
              throw new Error(messsage);
            }
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const messsage = `Invalid if statement. ${this.#currLine}:${this.#currCol}`;
              throw new Error(messsage);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.backPointer:
            case TOKEN_TYPES.separator: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.endLine);
              break;
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.endLine);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.endLine);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.rightParen: {
              this.#pushToken(TOKEN_TYPES.endLine);
              break;
            }
            case TOKEN_TYPES.leftParen: {
              const message = `Unclosed parenthesis found. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.assigment: {
              const message = `Cannot assign ; as a value. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.accessor: {
              const message = `Cannot access ; as a property. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.subtract:
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.divide:
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: 
            case TOKEN_TYPES.equality: {
              const message = `Invalid right operand ;. ${this.#currLine}: ${this.#currCol}`;
              throw new Error(message);
            }
          }
          break;
        }
        case '\n': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.endLine: {
              this.#eat();
              break;
            }
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Invalid line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.none);
              break;
            }
            case TOKEN_TYPES.prebackPointer: 
            case TOKEN_TYPES.preinequality: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue) === false) {
                const message = `Cannot go to new line when inside a character literal.`;
                throw new Error(message);
              }
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue) === false) {
                const message = `Cannot go to new line when inside a string literal.`;
                throw new Error(message);
              }
              break;
            }
          }
          this.#currLine = this.#currLine + 1;
          this.#currCol = 0;
          break;
        }
        case '\\': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            default: {
              this.#eat();
              const message = `Invalid token ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
          }
          break;
        }
        case '_': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: {
              this.#eat(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.leftBracket: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst:  {
              this.#eat(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.keywordIf: {
              this.#eat(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.keywordElse:
            case TOKEN_TYPES.prebackPointer: 
            case TOKEN_TYPES.preinequality: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.backPointer: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.separator: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.identifier: {
              if (this.#currTokenValue.endsWith(' ')) {
                const message = `Invalid identifier after identifier ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.character:
            case TOKEN_TYPES.string: {
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.rightParen: {
              const message = `Invalid identifier after token ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}.`;
              throw new Error(message);
            }
            case TOKEN_TYPES.assigment: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.leftParen: 
            case TOKEN_TYPES.accessor:
            case TOKEN_TYPES.subtract:
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.multiply:
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.inequality: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.lte: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
          }
          break;
        }
        case '\'': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: {
              this.#eat(TOKEN_TYPES.character);
              break;
            }
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.leftBracket: {
              this.#pushToken(TOKEN_TYPES.character);
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.backPointer: 
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.identifier: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Invalid character after ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordIf: {
              this.#pushToken(TOKEN_TYPES.character);
              break;
            }
            case TOKEN_TYPES.separator: {
              this.#pushToken(TOKEN_TYPES.character);
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a' 'a'
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Unexpected character. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              // * avoid validating when its a start of special char
              if (this.#currTokenValue.endsWith('\\')) {
                this.#eat();
                break;
              }
              this.#eat();
              // * terminating char check
              if (this.#isValidCharacter(this.#currTokenValue) === false) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              break;
            }
            case TOKEN_TYPES.string: {
              // * a character beside a recently finished string
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Unexpected string. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              // * validate string after its finished
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.rightParen: 
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token after ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message)
            } 
            case TOKEN_TYPES.leftParen:
            case TOKEN_TYPES.assigment:
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.divide:
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.inequality: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.lte: {
              // * handle the operation errors in ast or backend instead.
              this.#pushToken(TOKEN_TYPES.character);
              break;
            }
          }
          break;
        }
        case '\"': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: {
              this.#eat(TOKEN_TYPES.string);
              break;
            }
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.leftBracket: {
              this.#pushToken(TOKEN_TYPES.string);
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer:
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.identifier: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Invalid string after ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordIf:
            case TOKEN_TYPES.separator: {
              this.#pushToken(TOKEN_TYPES.string);
              break;
            }
            case TOKEN_TYPES.character: {
              // * a string beside a recently finished character
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Unexpected character. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              // * character is unfinished so treat it as normal char and let next iter validate.
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // * string beside a recently finished string
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Unexpected string. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              // * terminating string check
              if (this.#isValidString(this.#currTokenValue) === false) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              break;
            }
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token after ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.leftParen: {
              this.#pushToken(TOKEN_TYPES.string);
              break;
            }
            case TOKEN_TYPES.rightParen: {
              const message = `Invalid token after ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.assigment: {
              this.#pushToken(TOKEN_TYPES.string);
              break;
            }
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.divide:
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.inequality: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.lte: {
              // * handle the operation errors in ast or backend instead.
              this.#pushToken(TOKEN_TYPES.string);
              break;
            }
          }
           break;
        }
        case '{': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine:
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.assigment: 
            case TOKEN_TYPES.leftParen: // * possibly a function argument
            case TOKEN_TYPES.rightParen:
            case TOKEN_TYPES.number:
            case TOKEN_TYPES.string:
            case TOKEN_TYPES.character:
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.leftBracket);
              break;
            }
            default: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
          }
          break;
        }
        case '}': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.leftBracket: // * empty group
            case TOKEN_TYPES.rightBracket:{
              this.#pushToken(TOKEN_TYPES.rightBracket);
              break;
            }
            default: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
          }
          break;
        }
        case '(': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none:
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.identifier: 
            case TOKEN_TYPES.separator: 
            case TOKEN_TYPES.leftBracket: { // * separator allowed since arguments can be captured expressions
              this.#pushToken(TOKEN_TYPES.leftParen);
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Invalid parenthesis after ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordIf: {
              this.#pushToken(TOKEN_TYPES.leftParen);
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a'( 
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Unexpected token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // "abc"( 
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Unexpected token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.accessor: {
              throw new Error(`${this.#currTokenValue} is not a function.`);
            }
            case TOKEN_TYPES.rightParen: {
              throw new Error(`Invalid token '(' position ${this.#currLine}:${this.#currCol}`)
            }
            case TOKEN_TYPES.leftParen: {
              this.#pushToken();
              break;
            }
            case TOKEN_TYPES.assigment: {
              this.#pushToken(TOKEN_TYPES.leftParen);
              break;
            }
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: {
              this.#pushToken(TOKEN_TYPES.leftParen);
              break;
            }
          }
          break;
        }
        case ')': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.separator: {
              const message = `Invalid token position ')' ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.leftBracket: {
              const message = `Missing left parenthesis. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Unexpected keyword ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.rightParen);
              break;
            }
            case TOKEN_TYPES.character:{
              if (this.#isValidCharacter(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.rightParen);
                break;
              }
              this.#eat();
              break
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.rightParen);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.leftParen: 
            case TOKEN_TYPES.number: {
              this.#pushToken(TOKEN_TYPES.rightParen);
              break; 
            }
            case TOKEN_TYPES.rightParen: {
              this.#pushToken();
              break;
            }
            case TOKEN_TYPES.assigment: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token after an accesssor. ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.subtract:
            case TOKEN_TYPES.multiply:
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality:
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: {
              throw new Error(`Invalid operand ')' ${this.#currLine}:${this.#currCol}`);
            }
          }
          break;
        }
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.leftBracket: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst: {
              // * const1
              if (this.#currTokenValue !== ' ') {
                this.#eat(TOKEN_TYPES.identifier);
                break;
              }
              // * const 1
              const message = `Invalid identifier. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            } 
            case TOKEN_TYPES.keywordIf: {
              // * if1
              if (this.#currTokenValue !== ' ') {
                this.#eat(TOKEN_TYPES.identifier);
                break;
              }
              this.#eat(TOKEN_TYPES.number);
              break;
            }
             
            case TOKEN_TYPES.keywordElse: {
              if (this.#currTokenValue !== ' ') {
                this.#eat(TOKEN_TYPES.identifier);
                break;
              }
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.separator: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.identifier: {
              this.#eat();
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a'7
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Unexpected number. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // "abc"7
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Unexpected number. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number:{
              this.#eat(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.rightParen: {
              const message = `Missing operator for '${this.#currTokenValue}' ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.leftParen: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.assigment: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.accessor: {
              const message = `${this.#currChar} is not a valid identifier start. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            // * binary operators
            case TOKEN_TYPES.subtract:
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
          }
          break;
        }
        case '!': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.prebackPointer: 
            case TOKEN_TYPES.backPointer: 
            case TOKEN_TYPES.separator: 
            case TOKEN_TYPES.leftParen: 
            case TOKEN_TYPES.assigment: 
            case TOKEN_TYPES.accessor: 
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.lte:
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.inequality: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Invalid identifier. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: 
            case TOKEN_TYPES.character: 
            case TOKEN_TYPES.string: 
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.rightParen: {
              this.#pushToken(TOKEN_TYPES.preinequality);
              break;
            }
          }
          break;
        }
        case '=': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine:
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.separator:
            case TOKEN_TYPES.keywordElse: 
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.backPointer: 
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message = `Invalid assignment. ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            // * ternary
            case TOKEN_TYPES.keywordIf: {
              this.#pushToken(TOKEN_TYPES.keywordIf);
              break;
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.assigment);
              break;
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.assigment);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: { 
              if (this.#isValidString(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.assigment);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: {
              this.#pushToken(TOKEN_TYPES.assigment);
              break;
            }
            case TOKEN_TYPES.rightParen: 
            case TOKEN_TYPES.leftParen: {
              const message = `Invalid identifier. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.assigment: {
              this.#eat(TOKEN_TYPES.equality);
              break;
            }
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.subtract:
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.divide:
            case TOKEN_TYPES.multiply: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.lt: {
              this.#eat(TOKEN_TYPES.lte);
              break;
            }
            case TOKEN_TYPES.gt: {
              this.#eat(TOKEN_TYPES.gte);
              break;
            }
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte:
            case TOKEN_TYPES.gte:
            case TOKEN_TYPES.inequality: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.preinequality: {
              this.#eat(TOKEN_TYPES.inequality);
              break;
            }
          }
          break;
        }
        case '>': 
        case '<': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: {
              const message  = `Requires left hand operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst: 
            case TOKEN_TYPES.keywordIf:
            case TOKEN_TYPES.keywordElse:
            case TOKEN_TYPES.backPointer: 
            case TOKEN_TYPES.separator: 
            case TOKEN_TYPES.leftParen: 
            case TOKEN_TYPES.assigment: 
            case TOKEN_TYPES.accessor: 
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.add: 
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message = `Invalid left hand operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer: 
            case TOKEN_TYPES.preinequality: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue)) {
                if (this.#currChar === '<') {
                  this.#pushToken(TOKEN_TYPES.lt);
                }
                if (this.#currChar === '>') {
                  this.#pushToken(TOKEN_TYPES.gt);
                }
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue)) {
                if (this.#currChar === '<') {
                  this.#pushToken(TOKEN_TYPES.lt);
                }
                if (this.#currChar === '>') {
                  this.#pushToken(TOKEN_TYPES.gt);
                }
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.identifier: 
            case TOKEN_TYPES.number: 
            case TOKEN_TYPES.rightParen: {
              if (this.#currChar === '<') {
                this.#pushToken(TOKEN_TYPES.lt);
              }
              if (this.#currChar === '>') {
                this.#pushToken(TOKEN_TYPES.gt);
              }
              break;
            }
          }
          break;
        }
        case '+': {
          switch (this.#currTokenType) {
            case  TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              throw new Error('No left hand operand found.');
            }
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Cannot use keyword as an operand. ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.separator: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.add);
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a'+
              if (this.#isValidCharacter(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.add);
              } else {
                this.#eat();
              }
              break;
            } 
            case TOKEN_TYPES.string: {
              // "abc"+
              if (this.#isValidString(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.add);
              } else {
                this.#eat();
              }
              break;
            }
            case TOKEN_TYPES.number:
            case TOKEN_TYPES.rightParen:  {
              this.#pushToken(TOKEN_TYPES.add);
              break;
            }
            case TOKEN_TYPES.leftParen: {
              throw new Error(`Invalid operand '(' for arithmetic operator operator ${this.#currLine}:${this.#currCol}`);
            }
            case TOKEN_TYPES.assigment: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: {
              throw new Error(`Cannot add '+' operator after another operator ${this.#currTokenValue}`);
            }
          }
          break;
        }
        case '-': {
          switch (this.#currTokenType) {
            case  TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.separator: {
              // * possible negative number
              this.#eat(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message  = `Invalid left hand operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Cannot use keyword as an operand. ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.subtract);
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a' - 
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // "abc" -
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number:
            case TOKEN_TYPES.rightParen:  {
              this.#pushToken(TOKEN_TYPES.subtract);
              break;
            }
            case TOKEN_TYPES.leftParen: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.assigment: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.subtract: 
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality:{
              this.#pushToken(TOKEN_TYPES.number);
            }
          }
          break;
        }
        case '*': {
          switch (this.#currTokenType) {
            case  TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: {
              throw new Error('No left hand operand found.');
            }
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message  = `Invalid left hand operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Cannot use keyword as an operand. ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality: 
            case TOKEN_TYPES.backPointer:
            case TOKEN_TYPES.separator: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.multiply);
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a' *
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // "abc" *
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number:
            case TOKEN_TYPES.rightParen:  {
              this.#pushToken(TOKEN_TYPES.multiply);
              break;
            }
            case TOKEN_TYPES.leftParen: {
              throw new Error(`Invalid operand '(' for arithmetic operator ${this.#currLine}:${this.#currCol}`);
            }
            case TOKEN_TYPES.assigment: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.subtract:  
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality:{
              throw new Error(`Cannot add '*' operator after another operator ${this.#currTokenValue}`);
            }
          }
          break;
        }
        case '/': {
          switch (this.#currTokenType) {
            case  TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: {
              const message = `No left hand operand found. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message  = `Invalid left hand operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Cannot use keyword as an operand. ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            case TOKEN_TYPES.prebackPointer: {
              this.#eat(TOKEN_TYPES.backPointer);
              break;
            }
            case TOKEN_TYPES.backPointer: 
            case TOKEN_TYPES.preinequality: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.separator: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.divide);
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a' /
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // "abc" /
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number:
            case TOKEN_TYPES.rightParen:  {
              this.#pushToken(TOKEN_TYPES.divide);
              break;
            }
            case TOKEN_TYPES.leftParen: {
              throw new Error(`Invalid operand '(' for arithmetic operator operator ${this.#currLine}:${this.#currCol}`);
            }
            case TOKEN_TYPES.assigment: {
              const message = `Invalid operand. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.accessor: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.subtract:  
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality:{
              throw new Error(`Cannot add '/' operator after another operator ${this.#currTokenValue}`);
            }
          }
          break;
        }
        case '.': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.separator: {
              this.#eat(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.leftBracket: 
            case TOKEN_TYPES.rightBracket: {
              const message  = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst:
            case TOKEN_TYPES.keywordIf: 
            case TOKEN_TYPES.keywordElse: {
              const message = `Keyword ${this.#currTokenType} has no member accessible. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            } 
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality:  {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.backPointer: {
              this.#pushToken(TOKEN_TYPES.accessor);
              break;
            }
            case TOKEN_TYPES.identifier: {
              this.#pushToken(TOKEN_TYPES.accessor);
              break;
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.accessor);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenType)) {
                this.#pushToken(TOKEN_TYPES.accessor);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: {
              if (this.#currTokenValue === '.') {
                this.#eat(TOKEN_TYPES.prebackPointer);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.rightParen: {
              this.#pushToken(TOKEN_TYPES.accessor);
              break;
            }
            case TOKEN_TYPES.leftParen: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.assigment: {
              this.#pushToken(TOKEN_TYPES.number);
              break;
            }
            case TOKEN_TYPES.accessor: {
              this.#eat(TOKEN_TYPES.prebackPointer);
              break;
            }
            case TOKEN_TYPES.subtract:
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.divide:
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality:{
              const message = `Invalid accessor after operator. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
          }
          break;
        }
        case ',': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.identifier:
              case TOKEN_TYPES.number: {
              this.#pushToken(TOKEN_TYPES.separator);
              break;
            }
            case TOKEN_TYPES.leftBracket: {
              const message  = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.rightBracket: {
              this.#pushToken(TOKEN_TYPES.separator);
              break;
            }
            case TOKEN_TYPES.character: {
              if (this.#isValidCharacter(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.separator);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              if (this.#isValidString(this.#currTokenValue)) {
                this.#pushToken(TOKEN_TYPES.separator);
                break;
              }
              this.#eat();
              break;
            }
            default: {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
          }
          break;
        }
        case 'a':
        case 'A':
        case 'b':
        case 'B':
        case 'c':
        case 'C':
        case 'd':
        case 'D':
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'G':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'j':
        case 'J':
        case 'k':
        case 'K':
        case 'l':
        case 'L':
        case 'm':
        case 'M':
        case 'n':
        case 'N':
        case 'o':
        case 'O':
        case 'p':
        case 'P':
        case 'q':
        case 'Q':
        case 'r':
        case 'R':
        case 's':
        case 'S':
        case 't':
        case 'T':
        case 'u':
        case 'U':
        case 'v':
        case 'V':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
        case 'y':
        case 'Y':
        case 'z':
        case 'Z': {
          switch (this.#currTokenType) {
            case TOKEN_TYPES.none: 
            case TOKEN_TYPES.endLine: 
            case TOKEN_TYPES.separator: 
            case TOKEN_TYPES.leftBracket: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.rightBracket: {
              const message = `Missing end line. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.keywordConst: {
              // * consta or (space)a
              this.#eat(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.keywordIf: {
              // * ifa or (space)a
              this.#eat(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.keywordElse: {
              this.#eat(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.prebackPointer:
            case TOKEN_TYPES.preinequality:  {
              const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.backPointer: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.identifier: {
              if (this.#currTokenValue.endsWith(' ')) {
                const message = `Invalid identifier after identifier ${this.#currTokenValue}. ${this.#currLine}:${this.#currCol}`
                throw new Error(message);
              }
              const nextVal = this.#currTokenValue + this.#currChar;
              if (nextVal === TOKEN_TYPES.keywordConst) {
                this.#eat(TOKEN_TYPES.keywordConst);
                break;
              } 
              if (nextVal === TOKEN_TYPES.keywordIf) {
                this.#eat(TOKEN_TYPES.keywordIf);
                break;
              }
              if (nextVal === TOKEN_TYPES.keywordElse) {
                this.#eat(TOKEN_TYPES.keywordElse);
                break;
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.character: {
              // 'a' a
              if (this.#isValidCharacter(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.string: {
              // "abc" a
              if (this.#isValidString(this.#currTokenValue)) {
                const message = `Invalid token. ${this.#currLine}:${this.#currCol}`;
                throw new Error(message);
              }
              this.#eat();
              break;
            }
            case TOKEN_TYPES.number: {
              const message = `throwing for now, maybe vars later. ${this.#currTokenType}`;
              throw new Error(message);
            }
            case TOKEN_TYPES.rightParen: {
              const message = `Invalid operator ${this.#currLine}:${this.#currCol}`
              throw new Error(message);
            }
            case TOKEN_TYPES.leftParen: {
              // * functionName(identifier)
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.assigment: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.accessor: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
            case TOKEN_TYPES.add:
            case TOKEN_TYPES.subtract:  
            case TOKEN_TYPES.multiply: 
            case TOKEN_TYPES.divide: 
            case TOKEN_TYPES.equality: 
            case TOKEN_TYPES.lte: 
            case TOKEN_TYPES.lt: 
            case TOKEN_TYPES.gte: 
            case TOKEN_TYPES.gt: 
            case TOKEN_TYPES.inequality: {
              this.#pushToken(TOKEN_TYPES.identifier);
              break;
            }
          }
          break;
        }
      }
      currIdx = currIdx + 1;
      this.#currCol = this.#currCol + 1;
    }
    this.#pushToken();
  }

  #eat (newTokenType, reset) {
    if (newTokenType) {
      this.#currTokenType = newTokenType;
    }
    if (reset) {
      this.#currTokenValue = this.#currChar;
    } else {
      this.#currTokenValue = this.#currTokenValue.concat(this.#currChar);
    }
    this.#tokenEnd = this.#currCol;
  }

  #pushToken (newTokenType) {
    if (this.#currTokenType !== TOKEN_TYPES.none) {
      // * remove residuals.
      this.#currTokenValue = this.#currTokenValue.trim();
      
      if (this.#currTokenValue.length) {
        this.tokens.push({ tokenType: this.#currTokenType, value: this.#currTokenValue, line: this.#currLine, start: this.#tokenStart, end: this.#tokenEnd });
      }
    }

    this.#eat(newTokenType, true);
    this.#tokenStart = this.#currCol;
  }

  #isValidCharacter (character) {
    // * it has to be at least an empty character
    if (character.length < 2) {
      return false;
    }
    if (!character.endsWith('\'')) {
      return false;
    }
    if (!character.startsWith('\'')) {
      return false;
    }
    // * remove quotes
    const charValue = character.slice(0, character.length - 1).replace('\'', '');

    // * this is a non terminating, probably an unfinished special character
    if (charValue === '\\') {
      return false;  
    }

    if (this.#isSpecialCharacter(charValue)) {
      return true;
    }
    // * can be empty character or any non special character
    if (charValue.length <= 1) {
      return true;
    }
    return false;
  }

  #isValidString (string) {
    // * it has to be at least an empty string
    if (string.length < 2) {
      return false;
    }
    if (string.endsWith('\"') === false) {
      return false;
    }
    if (string.startsWith('\"') === false) {
      return false;
    }
    // * remove double quotes
    const stringValue = string.slice(0, string.length - 1).replace('\"', '');
    for (let i = 0; i < stringValue.length; i++) {
      const currChar = stringValue[i];
      if (currChar !== '\\') {
        // * ' or " with no backslash
        if (this.#isBackslashCharacter(currChar)) {
          return false;
        }
        continue;
      }
      // * this is single backslash ending
      if (i === stringValue.length - 1) {
        return false;
      }
      const nextChar = stringValue[i + 1];
      // * check if proper special character 
      if (this.#isSpecialCharacter(currChar + nextChar) === false) {
        return false;
      }
      // * skip nextChar
      i = i + 1
    }

    return true;
  }

  #isBackslashCharacter (character) {
    switch (character) {
      case '\\':
      case '\'':
      case '\"': {
        return true
      }
      default: return false;
    }
  }

  #isSpecialCharacter (character) {
    switch (character) {
      case '\\\\':    // * \\
      case '\\\'':   // * \'
      case '\\\"':  // * \"
      case '\\t':  // * \t
      case '\\n': // * \n
      {
        return true;
      }
      default: return false;
    }
  }
  prettyPrint() {
    fs.writeFile('./print/lexer.txt', JSON.stringify(this.tokens, null, '\t'), () => {});
  }
}

