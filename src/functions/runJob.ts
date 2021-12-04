import { Job } from "../models/Job";
import { Run } from "../models/Run";

export const runJob = async (job: Job, runnerFn: () => Promise<Run>) => {
  while (job.attempts < 10) {
    let run: Run;

    try {
      run = await runnerFn();
    } catch (err: any) {
      job.fatal_errors.push({ message: err.messsage });

      if (job.fatal_errors.length > 10) {
        job.completed = true;
        throw err;
      }

      continue;
    }

    job.runs.push(run);

    if (run.successful) {
      console.info(`job ${job.job_id}: completed successfully`);

      job.completed = true;
      job.successful = true;
      job.attempts += 1;

      break;
    }
    console.info(`job ${job.job_id}: failed`);
    console.info(`job ${job.job_id}: waiting`);

    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

    console.info(`job ${job.job_id}: resuming`);

    job.attempts += 1;
  }

  job.completed = true;
};
