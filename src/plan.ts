// deno-lint-ignore-file no-explicit-any
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";

export interface Row {
  year: string,
  time_start: number,
  time_end: number,
  subject: string,
  course: string,
  teacher: string,
  room: string,
  type: string,
  alert: string
}

export class Plan {
  url: string;
  year: string;
  formatted: Array<Row>;
  date: string;
  day: string;
  constructor(_year: string, _day: string) {
    this.day = _day;
    this.url = `https://lmg-anrath.de/aktuelle_plaene/Vertretungsplan/${this.day}/subst_001.htm`;
    this.year = _year;
    this.formatted = [];
    this.date = '0:0';
  }

  async refresh() {
    try {
      const res = await fetch(this.url);
      const html = await res.text();
      const document = new DOMParser().parseFromString(html, 'text/html');

      const heading = document?.querySelector('.mon_title')?.textContent;
      const plan_date = `${heading?.split('.')[0]}:${heading?.split('.')[1]}`;
      // if (this.date != plan_date && this.date != '0:0') {}
      this.date = plan_date;

      const rows = document?.querySelectorAll('.list');

      if (!rows) return;

      const rows_sorted: Array<any> = [];
      for (let i = 8; i < rows?.length; i++) {
        const this_row: Array<any> = [];
        for (let x = 0; x < 7; x++) {
          this_row.push(rows[i + x]);
        }
        i += 7;
        rows_sorted.push(this_row);
      }

      const rows_formatted: Array<Row> = [];
      for (let i = 0; i < rows_sorted.length; i++) {
        const this_row = rows_sorted[i][0];
        rows_formatted.push(this.format_row(this_row));
      }
      this.formatted = rows_formatted;
      return 'ok';
    } catch (err) {
      console.log(err);
    }
    
  }

  format_row(row: any): Row {
    const year = row.children[0].textContent;

    const time = row.children[1].textContent;
    const split = time.split(' - ');
    const time_start = parseInt(split[0]);
    const time_end = split.length > 1 ? parseInt(split[1]) : time_start;

    const subjectandcourse: string = row.children[2].textContent;
    const split2 = subjectandcourse.split(' ');
    if (split2.length == 3) split2.splice(1, 1);
    const subject = split2.length == 2 ? split2[0] : 'null';
    const course = split2.length == 2 ? split2[1] : subject;
    const teacher = row.children[3].textContent;
    const room = row.children[4].textContent;
    const type = row.children[5].textContent;
    const alert = row.children[6].textContent;
    const json: Row = {
      year,
      time_start,
      time_end,
      subject,
      course,
      teacher,
      room,
      type,
      alert
    }
    return json;
  }
}