import { Resort } from '../models/Resort.js';

/**
 * GET /api/admin/dashboard
 * Dashboard statistics: total resorts, total rooms, resorts with room counts
 */
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const resorts = await Resort.find({}, 'name location category rating rooms').lean();

    const totalResorts = resorts.length;
    let totalRooms = 0;

    const resortsSummary = resorts.map((r) => {
      const roomCount = Array.isArray(r.rooms) ? r.rooms.length : 0;
      totalRooms += roomCount;
      return {
        _id: r._id.toString(),
        id: r._id.toString(),
        name: r.name,
        location: r.location,
        category: r.category,
        rating: r.rating,
        roomCount,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalResorts,
        totalRooms,
        resorts: resortsSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/rooms
 * List all rooms flattened across all resorts with resort details
 */
export const getAdminRooms = async (req, res, next) => {
  try {
    const resorts = await Resort.find({}, 'name location rooms').lean();

    const allRooms = [];
    resorts.forEach((resort) => {
      if (Array.isArray(resort.rooms)) {
        resort.rooms.forEach((room) => {
          const rId = room._id.toString();
          allRooms.push({
            _id: rId,
            id: rId,
            roomId: rId,
            resortId: resort._id.toString(),
            resortName: resort.name,
            resortLocation: resort.location,
            name: room.name,
            description: room.description,
            capacity: room.capacity,
            amenities: room.amenities || [],
            imageUrl: room.imageUrl || '',
            pricePerNight: room.pricePerNight || null,
          });
        });
      }
    });

    res.status(200).json({
      success: true,
      count: allRooms.length,
      data: allRooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/resorts/:resortId/rooms
 * Add a new room nested inside the specified resort
 */
export const addRoomToResort = async (req, res, next) => {
  try {
    const { resortId } = req.params;
    const { name, description, capacity, amenities, imageUrl, pricePerNight } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Room name is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Room description is required.' });
    }
    const parsedCapacity = Number(capacity);
    if (!capacity || isNaN(parsedCapacity) || parsedCapacity < 1) {
      return res.status(400).json({ success: false, message: 'Room capacity must be a valid number of at least 1 guest.' });
    }

    const resort = await Resort.findById(resortId);
    if (!resort) {
      return res.status(404).json({ success: false, message: `Resort with ID ${resortId} was not found.` });
    }

    // Format amenities
    let formattedAmenities = [];
    if (Array.isArray(amenities)) {
      formattedAmenities = amenities.map((a) => String(a).trim()).filter(Boolean);
    } else if (typeof amenities === 'string') {
      formattedAmenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    const newRoom = {
      name: name.trim(),
      description: description.trim(),
      capacity: parsedCapacity,
      amenities: formattedAmenities,
      imageUrl: imageUrl ? imageUrl.trim() : '',
      pricePerNight: pricePerNight !== undefined && pricePerNight !== '' ? Number(pricePerNight) : null,
    };

    resort.rooms.push(newRoom);
    await resort.save();

    const createdRoom = resort.rooms[resort.rooms.length - 1];

    res.status(201).json({
      success: true,
      message: 'Room added successfully.',
      data: {
        roomId: createdRoom._id.toString(),
        resortId: resort._id.toString(),
        resortName: resort.name,
        room: createdRoom,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/resorts/:resortId/rooms/:roomId
 * Update an existing room nested inside the specified resort
 */
export const updateRoomInResort = async (req, res, next) => {
  try {
    const { resortId, roomId } = req.params;
    const { name, description, capacity, amenities, imageUrl, pricePerNight } = req.body;

    const resort = await Resort.findById(resortId);
    if (!resort) {
      return res.status(404).json({ success: false, message: `Resort with ID ${resortId} was not found.` });
    }

    const room = resort.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: `Room with ID ${roomId} was not found in this resort.` });
    }

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ success: false, message: 'Room name cannot be empty.' });
      room.name = name.trim();
    }
    if (description !== undefined) {
      if (!description.trim()) return res.status(400).json({ success: false, message: 'Room description cannot be empty.' });
      room.description = description.trim();
    }
    if (capacity !== undefined) {
      const parsedCapacity = Number(capacity);
      if (isNaN(parsedCapacity) || parsedCapacity < 1) {
        return res.status(400).json({ success: false, message: 'Capacity must be at least 1 guest.' });
      }
      room.capacity = parsedCapacity;
    }
    if (amenities !== undefined) {
      if (Array.isArray(amenities)) {
        room.amenities = amenities.map((a) => String(a).trim()).filter(Boolean);
      } else if (typeof amenities === 'string') {
        room.amenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
      }
    }
    if (imageUrl !== undefined) {
      room.imageUrl = imageUrl.trim();
    }
    if (pricePerNight !== undefined) {
      room.pricePerNight = pricePerNight !== '' && pricePerNight !== null ? Number(pricePerNight) : null;
    }

    await resort.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully.',
      data: {
        roomId: room._id.toString(),
        resortId: resort._id.toString(),
        room,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/resorts/:resortId/rooms/:roomId
 * Delete a room from its parent resort
 */
export const deleteRoomFromResort = async (req, res, next) => {
  try {
    const { resortId, roomId } = req.params;

    const resort = await Resort.findById(resortId);
    if (!resort) {
      return res.status(404).json({ success: false, message: `Resort with ID ${resortId} was not found.` });
    }

    const room = resort.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: `Room with ID ${roomId} was not found in this resort.` });
    }

    // Pull room from subdocument array
    resort.rooms.pull(roomId);
    await resort.save();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully.',
      data: {
        roomId,
        resortId: resort._id.toString(),
        remainingRoomCount: resort.rooms.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
