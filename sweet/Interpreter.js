import { NodeAssignment, NodeBackPointer, NodeBinaryArithmetic, NodeDeclaration, NodeFunctionCall, NodePropertyAccess } from "./ast/nodes.js";
import Environment from "./environment/Environment.js";
import TOKEN_TYPES from "./tokenTypes.js";

const valueFormat = {
  modifiable: true,
  currValue: 'null',
  type: 'null'
};
export default class Interpreter {
  #environment;

  // TODO function call implement
  constructor (ast, enviroment) {
    this.#environment = enviroment;
    for (const command of ast.callStack) {
      this.#interpretDeclaration(command);
    }
    // this.#environment.view();
  }

  #interpretDeclaration (node, env) {
    const currEnv = env ?? this.#environment;
    if ((node instanceof NodeDeclaration) === false) {
      return this.#interpretAssignment(node, currEnv);
    }
    const newValue = { ...valueFormat };
    let key = '';
    const identfierToken = node.statement.identifiers;

    if (node.keyword.tokenType === TOKEN_TYPES.keywordConst) {
      newValue.modifiable = false;
    }

    if (identfierToken.tokenType === TOKEN_TYPES.identifier) {
      key = identfierToken.value;
    }
    if (Boolean(key) === false) {
      throw new Error(`Missing identifier on initialization.`)
    }
   currEnv.initialize(key, newValue);
   return this.#interpretAssignment(node.statement, currEnv);
  }

  #interpretAssignment (node, env) {
    const currEnv = env ?? this.#environment;
    if ((node instanceof NodeAssignment) === false) {
      return this.#interpretExpression(node, currEnv);
    }
    // ! for now key to value is only 1 to 1
    const key = node.identifiers.value;
    const value = this.#interpretExpression(node.expression, currEnv);
    currEnv.setData(key, value);
  }

  #interpretExpression (node, env) {
    const currEnv = env ?? this.#environment;
    return this.#interpretBinaryArithmetic(node, currEnv);
  }

  #interpretBinaryArithmetic (node, env) {
    const currEnv = env ?? this.#environment;
    const tokenType = node?.operator?.tokenType;
    if ((node instanceof NodeBinaryArithmetic) === false) {
      return this.#interpretPropertyAccess(node, currEnv)
    }

    switch (tokenType) {
      case TOKEN_TYPES.add: {
          const left = this.#interpretBinaryArithmetic(node.lOperand, currEnv);
          const right = this.#interpretBinaryArithmetic(node.rOperand, currEnv);
            if (typeof left !== typeof right) {
              throw new Error('Cannot add differing types.');
            }

            // * if its character or string, concat without removing quotes
            if (typeof left === 'string') {
              if (left.startsWith('\'')) {
                if (right.startsWith('\'') === false) {
                  throw new Error('Cannot add differing types.');
                }
                // * concatting characters turns it to string
                return '"' + left.slice(1).slice(0, -1) + right.slice(1).slice(0, -1) + '"';
              }
              if (left?.startsWith('"')) {
                if (right.startsWith('"') === false) {
                  throw new Error('Cannot add differing types.');
                }
                return '"' + left.slice(1).slice(0, -1) + right.slice(1).slice(0, -1) + '"';
              }
            }
          return left + right;
      }
      case TOKEN_TYPES.subtract: {
        const left = this.#interpretBinaryArithmetic(node.lOperand, currEnv);
        const right = this.#interpretBinaryArithmetic(node.rOperand, currEnv);
        if (typeof left === 'string' || typeof right === 'string') {
          throw new Error('Cannot use subtract on a string.');
        }
        return left - right;
      }
      case TOKEN_TYPES.multiply: {
        const left = this.#interpretBinaryArithmetic(node.lOperand, currEnv);
        const right = this.#interpretBinaryArithmetic(node.rOperand, currEnv);
        if (typeof left === 'string' || typeof right === 'string') {
          throw new Error('Cannot use multiply on a string.');
        }
        return left * right;
    }
    case TOKEN_TYPES.divide: {
      const left = this.#interpretBinaryArithmetic(node.lOperand, currEnv);
      const right = this.#interpretBinaryArithmetic(node.rOperand, currEnv);
      if (typeof left === 'string' || typeof right === 'string') {
        throw new Error('Cannot use subtract on a string.');
      }
      if (typeof left === 'string' || typeof right === 'string') {
        throw new Error('Cannot use divide on a string.');
      }
      if (right === 0) {
        throw new Error('Cannot divide by zero');
      }
      return left / right;
    }
      default: {
        const message = `Unhandled binary arithmetic. ${node.operator.line}:${node.operator.start}`;
        throw new Error(message);
      }
    }
  }

  #interpretPropertyAccess (node, env) {
    const currEnv = env ?? this.#environment;
    if ((node instanceof NodePropertyAccess) === false) {
      return this.#interpretFnCall(node, currEnv);
    }

    const dataEnv = currEnv.getData(node.object.value);

    if (dataEnv === 'null') {
      const message = `Unable to access property ${node.property.value} of null ${node.object.value}. ${node.object.line}:${node.object.start}`
      throw new Error(message);
    }

    if ((dataEnv instanceof Environment) === false) {
      const message = `${node.object.value} is not an object. ${node.object.line}:${node.object.start}`;
      throw new Error(message);
    }

    // * a.b.c
    if (node.property instanceof NodePropertyAccess) {
      return this.#interpretPropertyAccess(node.property, dataEnv);
    }
    return this.#interpretFnCall(node.property, dataEnv)
  }

  #interpretFnCall (node, env) {
    const currEnv = env ?? this.#environment;
    if ((node instanceof NodeFunctionCall) === false) {
      return this.#interpretBackpointers(node, currEnv);
    }
    const data = currEnv.getData(node.functionIdentifier.value);
    const dataType = currEnv.getType(node.functionIdentifier.value);

    if (data === 'null' || dataType !== 'fn') {
      const message = `${node.functionIdentifier.value} is not a function. ${node.functionIdentifier.line}:${node.functionIdentifier.start}`
      throw new Error(message);
    }
    const args = this.#interpretArguments(node.arguments, currEnv);
    return data(...args);
  }

  #interpretArguments (argNodes, env) {
    const currEnv = env ?? this.#environment;
    return argNodes.map(node => this.#interpretExpression(node, currEnv));
  }

  #interpretBackpointers (node, env) {
    const currEnv = env ?? this.#environment;

    if ((node instanceof NodeBackPointer) === false) {
      return this.#interpretPrimary(node, currEnv);
    }

    if (currEnv.parent === 'null') {
      throw new Error('Global scope has no parent.');
    }

    return this.#interpretBackpointers(node.backPointed, currEnv.parent);
  }

  #interpretPrimary (node, env) {
    const currEnv = env ?? this.#environment;

    if (node instanceof NodeBinaryArithmetic) {
      return this.#interpretBinaryArithmetic(node);
    }

    switch (node.tokenType) {
      case TOKEN_TYPES.number: return parseInt(node.value);
      case TOKEN_TYPES.string:
      case TOKEN_TYPES.character: {
        return node.value;
      }
      case TOKEN_TYPES.identifier: {
        const value = currEnv.getData(node.value);
        return value;
      }
      case 'null': {
        return null;
      }
      default: {
        console.log(node)
        const message = `Invalid primary value: ${node.tokenType} -> ${node.value}`;
        throw new Error(message);
      }
    }
  }
}