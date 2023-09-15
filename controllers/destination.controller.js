import { ErrorMessage, SuccessMessage } from "../const/message.js";
import destinationModel from "../models/destination-model.js";
import reviewModel from "../models/review-model.js";

//@desc creating new travel destination
//@route POST /api/tripadvisor/add-destination

export const createDestination = async (req, res) => {
  const { name, location, description, rating } = req.body;

  try {
    if (!name || !location || !description || !rating) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }
    const newDestination = new destinationModel({
      name,
      location,
      rating,
      description,
    });

    await newDestination.save();

    return res.status(200).json({
      message: SuccessMessage.DESTINATION_ADDED,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

//@desc getting all travel destination
//@route GET /api/tripadvisor/destinations

export const getAllDestination = async (req, res) => {
  try {
    const findAllDestination = await destinationModel
      .find()
      .populate("reviews")
      .select("-__v -updatedAt");
    if (!findAllDestination) {
      return res.status(404).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }

    return res.status(200).json({
      message: SuccessMessage.DESTINATION_FOUND,
      success: true,
      data: findAllDestination,
    });
  } catch (error) {
    throw error;
  }
};

//@desc getting travel destination by name
//@route GET /api/tripadvisor/destination:name
export const getDestinationByName = async (req, res) => {
  const { destinationName } = req.params;
  try {
    if (!destinationName) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }
    const findDestination = await destinationModel
      .findOne({
        name: destinationName,
      })
      .populate("reviews")
      .select("-__v -updatedAt");
    if (!findDestination) {
      return res.status(404).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }

    return res.status(200).json({
      message: SuccessMessage.DESTINATION_FOUND,
      success: true,
      data: findDestination,
    });
  } catch (error) {
    throw error;
  }
};

//@desc getting travel destination by location
//@route GET /api/tripadvisor/destination/location:name

export const getDestinationByLocation = async (req, res) => {
  const { location } = req.params;
  try {
    if (!location) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }
    const findDestination = await destinationModel
      .find({ location: location })
      .populate("reviews")
      .select("-__v -updatedAt");
    if (!findDestination.length) {
      return res.status(404).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }

    return res.status(200).json({
      message: SuccessMessage.DESTINATION_FOUND,
      success: true,
      data: findDestination,
    });
  } catch (error) {
    throw error;
  }
};

//@desc getting travel destination by rating
//@route GET /api/tripadvisor/destination/rating

export const getDestinationByRating = async (req, res) => {
  //   const { rating } = req.params;
  try {
    const findDestination = await destinationModel
      .find()
      .sort({ rating: -1 })
      .populate("reviews")
      .select("-__v -updatedAt");

    return res.status(200).json({
      message: SuccessMessage.DESTINATION_FOUND,
      success: true,
      data: findDestination,
    });
  } catch (error) {
    throw error;
  }
};

//@desc updating travel destination by id
//@route POST /api/tripadvisor/destinations/:destinationId

export const updateDestination = async (req, res) => {
  const { destinationId } = req.params;
  const { name, location, rating, description } = req.body;
  try {
    if (!destinationId) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }
    const findAndUpdate = await destinationModel
      .findByIdAndUpdate(
        { _id: destinationId },
        {
          name: name,
          location: location,
          rating: rating,
          description: description,
        },
        {
          new: true,
        }
      )
      .populate("reviews")
      .select("-__v -updatedAt");
    if (!findAndUpdate) {
      return res.status(404).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }
    return res.status(200).json({
      message: SuccessMessage.DESTINATION_UPDATED,
      success: true,
      data: findAndUpdate,
    });
  } catch (error) {
    throw error;
  }
};

//@desc deleting travel destination by id
//@route DELETE /api/tripadvisor/destinations/:destinationId
export const deleteDestination = async (req, res) => {
  const { destinationId } = req.params;
  try {
    if (!destinationId) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }
    const findDestination = await destinationModel.findById({
      _id: destinationId,
    });
    if (!findDestination) {
      return res.status(400).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }
    await destinationModel.findByIdAndDelete({ _id: destinationId });
    await reviewModel.findOneAndDelete({ destinationId: destinationId });
    return res.status(200).json({
      message: SuccessMessage.DESTINATION_DELETED,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

//@desc filtering travel destination by minrating
//@route GET /api/tripadvisor/destinations/rating/:minRating

export const filterDestinationByRating = async (req, res) => {
  const { minRating } = req.params;
  try {
    if (!minRating) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }
    const filterDestination = await destinationModel
      .find({
        rating: { $gte: minRating },
      })
      .populate("reviews")
      .select("-__v -updatedAt");
    if (!filterDestination.length) {
      return res.status(404).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }
    return res.status(200).json({
      message: SuccessMessage.DESTINATION_FOUND,
      success: true,
      data: filterDestination,
    });
  } catch (error) {
    throw error;
  }
};

//@desc adding review to travel destination
//@route POST /api/tripadvisor/destinations/:destinationId/reveiw

export const addReviewToDestination = async (req, res) => {
  const { destinationId } = req.params;
  const { text, userId, rating } = req.body;
  try {
    if (!destinationId || !text || !userId || !rating) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }

    const newReview = new reviewModel({
      text: text,
      rating: rating,
      userId: userId,
      destinationId: destinationId,
    });
    await newReview.save();
    await destinationModel.updateOne(
      { _id: destinationId },
      {
        $push: {
          reviews: newReview._id,
        },
      }
    );
    return res.status(200).json({
      message: SuccessMessage.REVEIW_ADDED,
      success: true,
      data: newReview,
    });
  } catch (error) {
    throw error;
  }
};

//@desc get review of a travel destination
//@route get /api/tripadvisor/destinations/:destinationId/reveiws

export const getAllReviewOfDestination = async (req, res) => {
  const { destinationId } = req.params;
  try {
    if (!destinationId) {
      return res.status(400).json({
        message: ErrorMessage.MISSING_FIELD,
        success: false,
      });
    }

    const findReviews = await reviewModel
      .find({
        destinationId: destinationId,
      })
      .select("-destinationId -__v -updatedAt");
    if (!findReviews.length) {
      return res.status(404).json({
        message: ErrorMessage.DESTINATION_NOT_FOUND,
        success: false,
      });
    }

    return res.status(200).json({
      message: SuccessMessage.REVIEW_FETCH,
      success: true,
      data: findReviews,
    });
  } catch (error) {
    throw error;
  }
};
