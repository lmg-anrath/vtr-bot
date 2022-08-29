import { Plan, Row } from './plan.ts';
import { Telegram } from './util/telegram.ts';

export class Handler {
  telegram: Telegram;
  plan: Plan;
  classes: Array<Array<string>>;
  year: string;
  last_plan: Array<Row>;
  constructor(_year: string, _classes: Array<Array<string>>, _plan: Plan) {
    this.telegram = new Telegram();
    this.plan = _plan;
    this.classes = _classes;
    this.year = _year;
    this.last_plan = [];
    this.run();
  }

  run() {
    const now = new Date();
    console.log(now.toTimeString());
    console.log('Setting interval...');
    setInterval(async () => {
      await this.plan.refresh();
      this.check_plan(this.plan);
    }, this.get_interval());
  }

  get_interval(): number {
    const now = new Date();
    if (now.getHours() >= 7 && now.getHours() < 9) {
      return this.rand();
    } else if (now.getHours() >= 9 && now.getHours() < 17) {
      return 6 * this.rand();
    } else if (now.getHours() == 6) {
      return 9 * this.rand();
    } else {
      return 20 * this.rand();
    }
  }

  rand() {
    return Math.floor(Math.random() * (80000 - 40000 + 1) + 40000);
  }

  check_plan(plan: Plan) {
    const data: Array<Row> = this.filter(plan.formatted);
    if (this.equal(data, this.last_plan)) {
      return;
    }
    this.last_plan = data;
    for (let i = 0; i < data.length; i++) {
      for (let x = 0; x < this.classes.length; x++) {
        if (data[i].subject == this.classes[x][0] && data[i].course == this.classes[x][1]) {
          const msg = `${plan.day.charAt(0).toUpperCase() + plan.day.slice(1)} ${data[i].type} von ${data[i].time_start} bis ${data[i].time_end} in ${data[i].subject}`;
          console.log(msg);
          this.send_info(msg.replaceAll(' ', '+'));
        }
      }
    }
  }

  send_info(_msg: string) {
    this.telegram.send(_msg);
  }

  filter(array: Array<Row>): Array<Row> {
    let i = 0;
    while (i < array.length) {
      if (array[i].year !== this.year) {
        array.splice(i, 1);
      } else {
        ++i;
      }
    }
    return array;
  }

  equal(ary1: any,ary2: any){
    return (ary1.join('') == ary2.join(''));
  }
}