import Environment from "./Environment.js";

const output = (str) => {
  console.log(str.toString());
  return 'null';
};

const kill = () => {
  process.exit(1);
}; 

const Terminal = new Environment();
Terminal.initialize(
  'testTerminal',
  {
    modifiable: false,
    currValue: 12,
    type: 'number'
  }
);
Terminal.initialize(
  'output', 
  {
    modifiable: false,
    currValue: output,
    type: 'fn'
  });
  Terminal.initialize(
    'kill', 
    {
      modifiable: false,
      currValue: kill,
      type: 'fn'
    });

export default Terminal;