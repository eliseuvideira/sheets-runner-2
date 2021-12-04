import { Run } from "./Run";

export interface Job {
  job_id: string;
  route: "/async/twitter" | "/async/twitter-counts" | "/async/write-rows";
  completed: boolean;
  successful: boolean;
  attempts: number;
  runs: Run[];
  fatal_errors: { message: string }[];
}
