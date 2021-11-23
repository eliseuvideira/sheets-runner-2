import Joi from "joi";

export const twitterMentionsQuery = Joi.object()
  .keys({
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso(),
  })
  .required();
