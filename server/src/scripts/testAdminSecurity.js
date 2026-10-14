import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from '../app.js';
import { User } from '../models/User.js';
import { Resort } from '../models/Resort.js';
import { signToken } from '../middleware/authMiddleware.js';

const runTests = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MONGODB_URI not found.');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('Connected to DB for security verification.');

  // Start app on ephemeral port
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  let failures = 0;
  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failures++;
    }
  };

  try {
    console.log('\n--- 1. Testing Unauthenticated Access (Expect 401) ---');
    const unauthDashboard = await fetch(`${baseUrl}/admin/dashboard`);
    assert(unauthDashboard.status === 401, 'Unauthenticated GET /api/admin/dashboard returns 401');

    const unauthRooms = await fetch(`${baseUrl}/admin/rooms`);
    assert(unauthRooms.status === 401, 'Unauthenticated GET /api/admin/rooms returns 401');

    console.log('\n--- 2. Testing Non-Admin User Access (Expect 403 Forbidden) ---');
    // Ensure test regular user
    const normalEmail = 'normaluser_test@example.com';
    let normalUser = await User.findOne({ email: normalEmail });
    if (!normalUser) {
      normalUser = await User.create({
        name: 'Normal User',
        email: normalEmail,
        passwordHash: 'dummyhash',
        role: 'user',
      });
    } else {
      normalUser.role = 'user';
      await normalUser.save();
    }

    const normalToken = signToken(normalUser);
    const normalHeaders = {
      Cookie: `resorthub_jwt=${normalToken}`,
      'Content-Type': 'application/json',
    };

    const normalDashboard = await fetch(`${baseUrl}/admin/dashboard`, { headers: normalHeaders });
    assert(normalDashboard.status === 403, 'Normal user GET /api/admin/dashboard returns 403 Forbidden');

    const normalRooms = await fetch(`${baseUrl}/admin/rooms`, { headers: normalHeaders });
    assert(normalRooms.status === 403, 'Normal user GET /api/admin/rooms returns 403 Forbidden');

    // Attempting to post room as normal user
    const resort = await Resort.findOne({});
    if (!resort) throw new Error('No resorts found in DB to test with.');

    const normalAddRoom = await fetch(`${baseUrl}/admin/resorts/${resort._id}/rooms`, {
      method: 'POST',
      headers: normalHeaders,
      body: JSON.stringify({ name: 'Hacker Suite', description: 'desc', capacity: 2 }),
    });
    assert(normalAddRoom.status === 403, 'Normal user POST /api/admin/resorts/:id/rooms returns 403 Forbidden');

    console.log('\n--- 3. Testing Registration Security (Cannot spoof role) ---');
    const spoofEmail = `spoof_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spoof Attacker',
        email: spoofEmail,
        password: 'Password123!',
        role: 'admin', // Maliciously sending role: 'admin'
      }),
    });
    const regData = await regRes.json();
    const spoofUserInDB = await User.findOne({ email: spoofEmail });
    assert(spoofUserInDB?.role === 'user', 'Public registration ignores role parameter and defaults to "user"');
    if (spoofUserInDB) await User.deleteOne({ _id: spoofUserInDB._id });

    console.log('\n--- 4. Testing Admin User Access & Room Operations ---');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) throw new Error('Admin user not found in database.');

    const adminToken = signToken(adminUser);
    const adminHeaders = {
      Cookie: `resorthub_jwt=${adminToken}`,
      'Content-Type': 'application/json',
    };

    // 4.1 Admin dashboard stats
    const adminDashboard = await fetch(`${baseUrl}/admin/dashboard`, { headers: adminHeaders });
    assert(adminDashboard.status === 200, 'Admin user GET /api/admin/dashboard returns 200 OK');
    const stats = await adminDashboard.json();
    assert(stats?.data?.totalResorts > 0, `Stats returns totalResorts (${stats?.data?.totalResorts})`);

    // 4.2 Admin get rooms
    const adminRooms = await fetch(`${baseUrl}/admin/rooms`, { headers: adminHeaders });
    assert(adminRooms.status === 200, 'Admin user GET /api/admin/rooms returns 200 OK');

    // 4.3 Admin add room
    const testRoomName = `Automated Test Suite ${Date.now()}`;
    const addRes = await fetch(`${baseUrl}/admin/resorts/${resort._id}/rooms`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: testRoomName,
        description: 'Spectacular automated test suite with sea views',
        capacity: 3,
        pricePerNight: 9999,
        amenities: ['Wi-Fi', 'Private Pool'],
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      }),
    });
    assert(addRes.status === 201, 'Admin POST /api/admin/resorts/:id/rooms returns 201 Created');
    const addData = await addRes.json();
    const createdRoom = addData?.data?.room;
    assert(createdRoom && createdRoom.name === testRoomName, 'New room created with expected name');

    // 4.4 Admin update room
    const updateRes = await fetch(`${baseUrl}/admin/resorts/${resort._id}/rooms/${createdRoom._id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        name: `${testRoomName} - Updated`,
        description: 'Updated description',
        capacity: 4,
        pricePerNight: 12000,
        amenities: ['Wi-Fi', 'Private Pool', 'Breakfast'],
      }),
    });
    assert(updateRes.status === 200, 'Admin PUT /api/admin/resorts/:id/rooms/:roomId returns 200 OK');
    const updateData = await updateRes.json();
    assert(updateData?.data?.room?.capacity === 4, 'Room updated capacity to 4');

    // 4.5 Admin delete room
    const deleteRes = await fetch(`${baseUrl}/admin/resorts/${resort._id}/rooms/${createdRoom._id}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(deleteRes.status === 200, 'Admin DELETE /api/admin/resorts/:id/rooms/:roomId returns 200 OK');

    // Verify room is actually gone from DB
    const refreshedResort = await Resort.findById(resort._id);
    const deletedExists = refreshedResort.rooms.id(createdRoom._id);
    assert(!deletedExists, 'Room was verified deleted from Resort subdocuments in MongoDB');

    // Clean up test normal user
    await User.deleteOne({ email: normalEmail });

    console.log(`\n===============================================`);
    if (failures === 0) {
      console.log('  🎉 ALL SECURITY AND CRUD TESTS PASSED!');
    } else {
      console.error(`  ⚠️ ${failures} test(s) failed.`);
    }
    console.log(`===============================================\n`);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(failures === 0 ? 0 : 1);
  }
};

runTests();
