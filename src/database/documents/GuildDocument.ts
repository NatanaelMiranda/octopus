interface GuildLogs {
  channel?: string;
  commandLogStatus?: boolean;
}

interface GuildGlobal {
  channel?: string;
  role?: string;
  messages?: {
    join?: string;
    leave?: string;
  };
  colors?: {
    join?: string;
    leave?: string;
  };
  autoVoiceChannel?: string
}

export interface GuildDocument {
  logs?: GuildLogs;
  global?: GuildGlobal;
}
