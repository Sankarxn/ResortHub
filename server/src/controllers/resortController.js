import { Resort } from '../models/Resort.js';

/**
 * GET /api/resorts
 * Fetch all resorts with optional category and search filters
 */
export const getAllResorts = async (req, res, next) => {
  try {
    const { search, category, minRating } = req.query;
    const query = {};

    if (category && category !== 'All Resorts') {
      query.category = category;
    }

    if (minRating) {
      const parsedRating = parseFloat(minRating);
      if (!isNaN(parsedRating)) {
        query.rating = { $gte: parsedRating };
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { location: searchRegex }];
    }

    const resorts = await Resort.find(query).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resorts.length,
      data: resorts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resorts/:id
 * Fetch single resort by ID
 */
export const getResortById = async (req, res, next) => {
  try {
    const resort = await Resort.findById(req.params.id);

    if (!resort) {
      return res.status(404).json({
        success: false,
        message: `Resort with ID ${req.params.id} was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: resort,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/resorts
 * Create a new resort (Protected: Admin only)
 */
export const createResort = async (req, res, next) => {
  try {
    const { name, location, category, rating, openingHours, description, imageUrl, googleMapsUrl, rooms } = req.body;

    if (!name || !location || !category || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, location, category, description, and imageUrl.',
      });
    }

    const newResort = await Resort.create({
      name: name.trim(),
      location: location.trim(),
      category: category.trim(),
      rating: rating ? Number(rating) : 4.5,
      openingHours: openingHours || 'Open 24 Hours',
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      googleMapsUrl: googleMapsUrl || '',
      rooms: Array.isArray(rooms) ? rooms : [],
    });

    res.status(201).json({
      success: true,
      message: 'Resort created successfully.',
      data: newResort,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/resorts/:id
 * Update an existing resort (Protected: Admin only)
 */
export const updateResort = async (req, res, next) => {
  try {
    const updatedResort = await Resort.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedResort) {
      return res.status(404).json({
        success: false,
        message: `Resort with ID ${req.params.id} was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resort updated successfully.',
      data: updatedResort,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resorts/:id
 * Delete a resort (Protected: Admin only)
 */
export const deleteResort = async (req, res, next) => {
  try {
    const deletedResort = await Resort.findByIdAndDelete(req.params.id);

    if (!deletedResort) {
      return res.status(404).json({
        success: false,
        message: `Resort with ID ${req.params.id} was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Resort "${deletedResort.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
