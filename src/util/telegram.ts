import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export class Telegram {
  telegram_token: string;
  telegram_prefix: string;
  constructor() {
    this.telegram_token = Deno.env.get('T_TOKEN')?.toString() || 'null';
    this.telegram_prefix = `https://api.telegram.org/bot${this.telegram_token}/sendMessage?chat_id=${Deno.env.get('CHAT_ID') ? Deno.env.get('CHAT_ID') : 'null'}&parse_mode=Markdown&text=MSG`;
  }

  send(_msg: string) {
    fetch(this.telegram_prefix.replace('MSG', _msg));
  }
}