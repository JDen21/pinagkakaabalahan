import Environment from "./Environment.js";
import Proc from "./Proc.js";

const Global = new Environment('null');
Global.initialize(
  'Proc', 
  {
    modifiable: false,
    currValue: Proc,
    type: 'Proc'
  });
Proc.setParent(Global);
export default Global;