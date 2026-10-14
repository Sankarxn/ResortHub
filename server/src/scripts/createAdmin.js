import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { hashPassword } from '../config/security.js';

/**
 * Safe, one-time administrator account creation/promotion script.
 * Usage:
 *   ADMIN_NAME="Admin" ADMIN_EMAIL="admin@resorthub.com" ADMIN_PASSWORD="YourSecurePassword123!" node src/scripts/createAdmin.js
 * Or pass via command line arguments:
 *   node src/scripts/createAdmin.js <email> <password> <name>
 */
const createOrPromoteAdmin = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ Error: MONGODB_URI is not defined in your environment (.env).');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || 'sankaran@admin.com').trim().toLowerCase();
  const password = args[1] || process.env.ADMIN_PASSWORD || 'Sankaran@123';
  const name = args[2] || process.env.ADMIN_NAME || 'Sankaran (Administrator)';

  if (!email || !password) {
    console.error('❌ Error: Admin email and password must be provided.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);

    let user = await User.findOne({ email });

    if (user) {
      console.log(`User ${email} already exists. Promoting to admin role...`);
      user.role = 'admin';
      if (password) {
        user.passwordHash = await hashPassword(password);
      }
      await user.save();
      console.log(`✅ User ${email} has been promoted to administrator!`);
    } else {
      console.log(`Creating new administrator account for ${email}...`);
      const passwordHash = await hashPassword(password);
      user = await User.create({
        name,
        email,
        passwordHash,
        role: 'admin',
      });
      console.log(`✅ Administrator account created successfully for ${email}!`);
    }

    console.log('===============================================');
    console.log('  Admin Credentials:');
    console.log(`  Email:    ${user.email}`);
    console.log(`  Role:     ${user.role}`);
    console.log('===============================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create/promote admin user:', error.message);
    process.exit(1);
  }
};

createOrPromoteAdmin();
