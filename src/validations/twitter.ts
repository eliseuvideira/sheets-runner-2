import Joi from "joi";

export const twitterRowsQuery = Joi.object()
  .keys({
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso(),
  })
  .required();

export const twitterRowsCountsBody = Joi.object()
  .keys({
    row_numbers: Joi.array()
      .items(Joi.number().integer().required())
      .required(),
  })
  .required();

export const twitterRowsWriteRowsBody = Joi.object()
  .keys({
    row_numbers: Joi.array()
      .items(Joi.number().integer().required())
      .required(),
  })
  .required();
