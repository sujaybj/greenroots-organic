const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice rating');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone'];
    const updates = {};
    allowedFields.forEach(field => { if (req.body[field]) updates[field] = req.body[field]; });

    if (req.file) {
      if (req.user.avatarPublicId) await cloudinary.uploader.destroy(req.user.avatarPublicId);
      updates.avatar = req.file.path;
      updates.avatarPublicId = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (user.googleId && !user.password) {
      return res.status(400).json({ success: false, message: 'Google accounts cannot change password here' });
    }
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    if (user.addresses.length === 0) req.body.isDefault = true;
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    Object.assign(addr, req.body);
    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;
    const idx = user.wishlist.findIndex(id => id.toString() === productId);

    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice rating');
    res.status(200).json({ success: true, wishlist: updatedUser.wishlist, added: idx === -1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
