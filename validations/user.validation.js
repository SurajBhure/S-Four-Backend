const Joi = require('joi')

function validateUser(req, res, next) {
  const user = req.body

  const schema = Joi.object({
    'name.first': Joi.string().min(2).max(45),
    'name.last': Joi.string().min(2).max(45),

    mobile: Joi.string()
      .pattern(new RegExp('^[0-9]{10,15}$'))
      .error(() => new Error('mobile must be 10 digits')),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'in'] },
      })
      .error(() => new Error('Invalid Email')),
    password: Joi.string()
      .allow('')
      .optional()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    gender: Joi.string().min(1).max(15),
    role: Joi.string().min(1).max(25),
    status: Joi.any(),
    userId: Joi.number().min(0).max(10).optional(),
    avatar: Joi.string(),

    'address.street': Joi.string().min(3).max(45),
    'address.city': Joi.string().min(3).max(45),
    'address.country': Joi.string().min(3).max(45),
    'address.pincode': Joi.string().min(2).max(45),
  })

  const result = schema.validate(user)
  console.log('Result:', result)
  if (result?.error)
    res.status(500).send({ message: result.error.message, error: null })
  else next()
}
module.exports = { validateUser }
