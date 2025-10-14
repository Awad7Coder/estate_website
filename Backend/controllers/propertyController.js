const propertyController = require("express").Router();
const vertifyToken = require("../middlewares/VertifyToken");
const Property = require("../models/Property");
const asyncFn = require("../middlewares/asyncweapper");
const AppError = require("../utilites/appError");
const statusText = require("../utilites/statusText");

propertyController.get(
  "/getAll",
  asyncFn(async (req, res) => {
    const properties = await Property.find({});
    return res.status(200).json(properties);
  })
);

propertyController.get(
  "/find/property",
  asyncFn(async (req, res) => {
    const feature = await Property.find({ featured: true }).populate(
      "currentOwner",
      "-password"
    );
    return res.status(200).json(feature);
  })
);

propertyController.get(
  "/find",
  asyncFn(async (req, res, next) => {
    const type = req.query;
    if (type) {
      const properties = await Property.find(type).populate(
        "currentOwner",
        "-password"
      );
      return res.status(200).json(properties);
    } else {
      const error = AppError.create("no such type", 401, statusText.ERROR);
      return next(error);
    }
  })
);

propertyController.get(
  "/find/types",
  asyncFn(async (req, res) => {
    const beachType = await Property.countDocuments({ type: "beach" });
    const mountainType = await Property.countDocuments({ type: "mountain" });
    const villageType = await Property.countDocuments({ type: "village" });

    return res.status(200).json({
      beach: beachType,
      mountain: mountainType,
      village: villageType,
    });
  })
);

propertyController.get(
  "/find/:id",
  asyncFn(async (req, res, next) => {
    const property = await Property.findById(req.params.id).populate(
      "currentOwner",
      "-password"
    );

    if (!property) {
      const error = AppError.create(
        "no such property with this ID",
        401,
        statusText.ERROR
      );
      return next(error);
    }
  })
);

propertyController.post(
  "/",
  vertifyToken,
  asyncFn(async (req, res) => {
    const newProperty = await Property.create({
      ...req.body,
      currentOwner: req.currentUser.id,
    });
    return res.status(200).json(newProperty);
  })
);

propertyController.put(
  "/:id",
  vertifyToken,
  asyncFn(async (req, res, next) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(AppError.create("Property not found", 404, statusText.FAIL));
    }
    if (property.currentOwner.toString() !== req.currentUser.id) {
      const error = AppError.create(
        "Not Allowed to Update Others !!",
        401,
        statusText.ERROR
      );
      return next(error);
    } else {
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedProperty);
    }
  })
);

propertyController.delete(
  "/:id",
  vertifyToken,
  asyncFn(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (property.currentOwner.toString() !== req.currentUser.id) {
      const error = AppError.create(
        "Not Allowed to Delete Others !!",
        401,
        statusText.ERROR
      );
      return next(error);
    } else {
      await Property.deleteOne();
      return res.status(200).json({ msg: "Deleted Successfuly" });
    }
  })
);

module.exports = propertyController;
