import Joi from "joi";

export const jobsGetOneParams = Joi.object()
  .keys({
    job_id: Joi.string().required(),
  })
  .required();
