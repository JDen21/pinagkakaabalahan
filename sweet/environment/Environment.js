export default class Environment {
  #cache
  parent

  constructor (parent) {
    this.#cache = {};
    this.parent = parent;
  }

  view (spacing = '') {
   Object
    .entries(this.#cache)
    .forEach(([key, value]) => {
      if (value.type === 'string' || value.type === 'number') {
        console.log(spacing + `${key}: ${value.currValue}`)
        return;
      } else if (value.type === 'fn') {
        console.log(spacing + `${key}: () => {}`)
        return;
      } else {
        // * we assume that this is an object which is basically an environment
        console.log(spacing + key + ': {}')
        value.currValue.view(spacing + '  ');
      }
    });
  }

  setParent (parent) {
    this.parent = parent;
  }

  getData (key)  {
    if (this.#cache[key]) {
      return this.#cache[key].currValue;
    }
    return 'null';
  }

  getType (key) {
    if (this.#cache[key]) {
      return this.#cache[key].type;
    }
    return 'null';
  }

  setData (key, value, type = null) {
    // * this means we can set data once at any point after declaration as long as its null.
    if (this.#cache[key].type !== 'null') {
      if (Boolean(this.#cache[key].modifiable) === false) {
        const message = `Error: Cannot modify constant variable ${key}.`;
        throw new Error(message);
      }
      if (typeof value !== this.#cache[key].type) {
        const message = `Invalid value ${value},  assignment of type ${typeof value} to ${typeof this.#cache[key].type}.`
        throw new Error(message);
      }
    }
    this.#cache[key].currValue = value;
    this.#cache[key].type = type ?? typeof value;
  }

  initialize (key, valueData) {
    this.#cache[key] = valueData
  }
}