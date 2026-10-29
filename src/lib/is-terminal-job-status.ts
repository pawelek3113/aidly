import { Status } from "@/server/db/schema/tables";
import { TERMINAL_STATUSES, TerminalStatus } from "@/types";

export const isTerminalStatus = (s: Status): s is TerminalStatus =>
  (TERMINAL_STATUSES as readonly string[]).includes(s);
