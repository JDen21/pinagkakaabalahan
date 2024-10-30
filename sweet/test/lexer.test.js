import assert from 'assert/strict';
import test from 'node:test';
import Lexer from '../Lexer.js';
import lexerTestData from './lexer.testData.js';

test('simple add arithmetic', () => {
  const lexer = new Lexer('1 + 1');
  const expect = lexerTestData['simple add arithmetic'];
  assert.deepEqual(lexer.tokens, expect);
});

test('simple subtract arithmetic', () => {
  const lexer = new Lexer('1 - 1');
  const expect = lexerTestData['simple subtract arithmetic'];
  assert.deepEqual(lexer.tokens, expect);
});

test('simple multiply arithmetic', () => {
  const lexer = new Lexer('1 * 1');
  const expect = lexerTestData['simple multiply arithmetic'];
  assert.deepEqual(lexer.tokens, expect);
});

test('simple divide arithmetic', () => {
  const lexer = new Lexer('1 / 1');
  const expect = lexerTestData['simple divide arithmetic'];
  assert.deepEqual(lexer.tokens, expect);
});

test('unaligned operations', () => {
  const lexer = new Lexer(`1
    +1`);
  const expect = lexerTestData['unaligned operations'];
  assert.deepEqual(lexer.tokens, expect);
});

test('parenthesized arithmetic', () => {
  const lexer = new Lexer('1*(1+1)');
  const expect = lexerTestData['parenthesized arithmetic'];
  assert.deepEqual(lexer.tokens, expect);
});

test('parenthesized arithmetic 2', () => {
  const lexer = new Lexer('(1+1)*1');
  const expect = lexerTestData['parenthesized arithmetic 2'];
  assert.deepEqual(lexer.tokens, expect);
});

test('parenthesis within parenthesis', () => {
  const lexer = new Lexer('1+(2*(5+1))');
  const expect = lexerTestData['parenthesis within parenthesis'];
  assert.deepEqual(lexer.tokens, expect);
});

test('simple character', () => {
  const lexer = new Lexer('\'a\'');
  const expect = lexerTestData['simple character'];
  assert.deepEqual(lexer.tokens, expect);
});

test('special character', () => {
  // * in program file '\''
  let lexer = new Lexer("'\\''");
  
  let expect = lexerTestData['special character'][0];
  assert.deepEqual(lexer.tokens, expect);
  
  // * in program file '\\'
  lexer = new Lexer("'\\\\'");
  
  expect = lexerTestData['special character'][1];
  assert.deepEqual(lexer.tokens, expect);
});

test('simple string', () => {
  const lexer = new Lexer('"a simple string"');
  const expect = lexerTestData['simple string'];
  assert.deepEqual(lexer.tokens, expect);
});

test('string with special characters', () => {
  // * in program file "a table\'s foo\\bar"
  const message = "\"a table\\'s foo\\\\bar\"";
  const lexer = new Lexer(message);
  const expect = lexerTestData['string with special characters'];
  assert.deepEqual(lexer.tokens, expect);
});

test('test keyword', () => {
  const message = 'const';
  const lexer = new Lexer(message);
  const expect = lexerTestData['test keyword'];
  assert.deepEqual(lexer.tokens, expect);
});

test('test identifier', () => {
  let identifier = 'validIdentifier_1';
  let lexer = new Lexer(identifier);
  let expect = lexerTestData['test identifier'];
    assert.deepEqual(lexer.tokens, expect);
  identifier = '1invalidIdentifier';
  assert.throws(() => new Lexer(identifier));
});

test('test assignment', () => {
  const message = 'const a = "abc";';
  const lexer = new Lexer(message);
  const expect = lexerTestData['test assignment'];
  assert.deepEqual(lexer.tokens, expect);
});

test('end line', () => {
  const message = 'const value = "abc";'
  const lexer = new Lexer(message);
  const expect = lexerTestData['end line'];
  assert.deepEqual(lexer.tokens, expect);
});