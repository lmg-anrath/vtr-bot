import { Handler } from './handler.ts';
import { Plan } from './plan.ts';

console.log(Deno.env.get('T_TOKEN'))

const classes = [['M', 'L2'], ['GE', 'G2'], ['EK', 'G2'], ['SP', 'G2'], ['IF', 'L1'], ['PH', 'G2'], ['E', 'G1'], ['PL', 'G2'], ['D', 'G3'], ['KU', 'G2'], ['PU', 'G1'], ['SW', 'L1']];

const plan_today = new Plan('Q1', 'heute');
const handler_today = new Handler('Q1', classes, plan_today);
handler_today.run();


const plan_tomorrow = new Plan('Q1', 'morgen');
const handler_tomorrow = new Handler('Q1', classes, plan_tomorrow);

setTimeout(() => {
  handler_tomorrow.run();
}, 30000);