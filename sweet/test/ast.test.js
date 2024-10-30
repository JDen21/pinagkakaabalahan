import assert from 'assert/strict';
import test from 'node:test';
import AST from '../ast/AST.js';
import astTestData from './ast.testData.js';

test('basic add operation', () => {
  const tokens = astTestData['basic add operation'].tokens;
  const expect = astTestData['basic add operation'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});

test('basic subtract operation', () => {
  const tokens = astTestData['basic subtract operation'].tokens;
  const expect = astTestData['basic subtract operation'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});

test('basic multiply operation', () => {
  const tokens = astTestData['basic multiply operation'].tokens;
  const expect = astTestData['basic multiply operation'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});

test('basic divide operation', () => {
  const tokens = astTestData['basic divide operation'].tokens;
  const expect = astTestData['basic divide operation'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});

test('parenthesis arithmetic', () => {
  // 1*(1+1)
  const tokens = astTestData['parenthesis arithmetic'].tokens;
  const expect = astTestData['parenthesis arithmetic'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});

test('parenthesis arithmetic 2', () => {
  // (1+1)*1
  const tokens = astTestData['parenthesis arithmetic 2'].tokens;
  const expect = astTestData['parenthesis arithmetic 2'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});

test('parenthesis within parenthesis', () => {
  // 1+(2*(5+1))
  const tokens = astTestData['parenthesis within parenthesis'].tokens;
  const expect = astTestData['parenthesis within parenthesis'].expect;
  const ast = new AST(tokens);
  const actual = ast.buildTestAST();
  assert.deepEqual(expect, actual);
});