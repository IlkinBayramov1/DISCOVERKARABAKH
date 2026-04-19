import { userRepository } from './user.repository.js';
import { ApiError } from '../../core/api.error.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const { password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { 
      firstName, lastName, phone, gender, birthDate, language, avatarUrl,
      // Nested profile data
      nationality, passportNumber, interests, emergencyContact,
      permitNumber, localAddress, familyMembers,
      companyName, category
    } = req.body;

    // Separate core User data
    const userData = {
      firstName, lastName, phone, gender, 
      birthDate: (birthDate && birthDate !== "") ? new Date(birthDate) : (birthDate === "" ? null : undefined), 
      language, avatarUrl
    };

    // Filter out undefined fields from userData
    Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

    // Construct profile data based on role (handled by repository based on user role)
    const profileData = {
      nationality, passportNumber, interests, emergencyContact,
      permitNumber, localAddress, familyMembers,
      companyName, category
    };
    
    // Filter out undefined fields from profileData
    Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);

    const user = await userRepository.updateProfile(req.user.id, userData, profileData);

    const { password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
