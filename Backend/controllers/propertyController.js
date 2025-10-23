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
  "/find/featured",
  asyncFn(async (req, res, next) => {
    try {
      const featuredProperties = await Property.find({ featured: true })
        .populate("currentOwner", "-password")
        .limit(6);

      return res.status(200).json(featuredProperties);
    } catch (error) {
      console.error("Error in featured properties route:", error);
      next(error);
    }
  })
);

const arrPriceRanges = [
  "0-100000",
  "100000-200000",
  "200000-300000",
  "300000-400000",
  "400000-500000",
];

propertyController.get(
  "/find",
  asyncFn(async (req, res, next) => {
    try {
      const query = req.query;

      if (Object.keys(query).length > 0) {
        let dbQuery = {};

        // Handle type filter
        if (query.type && query.type !== "undefined") {
          dbQuery.type = query.type;
        }

        // Handle continent filter
        if (query.continent && query.continent !== "undefined") {
          // Check if continent is a number (index) or string (name)
          if (!isNaN(query.continent)) {
            // It's a number (index), convert to continent name
            const continentIndex = Number(query.continent);
            const continentNames = [
              "Europe",
              "Asia",
              "Africa",
              "South America",
              "North America",
              "Oceania",
            ];
            if (continentIndex >= 0 && continentIndex < continentNames.length) {
              dbQuery.continent = continentNames[continentIndex];
            }
          } else {
            // It's already a continent name
            dbQuery.continent = query.continent;
          }

          // Debug: Check what's in the database
          const allContinents = await Property.distinct("continent");
        }

        // Handle price range filter
        if (query.priceRange && query.priceRange !== "undefined") {
          const priceRangeIndex = Number(query.priceRange);
          const arrPriceRanges = [
            "0-100000",
            "100000-200000",
            "200000-300000",
            "300000-400000",
            "400000-500000",
          ];
          if (priceRangeIndex >= 0 && priceRangeIndex < arrPriceRanges.length) {
            const priceRange = arrPriceRanges[priceRangeIndex];
            const [minPrice, maxPrice] = priceRange.split("-").map(Number);
            dbQuery.price = { $gte: minPrice, $lte: maxPrice };
          }
        }

        const properties = await Property.find(dbQuery).populate(
          "currentOwner",
          "-password"
        );

        return res.status(200).json(properties);
      } else {
        // If no query parameters, return all properties
        const properties = await Property.find({}).populate(
          "currentOwner",
          "-password"
        );
        return res.status(200).json(properties);
      }
    } catch (error) {
      console.error("Error in /find route:", error);
      next(error);
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
        404, // Changed from 401 to 404
        statusText.ERROR
      );
      return next(error);
    }

    return res.status(200).json(property);
  })
);

// Testing Token Verification
propertyController.get(
  "/test-token",
  vertifyToken,
  asyncFn(async (req, res) => {
    return res.status(200).json({
      message: "Token is valid",
      user: req.currentUser,
    });
  })
);

propertyController.post(
  "/",
  vertifyToken,
  asyncFn(async (req, res, next) => {
    try {
      const newProperty = await Property.create({
        ...req.body,
        currentOwner: req.currentUser.id,
      });

      return res.status(201).json(newProperty);
    } catch (error) {
      console.error("Property creation error:", error);
      next(error);
    }
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

propertyController.put(
  "/bookmark/:id",
  vertifyToken,
  asyncFn(async (req, res, next) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) {
        return next(
          AppError.create("Property not found", 404, statusText.FAIL)
        );
      }

      // Check if user already bookmarked
      const isBookmarked = property.bookmarkedUsers?.includes(
        req.currentUser.id
      );

      if (isBookmarked) {
        // Remove bookmark
        await Property.findByIdAndUpdate(
          req.params.id,
          { $pull: { bookmarkedUsers: req.currentUser.id } },
          { new: true }
        );
      } else {
        // Add bookmark
        await Property.findByIdAndUpdate(
          req.params.id,
          { $addToSet: { bookmarkedUsers: req.currentUser.id } },
          { new: true }
        );
      }

      return res.status(200).json({ message: "Bookmark updated successfully" });
    } catch (error) {
      next(error);
    }
  })
);

propertyController.delete(
  "/:id",
  vertifyToken,
  asyncFn(async (req, res, next) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return next(
          AppError.create("Property not found", 404, statusText.FAIL)
        );
      }

      if (property.currentOwner.toString() !== req.currentUser.id) {
        const error = AppError.create(
          "Not Allowed to Delete Others !!",
          401,
          statusText.ERROR
        );
        return next(error);
      } else {
        await Property.findByIdAndDelete(req.params.id);
        return res.status(200).json({ msg: "Deleted Successfully" });
      }
    } catch (error) {
      next(error);
    }
  })
);

module.exports = propertyController;
