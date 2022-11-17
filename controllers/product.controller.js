const ProductModel = require('.././models/product.model')

class ProductCtrl {
  static createProduct(req, res) {
    const product = req.body
    console.log('Product', req)

    if (req.files) {
      product.images = req?.files.map((file) => `products/${file.filename}`)
    }

    new ProductModel(product)
      .save()
      .then((result) => {
        res.status(200).send({ message: 'Product Created', data: result })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({ message: 'Could not Created', error: err })
      })
  } //createProduct

  static updateProduct(req, res) {
    const product = req.body
    const { id } = req.params

    console.log('Product', req)

    if (req.files) {
      product.images = req?.files.map((file) => `products/${file.filename}`)
    }

    ProductModel.findOneAndUpdate({ _id: id }, product, { new: true })
      .then((result) => {
        res.status(200).send({ message: 'Product Updated', data: result })
      })
      .catch((err) => {
        res.status(404).send({ message: 'Could not updated', error: err })
      })
  } //updateProduct

  static deleteProduct(req, res) {
    const { id } = req.params

    //findOneAndUpdate method use krychi status 2 dych delete ch hote room
    ProductModel.findOneAndDelete({ _id: id })
      .then((result) => {
        res.status(200).send({ message: 'Product Deleted', data: result })
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send({ message: 'Could not Deleted', error: err })
      })
  } //deleteProduct

  static getSingleProduct(req, res) {
    const { id } = req.params

    ProductModel.findOne({ _id: id })
      .then((result) => {
        res.status(200).send({ message: 'Product Details', data: result })
      })
      .catch((err) => {
        console.log(err)
        res
          .status(404)
          .send({ message: 'Could not get Product details', error: err })
      })
  } //getSingleProduct

  static getAllProduct(req, res) {
    const filter = { $or: [{ status: 0 }, { status: 1 }] }

    const { category, color, size } = req.query
    if (category) filter.category = category
    if (color) filter.color = color
    if (size) filter.size = size

    ProductModel.find(filter)
      .then((result) => {
        res.status(200).send({
          message: 'Product List ',
          data: result,
        })
      })
      .catch((err) => {
        console.log(err)
        res
          .status(404)
          .send({ message: 'Product List not Available', error: err })
      })
  } //getAllProduct
}
module.exports = ProductCtrl
