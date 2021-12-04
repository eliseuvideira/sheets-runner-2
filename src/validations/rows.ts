import Joi from "joi";

export const rowsGetOneParams = Joi.object()
  .keys({
    row_number: Joi.number().integer().required(),
  })
  .required();
