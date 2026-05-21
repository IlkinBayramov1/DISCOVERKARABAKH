import prisma from '../../config/db.js';

class UserRepository {
  async create(data) {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        vendorprofile: true, // Needed for auth routing based on category
      }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        vendorprofile: true,
        touristprofile: true,
        residentprofile: true,
        driverprofile_driverprofile_userIdTouser: true
      }
    });
  }

  async updateProfile(id, userData, profileData) {
    const user = await this.findById(id);
    if (!user) return null;

    let profileUpdate = {};
    if (user.role === 'tourist' && profileData) {
      // Pick only TouristProfile fields
      const { nationality, passportNumber, interests, emergencyContact } = profileData;
      profileUpdate = { 
        touristprofile: { 
          update: { nationality, passportNumber, interests, emergencyContact } 
        } 
      };
    } else if (user.role === 'resident' && profileData) {
      // Pick only ResidentProfile fields
      const { permitNumber, localAddress, familyMembers } = profileData;
      profileUpdate = { 
        residentprofile: { 
          update: { permitNumber, localAddress, familyMembers } 
        } 
      };
    } else if (user.role === 'vendor' && profileData) {
      // Pick only VendorProfile fields
      const { companyName, category } = profileData;
      profileUpdate = { 
        vendorprofile: { 
          update: { companyName, category } 
        } 
      };
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...profileUpdate
      },
      include: {
        vendorprofile: true,
        touristprofile: true,
        residentprofile: true
      }
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
