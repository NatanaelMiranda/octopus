import { Event } from "@/discord/base";
import { autoVoiceChannel } from "@/functions";

new Event({
    name: "voiceStateUpdate",
run(oldState, newState) {
    autoVoiceChannel(oldState, newState);
},
});