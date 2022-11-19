const Joi = require('joi')

function validateProduct(req, res, next) {
  const product = req.body

  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .required()
      .min(2)
      .max(45)
      .error(() => new Error('Not a valid product name')),
    category: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    price: Joi.number().required(),
    status: Joi.number().required(),
    stock: Joi.number().min(20).required(),
    color: Joi.string().min(3).required(),
    images: Joi.array(),
  })

  const result = schema.validate(product)
  console.log('Result:', result)
  if (result?.error)
    res.status(500).send({ message: result.error.message, error: null })
  else next()
}
module.exports = { validateProduct }
