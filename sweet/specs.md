NOTE: loops and conditions should not be scopes! shadowed variables should still be visible to the next lines.
NOTE: functions should be static special scopes that allows passing of arguments and reusability of same instance.
NOTE: function scope is special in a way that it delays execution and is not instantiable.
NOTE: since functions are scopes that are not instantiable. we should use .point(x, y, z) 
      as a special backpointer for functions where x, y and z are already defined values during function definition.
      They are accessible via pointer array.

1. a way to create environment programmatically
  this maybe class objects (still far ahead)
  or other non primary type data. 

  - this will allow usage of objects, properties, namespaces, accessors.

2. all the variables in this language is constant. In order to create change
   we need to use shadowing. Using the keyword shadow will allows variable 
   to be redefined at later time.
   shadow const a = "a shadow variable data.";
   const a = "not a shadow anymore";

3. scopes
scopes define a namespace that is two way blackboxed.
- any variable that is defined outside a scope will not be accessible inside that scope.
- any variable that is defined inside the scope is not accessible outside that scope.
- scopes will run codes as follows.
 - definition codes (memory permanent)
 - instantiation codes (memory permanent)
 - reaccess codes (memory temporary)(can be saved)
- reaccess to reaccess is possible.
- we can do property access on scope and scope instance memory
- property accessed scope can be reaccessed but not instantiated
- anything that cannot be referenced in scope is immediately deleted.
- we can prevent reaccess with keyword static
- calling a scope like a function will rerun the workflow from definition. (but we cannot pass arguments)

scope Scope {
  const a = "abcd"; // * this will be available on all scopes of this type.
  Proc.terminal.output("This will run whenever a new scope of this type is created.");
}

// any line of code run within a scope instance is unique with that specific instance.
const scopeA = Scope {
  const b = "b is b";
}

const scopeB = Scope {
  // variable b is not accessible here
}

// scope instances can be reaccessed to run more lines of codes at later time.
// however any memory changes done on reaccess is not accessible on the next reaccess by default.
scopeA {
  Proc.terminal.output(b); // "b is b"
  const c = "this will not be accessible later.";
}
scopeA {
  // variable c is not accessible here
}

// to make the changes permanent between scope instances reaccess, we need to redefine a new variable.
const scopeAA = scopeA {
  const c = "This variable can be accessed later";
}
scopeAA {
  Proc.terminal.output(c); // "This variale can be accessed later"
}

// as long as scope definition is accessible by another scope
// we can define an instance of that scope in another.

Scope ScopeA {}
Scope ScopeB {
  const scopeAInstance = ScopeA{}
}

// reaccess to reaccess is possible
Scope A{}
const instance = A{}
const reaccess1 = instance{}
const reaccess2 = reaccess1{} // this will run codes as: definition -> instance -> reaccess1 -> reaccess2

// defined variables inside a scope instance can be property accessed
// a side effect of only const variable though is accessed properties are readonly
Scope A {
  const aString = "Something";
}
const aInstance = A{};

A.aString // "Something"
aInstance.aString // "Something"

// we can reaccess a scope within another scope
parentScopeI.childScopeI {

}

// instantiating a scope via accessor is not possible
parentScopeI.ChildScope {
  // not possible
  // this will lead to creating permanent memory a lot.
  // define child scope instance during parentScopeI definition instead.
}

// a scope that goes out of bounds cannot be used anymore
Scope Parent1 {
  Scope child1 {}
}
const instance1 = Parent1{
  // child1 accessible here
}
const instance2 = Parent1{
  Scope child2 {}
}

// we cannot use child3 and its intance after
// this unnamed reaccess so it is immediately
// removed in memory after executing
instance2{
  Scope child3 {}
  const child3Instance =  child3{}
}

4. Backpointers 
  Scopes are blackboxes that do not even have access to parent variables.
  Backpointers allow us to reference nth level parent scope variables and its shadows.
  However we cannot backpoint any parent Scope.

  Scope Parent {
    const a = "something";
    Scope Child {
      const b = ../a // reference a variable one step above the child
    }
  }