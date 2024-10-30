import TOKEN_TYPES from "../tokenTypes.js";
import fs from 'fs'
import { 
  ProgramNode,
  NodeDeclaration,
  NodeAssignment,
  NodeBinaryArithmetic,
  NodePropertyAccess,
  NodeFunctionCall,
  NodeBackPointer
} from "./nodes.js";

// TODO function call
export default class AST {
  #rootNode;
  constructor (tokens) {
    this.#buildAST(tokens);
  }

  getTree () {
    return this.#rootNode;
  }

  prettyPrint () {
    fs.writeFile('./print/ast.txt', JSON.stringify(this.#rootNode, null, '\t'), () => {});
  }

  buildTestAST () {
    return JSON.parse(JSON.stringify(this.#rootNode));
  }

  #buildAST (tokens) {
    const binData = this.#buildLineTokens(tokens);
    this.#rootNode = new ProgramNode(binData);
  }

  #buildLineTokens(tokens) {
    const indexOfCurr = getIndexOfNextOp(TOKEN_TYPES.endLine, tokens);
    // * not program lines left, should handle null in interpreter
    if (indexOfCurr === -1) {
      return [this.#buildDeclarationTokens(tokens)];
    }
    const [currLineTokens, _endlineSym, nextLines] = sliceForBinary(tokens, indexOfCurr);
    return [this.#buildDeclarationTokens(currLineTokens), ...this.#buildLineTokens(nextLines)];
  }

   #buildDeclarationTokens(tokens, parentIsDeclaration = false) {
    const indexOfCurr = getIndexOfNextOp(TOKEN_TYPES.keywordConst, tokens);
    if (indexOfCurr === -1) {
      return this.#buildAssignmentNodes(tokens);
    }

    if (parentIsDeclaration) {
      const message = `Syntax Error: Multiple declaration found. ${binData[1].line}:${binData[1].start}`;
      throw new Error(message);
    }
    const [constKeyword, nextTokens] = sliceForUnary(tokens);
    const statementPart = this.#buildDeclarationTokens(nextTokens, true);
    return new NodeDeclaration(constKeyword, statementPart);
  }

  #buildAssignmentNodes (tokens, parentIsAssignment = false) {
    const indexOfCurr = getIndexOfNextOp(TOKEN_TYPES.assigment, tokens);
    if (indexOfCurr === -1) {
      return this.#arithmeticExpressionNodes(tokens);
    }

    const binData = sliceForBinary(tokens, indexOfCurr);
    if (parentIsAssignment) {
      const message = `Syntax Error: Multiple assigments found. ${binData[1].line}:${binData[1].start}`;
      throw new Error(message);
    }
    binData[0] = this.#buildAssignmentNodes(binData[0], true);
    binData[2] = this.#buildAssignmentNodes(binData[2], true);
    return new NodeAssignment(...binData);
  }

  #arithmeticExpressionNodes (tokens) {
    return this.#buildAddOrSubNodes(tokens);
  }

  #buildAddOrSubNodes (tokens) {
    const indexOfAdd = getIndexOfNextOp(TOKEN_TYPES.add, tokens);
    const indexOfSub = getIndexOfNextOp(TOKEN_TYPES.subtract, tokens);
    let indexOfCurr;

    if ((indexOfAdd > -1 && (indexOfAdd < indexOfSub || indexOfSub === -1))) {
      indexOfCurr = indexOfAdd;
    } else {
      indexOfCurr = indexOfSub;
    }

    if (indexOfCurr === -1) {
      return this.#buildMultOrDivNodes(tokens);
    }

    const binData = sliceForBinary(tokens, indexOfCurr);
    binData[0] = this.#buildAddOrSubNodes(binData[0]);
    binData[2] = this.#buildAddOrSubNodes(binData[2]);
    return new NodeBinaryArithmetic(...binData);
  }

  #buildMultOrDivNodes (tokens) {
    const indexOfMult = getIndexOfNextOp(TOKEN_TYPES.multiply, tokens);
    const indexOfDiv = getIndexOfNextOp(TOKEN_TYPES.divide, tokens);
    let indexOfCurr;

    if (indexOfMult > -1 && (indexOfMult < indexOfDiv || indexOfDiv === -1)) {
      indexOfCurr = indexOfMult;
    } else {
      indexOfCurr = indexOfDiv;
    }

    if (indexOfCurr === -1) {
      return this.#buildPropertyAccessNodes(tokens);
    }


    const binData = sliceForBinary(tokens, indexOfCurr);
    binData[0] = this.#buildMultOrDivNodes(binData[0]);
    binData[2] = this.#buildMultOrDivNodes(binData[2]);
    return new NodeBinaryArithmetic(...binData);
  }

  #buildPropertyAccessNodes (tokens) {
    const indexOfPropertyAccess = getIndexOfNextOp(TOKEN_TYPES.accessor, tokens);

    if (indexOfPropertyAccess === -1) {
      return this.#buildFnCallNodes(tokens);
    }

    let binData = sliceForBinary(tokens, indexOfPropertyAccess);
    binData[0] = this.#buildPropertyAccessNodes(binData[0]);
    binData[2] = this.#buildPropertyAccessNodes(binData[2]);
    return new NodePropertyAccess(...binData);
  }

  #buildFnCallNodes (tokens) {
    // * function calls would be identifier(, this returns the index of the identifier in front
    const indexOfFunctionCalls = getIndexOfNextConsecTypes([TOKEN_TYPES.identifier, TOKEN_TYPES.leftParen], tokens);

    if (indexOfFunctionCalls === -1) {
      return this.#buildBackPointerNodes(tokens);
    }
      // * function call identifier serves as the operator
      const fnData = sliceForUnary(tokens);
      const identifer = fnData[0];
      // * extract the arguments part
      // * considering that primary is next to to this level, 
      // * there should be no more operations left on the right side
      fnData[1].shift();
      fnData[1].pop();
      const args = this.#buildFunctionArgumentsNodes(fnData[1]);
      return new NodeFunctionCall(identifer, args);
  }

  #buildFunctionArgumentsNodes (tokens) {
    // * split argument tokens
    const argumentTokensList = tokens.reduce((acm, currTok) => {
      if (currTok.tokenType === TOKEN_TYPES.separator) {
        acm.push([]);
        return acm;
      }
      acm[acm.length - 1].push(currTok);
      return acm;
    }, [[]]);

    // * return an array of smaller expression trees.
    return argumentTokensList
      .map(tokList => this.#arithmeticExpressionNodes(tokList))
      .flat(1);
  }

  #buildBackPointerNodes (tokens) {
    const indexOfCurr = getIndexOfNextOp(TOKEN_TYPES.backPointer, tokens);
    if (indexOfCurr === -1) {
      return this.#buildPrimary(tokens); // * only identifier is allowed here.
    }
    const bpData = sliceForUnary(tokens);
    const bpNode = this.#buildBackPointerNodes(bpData[1]);
    return new NodeBackPointer(bpData[0], bpNode);
  }

  #buildPrimary (tokens) {
    if (tokens.length < 1) {
      return [{ tokenType: 'null', value: 'null'}]; // * null keyword for declarations without immediate assignment
    }
    if (tokens[0].tokenType === TOKEN_TYPES.leftParen) {
      tokens.shift();
    }
    if (tokens[tokens.length - 1].tokenType === TOKEN_TYPES.rightParen) {
      tokens.pop();
    }
    if (tokens.length === 1) {
      return tokens[0];
    }
    return this.#arithmeticExpressionNodes(tokens);
  }
}

const sliceForUnary = (tokens) => {
  return [tokens.shift(), tokens];
};

const sliceForBinary = (tokens, sliceTokenIndex) => {
  let left = tokens.slice(0, sliceTokenIndex);
  let right = tokens.slice(sliceTokenIndex + 1);
  const operand = tokens[sliceTokenIndex];
  return [left, operand, right];
}

const getIndexOfNextOp = (tokenType, tokens) => {
  // * get the index of operator that is outside a parenthesis
  let inParenthesis = false;
  let impairedParenCount = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].tokenType === TOKEN_TYPES.leftParen) {
      impairedParenCount = impairedParenCount + 1;
      inParenthesis = true;
    }
    if (tokens[i].tokenType === TOKEN_TYPES.rightParen) {
      impairedParenCount = impairedParenCount - 1;
    }
    if (impairedParenCount === 0) {
      inParenthesis = false;
    }
    if (impairedParenCount < 0) {
      const message = `Encountered parenthesis without pair. ${tokens[i].line}:${tokens[i].start}`;
      throw new Error(message);
    }
    if (inParenthesis) {
      continue;
    }
    if (tokens[i].tokenType === tokenType) {
      return i;
    }
  }
  return -1;
};

// * checks for tokens that are beside each other
// * ex. identifer, leftparen (could be a function call)
const getIndexOfNextConsecTypes = (tokenTypes, tokens) => {
  let indexStart = -1;
  let inParenthesis = false;
  let impairedParenCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].tokenType === TOKEN_TYPES.leftParen) {
      impairedParenCount = impairedParenCount + 1;
      inParenthesis = true;
    }
    if (tokens[i].tokenType === TOKEN_TYPES.rightParen) {
      impairedParenCount = impairedParenCount - 1;
    }
    if (impairedParenCount === 0) {
      inParenthesis = false;
    }
    if (impairedParenCount < 0) {
      const message = `Encountered parenthesis without pair. ${tokens[i].line}:${tokens[i].start}`;
      throw new Error(message);
    }
    if (inParenthesis) {
      continue;
    }
    // * verify that token types are consecutively correct
    if (tokenTypes[0] === tokens[i].tokenType) {
      let iPeek = i;
      indexStart = i;
      for (let x = 0; x < tokenTypes.length; x++) {
        if (tokenTypes[x] !== tokens[iPeek].tokenType) {
          indexStart = -1;
          break;
        }
        iPeek = iPeek + 1;
        if (iPeek === tokens.length) {
          indexStart = -1;
          break;
        }
      }
    }

    if (indexStart !== -1) {
      return indexStart;
    }
  }
  return -1;
};

// ! might need in the future
const getIndexOfRightParity = (leftType, leftIndex, rightType, tokens) => {
  let impairedCount = 1;

  // * if impairedCount hits 0, that should be the index of right parity
  for (let i = leftIndex + 1; tokens.length; i++) {
    if (tokens[i].tokenType === leftType) {
      impairedCount = impairedCount + 1;
      continue;
    }
    if (tokens[i].tokenType === rightType) {
      impairedCount = impairedCount - 1;
    }
    if (impairedCount === 0) {
      return i;
    }
  }
  return - 1;
}