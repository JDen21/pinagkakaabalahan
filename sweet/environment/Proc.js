import Environment from "./Environment.js";
import Terminal from "./Terminal.js";

const Proc = new Environment();
Proc.initialize(
  'testProc',
  {
    modifiable: true,
    currValue: 5,
    type: 'number'
  });
Proc.initialize(
  'terminal', 
  {
    modifiable: false,
    currValue: Terminal,
    type: 'Terminal'
  });
Terminal.setParent(Proc);
export default Proc;
