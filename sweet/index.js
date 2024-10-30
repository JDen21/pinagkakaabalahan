import Lexer from './Lexer.js';
import AST from './ast/AST.js';
import Interpreter from './interpreter.js';
import fs from 'fs';
import Global from './environment/Global.js';

const program = fs.readFileSync('./program.swt', { encoding: 'utf-8' })
const lexer = new Lexer(program);
lexer.prettyPrint();
// const ast = new AST(lexer.tokens);
// ast.prettyPrint();
// new Interpreter(ast.getTree(), Global); 
