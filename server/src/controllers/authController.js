import User from '../models/User.js';

// Sync Clerk user with MongoDB
export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, name, profileImage } = req.body;

    if (!clerkId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.email = email;
      user.name = name;
      if (profileImage) user.profileImage = profileImage;
      await user.save();
    } else {
      // Create new user - handle duplicate key error
      try {
        user = await User.create({
          clerkId,
          email,
          name,
          profileImage: profileImage || '',
          role: 'student',
        });
      } catch (createError) {
        // If duplicate key error, try to find the user again
        if (createError.code === 11000) {
          user = await User.findOne({ clerkId });
          if (user) {
            // Update existing user
            user.email = email;
            user.name = name;
            if (profileImage) user.profileImage = profileImage;
            await user.save();
          } else {
            throw createError;
          }
        } else {
          throw createError;
        }
      }
    }

    res.json({ user });
  } catch (error) {
    console.error('Sync user error:', error);
    // If it's a duplicate key error, try to return the existing user
    if (error.code === 11000) {
      try {
        const { clerkId } = req.body;
        const user = await User.findOne({ clerkId });
        if (user) {
          return res.json({ user });
        }
      } catch (findError) {
        // Ignore find error
      }
    }
    res.status(500).json({ error: 'Failed to sync user' });
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId })
      .populate('enrolledCourses', 'title thumbnail examType price');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Webhook handler for Clerk events
export const webhookHandler = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = data;

      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim() || email;

      let user = await User.findOne({ clerkId: id });

      if (user) {
        user.email = email;
        user.name = name;
        if (image_url) user.profileImage = image_url;
        await user.save();
      } else {
        await User.create({
          clerkId: id,
          email,
          name,
          profileImage: image_url || '',
          role: 'student',
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};



