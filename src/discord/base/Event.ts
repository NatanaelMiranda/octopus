import { log } from "@/settings";
import ck from "chalk";
import { ClientEvents } from "discord.js";

type EventData<key extends keyof ClientEvents> = {
  name: key;
  once?: boolean;
  run(...args: ClientEvents[key]): any;
};

export class Event<key extends keyof ClientEvents> {
  public static all: Array<EventData<keyof ClientEvents>> = [];
  constructor(data: EventData<key>) {
    log.successEvent(
      ck.green(
        `${ck.cyan.underline(data.name)} has been successfully registered!`
      )
    );
    Event.all.push(data);
  }
}
