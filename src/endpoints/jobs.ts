import { endpoint } from "@ev-fns/endpoint";
import { HttpError } from "@ev-fns/errors";
import { jobs } from "../utils/jobs";

export const jobsGetMany = endpoint(async (req, res) => {
  res.status(200).json(jobs);
});

export const jobsGetOne = endpoint(async (req, res) => {
  const { job_id } = req.query;

  const job = jobs.find((job) => job.job_id === job_id);

  if (!job) {
    throw new HttpError(404, "Not found");
  }

  res.status(200).json(job);
});
