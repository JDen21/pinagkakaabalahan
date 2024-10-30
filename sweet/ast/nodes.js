
export class ProgramNode {
  callStack;

  constructor (commandsArray) {
    this.callStack = commandsArray.flat(1);
  }
}

export class NodeBinaryArithmetic {
  lOperand;
  operator;
  rOperand;

  constructor (lOperand, operator, rOperand) {
    this.lOperand = lOperand;
    this.operator = operator;
    this.rOperand = rOperand;
  }
}

export class NodeBackPointer {
  backPointer;
  backPointed;

  constructor (backPointer, backPointed) {
    this.backPointer = backPointer;
    this.backPointed = backPointed;
  }
}
export class NodeAssignment {
  identifiers;
  assignment;
  expression;

  constructor (identifiers, assigment, expression) {
    this.identifiers = identifiers;
    this.assignment = assigment;
    this.expression = expression;
  }
}

export class NodePropertyAccess {
  object;
  accessor;
  property;

  constructor(object, accessor, property) {
    this.object = object;
    this.accessor = accessor;
    this.property = property;
  }
}

export class NodeFunctionCall {
  functionIdentifier;
  arguments;

  constructor (identifier, args) {
    this.functionIdentifier = identifier;
    this.arguments = args;
  }
}

export class NodeDeclaration {
  keyword;
  statement;

  constructor (keyword, statement) {
    this.keyword = keyword;
    this.statement = statement;
  }
}