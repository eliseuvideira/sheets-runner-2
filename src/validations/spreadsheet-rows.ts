import Joi from "joi";

export const spreadsheetRowsGetOneParams = Joi.object()
  .keys({
    row_number: Joi.number().integer().required(),
  })
  .required();
