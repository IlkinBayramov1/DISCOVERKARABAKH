import { userRepository } from './user.repository.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js';

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

export const topupWallet = async (req, res, next) => {
  try {
    const { amount, cardNumber } = req.body;
    const parseFloatAmount = parseFloat(amount);
    if (!amount || isNaN(parseFloatAmount) || parseFloatAmount <= 0) {
      throw ApiError.badRequest('Invalid deposit amount');
    }

    const maskedCard = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : null;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: req.user.id }
      });
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: {
          balance: {
            increment: parseFloatAmount
          }
        }
      });

      await tx.wallettransaction.create({
        data: {
          userId: req.user.id,
          amount: parseFloatAmount,
          type: 'deposit',
          status: 'COMPLETED',
          description: 'Top Up via Card',
          cardNumber: maskedCard
        }
      });

      return { updatedUser };
    });

    const { password, ...safeUser } = result.updatedUser;

    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
      data: safeUser
    });
  } catch (error) {
    next(error);
  }
};

export const getWalletTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    let whereClause = { userId: req.user.id };
    if (type === 'in') {
      whereClause.type = { in: ['deposit', 'refund'] };
    } else if (type === 'out') {
      whereClause.type = { in: ['withdrawal', 'payment'] };
    }

    const [transactions, total] = await prisma.$transaction([
      prisma.wallettransaction.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.wallettransaction.count({
        where: whereClause,
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawWallet = async (req, res, next) => {
  try {
    const { amount, withdrawalMethod, cardNumber, bankAccount } = req.body;
    const parseFloatAmount = parseFloat(amount);
    if (!amount || isNaN(parseFloatAmount) || parseFloatAmount <= 0) {
      throw ApiError.badRequest('Invalid withdrawal amount');
    }

    if (!withdrawalMethod || !['bank_card', 'bank_transfer', 'cash'].includes(withdrawalMethod)) {
      throw ApiError.badRequest('Invalid withdrawal method');
    }

    if (withdrawalMethod === 'bank_card' && !cardNumber) {
      throw ApiError.badRequest('Card number is required for card withdrawal');
    }

    if (withdrawalMethod === 'bank_transfer' && !bankAccount) {
      throw ApiError.badRequest('Bank account/IBAN is required for bank transfer');
    }

    const maskedCard = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : null;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      if (user.balance < parseFloatAmount) {
        throw ApiError.badRequest('Kifayət qədər balans yoxdur.');
      }

      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: {
          balance: {
            decrement: parseFloatAmount
          }
        }
      });

      await tx.wallettransaction.create({
        data: {
          userId: req.user.id,
          amount: parseFloatAmount,
          type: 'withdrawal',
          status: 'PENDING',
          description: `Withdrawal via ${withdrawalMethod === 'bank_card' ? 'Bank Card' : withdrawalMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash Pickup'}`,
          withdrawalMethod,
          cardNumber: maskedCard,
          bankAccount
        }
      });

      return { updatedUser };
    });

    const { password, ...safeUser } = result.updatedUser;

    res.status(200).json({
      success: true,
      message: 'Vəsait çıxarılması sorğusu qəbul edildi. Hazırda gözləmədədir.',
      data: safeUser
    });
  } catch (error) {
    next(error);
  }
};
