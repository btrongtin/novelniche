const Author = require("../models/author");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    res.json(await new Author({ name, slug: slugify(name) }).save());
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create author failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Author.find({}).sort({ createdAt: -1 }).lean());

exports.read = async (req, res) => {
  let author = await Author.findOne({ slug: req.params.slug }).lean();
  // res.json(author);
  const products = await Product.find({ author }).populate("author").lean();

  res.json({
    author,
    products,
  });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Author.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Author update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Author.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Author delete failed");
  }
};