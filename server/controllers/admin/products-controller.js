const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = "data:" + req.file.mimetype + ";base64," + b64;

    // Cloudinary'e yükle
    const uploadResult = await imageUploadUtil(dataUri);

    // Dönen URL'in 'https' olduğundan emin ol
    const secureUrl =
      uploadResult.secure_url || uploadResult.url.replace(/^http:/i, "https:");

    // Cloudinary'den dönen result objesini, secure_url ile güncelleyerek geri gönder
    const finalResult = {
      ...uploadResult,
      url: secureUrl,
      secure_url: secureUrl,
    };

    res.json({
      success: true,
      result: finalResult, // Güncellenmiş result objesini gönder
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Resim yüklenirken bir hata oluştu.",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      images,
      title,
      description,
      category,
      brand,
      priceUSD, // Değişti: price -> priceUSD
      salePriceUSD, // Değişti: salePrice -> salePriceUSD
      totalStock,
      averageReview,
      costPrice,
      technicalSpecs,
    } = req.body;

    const newlyCreatedProduct = new Product({
      image,
      images: images || [],
      title,
      description,
      category,
      brand,
      priceUSD, // Değişti
      salePriceUSD, // Değişti
      totalStock,
      averageReview,
      costPrice,
      technicalSpecs,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    const {
      image,
      images,
      title,
      description,
      category,
      brand,
      priceUSD, // Değişti
      salePriceUSD, // Değişti
      totalStock,
      averageReview,
      costPrice,
      technicalSpecs,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    if (title !== undefined) findProduct.title = title;
    if (description !== undefined) findProduct.description = description;
    if (category !== undefined) findProduct.category = category;
    if (brand !== undefined) findProduct.brand = brand;
    if (priceUSD !== undefined) findProduct.priceUSD = priceUSD; // Değişti
    if (salePriceUSD !== undefined) findProduct.salePriceUSD = salePriceUSD; // Değişti
    if (totalStock !== undefined) findProduct.totalStock = totalStock;
    if (image !== undefined) findProduct.image = image;
    if (images !== undefined) findProduct.images = images;
    if (averageReview !== undefined) findProduct.averageReview = averageReview;
    if (costPrice !== undefined) findProduct.costPrice = costPrice;
    if (technicalSpecs !== undefined) findProduct.technicalSpecs = technicalSpecs;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
