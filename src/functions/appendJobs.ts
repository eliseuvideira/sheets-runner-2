import { Job } from "../models/Job";

export const appendJobs = (jobs: Job[], job: Job) => {
  jobs.push(job);

  setTimeout(() => {
    const index = jobs.findIndex((j) => j === job);

    if (index !== -1) {
      jobs.splice(index, 1);
    }
  }, 2 * 60 * 60 * 1000);
};
