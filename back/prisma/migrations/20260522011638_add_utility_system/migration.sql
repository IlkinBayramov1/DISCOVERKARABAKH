-- CreateTable
CREATE TABLE `amenity` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,

    UNIQUE INDEX `Amenity_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attraction` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `entryType` VARCHAR(191) NOT NULL DEFAULT 'free',
    `price` DOUBLE NULL,
    `crowdLevel` VARCHAR(191) NOT NULL DEFAULT 'low',
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `vendorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `city` VARCHAR(191) NULL,
    `audioUrl` VARCHAR(191) NULL,
    `searchKeywords` TEXT NULL,
    `virtualTourUrl` VARCHAR(191) NULL,
    `category` ENUM('Muzey', 'Park', 'Tarixi_Mekan', 'Tebiet_Abidesi', 'Memorial_Kompleks', 'Idman_Eylence') NOT NULL DEFAULT 'Muzey',
    `googleMapsUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `Attraction_slug_key`(`slug`),
    INDEX `Attraction_category_status_isFeatured_idx`(`category`, `status`, `isFeatured`),
    INDEX `Attraction_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `Attraction_vendorId_fkey`(`vendorId`),
    FULLTEXT INDEX `Attraction_name_description_searchKeywords_idx`(`name`, `description`, `searchKeywords`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractionfavorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `attractionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AttractionFavorite_attractionId_fkey`(`attractionId`),
    UNIQUE INDEX `AttractionFavorite_userId_attractionId_key`(`userId`, `attractionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractionhourlystat` (
    `attractionId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `hour` INTEGER NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`attractionId`, `date`, `hour`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractionimage` (
    `id` VARCHAR(191) NOT NULL,
    `attractionId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'image',
    `isCover` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `AttractionImage_attractionId_fkey`(`attractionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractionreview` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `attractionId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'approved',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `images` LONGTEXT NULL,
    `vendorReply` TEXT NULL,

    INDEX `AttractionReview_attractionId_fkey`(`attractionId`),
    UNIQUE INDEX `AttractionReview_userId_attractionId_key`(`userId`, `attractionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractionstat` (
    `attractionId` VARCHAR(191) NOT NULL,
    `averageRating` DOUBLE NOT NULL DEFAULT 0,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `favoriteCount` INTEGER NOT NULL DEFAULT 0,
    `popularityScore` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`attractionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractionworkinghour` (
    `id` VARCHAR(191) NOT NULL,
    `attractionId` VARCHAR(191) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `openTime` VARCHAR(191) NULL,
    `closeTime` VARCHAR(191) NULL,
    `isClosed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `AttractionWorkingHour_attractionId_dayOfWeek_key`(`attractionId`, `dayOfWeek`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blacklist` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Blacklist_value_key`(`value`),
    INDEX `Blacklist_value_idx`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `id` VARCHAR(191) NOT NULL,
    `bookingNumber` VARCHAR(191) NOT NULL,
    `bookingType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'initiated',
    `totalPrice` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'AZN',
    `paymentMethod` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `specialRequests` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hotelId` VARCHAR(191) NULL,
    `tourId` VARCHAR(191) NULL,
    `eventId` VARCHAR(191) NULL,
    `attractionId` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NULL,

    UNIQUE INDEX `Booking_bookingNumber_key`(`bookingNumber`),
    INDEX `Booking_attractionId_fkey`(`attractionId`),
    INDEX `Booking_bookingType_entityId_idx`(`bookingType`, `entityId`),
    INDEX `Booking_eventId_fkey`(`eventId`),
    INDEX `Booking_hotelId_fkey`(`hotelId`),
    INDEX `Booking_tourId_fkey`(`tourId`),
    INDEX `Booking_userId_idx`(`userId`),
    INDEX `Booking_vehicleId_fkey`(`vehicleId`),
    INDEX `Booking_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookingauditlog` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `meta` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BookingAuditLog_bookingId_fkey`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookingitem` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `roomTypeId` VARCHAR(191) NULL,
    `ratePlanId` VARCHAR(191) NULL,
    `checkIn` DATETIME(3) NULL,
    `checkOut` DATETIME(3) NULL,
    `adults` INTEGER NOT NULL DEFAULT 1,
    `children` INTEGER NOT NULL DEFAULT 0,
    `price` DOUBLE NOT NULL,
    `nightlyBreakdown` LONGTEXT NULL,

    INDEX `BookingItem_bookingId_fkey`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cancellationpolicy` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `freeCancellationUntilHours` INTEGER NULL,
    `penaltyType` VARCHAR(191) NOT NULL,
    `penaltyValue` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cargovehicle` (
    `id` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `licensePlate` VARCHAR(191) NOT NULL,
    `cargoType` ENUM('Box', 'Refrigerated', 'Flatbed', 'Liquid') NOT NULL DEFAULT 'Box',
    `maxWeightKg` DOUBLE NOT NULL,
    `maxVolumeM3` DOUBLE NOT NULL,
    `isRefrigerated` BOOLEAN NOT NULL DEFAULT false,
    `temperatureRangeMin` DOUBLE NULL,
    `temperatureRangeMax` DOUBLE NULL,
    `insuranceValidUntil` DATETIME(3) NULL,
    `status` ENUM('Available', 'Reserved', 'Maintenance') NOT NULL DEFAULT 'Available',
    `currentLoadWeight` DOUBLE NOT NULL DEFAULT 0,
    `currentLoadVolume` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CargoVehicle_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuisine` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Cuisine_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailypricing` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'AZN',
    `minStay` INTEGER NOT NULL DEFAULT 1,
    `maxStay` INTEGER NULL,
    `closedToArrival` BOOLEAN NOT NULL DEFAULT false,
    `closedToDeparture` BOOLEAN NOT NULL DEFAULT false,
    `roomTypeId` VARCHAR(191) NOT NULL,
    `isStopped` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `DailyPricing_roomTypeId_date_key`(`roomTypeId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drivercapability` (
    `id` VARCHAR(191) NOT NULL,
    `driverProfileId` VARCHAR(191) NOT NULL,
    `capability` ENUM('PASSENGER', 'CARGO_LIGHT', 'CARGO_HEAVY', 'HAZARDOUS', 'REFRIGERATED') NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `certificationNumber` VARCHAR(191) NULL,
    `issuingAuthority` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DriverCapability_driverProfileId_capability_key`(`driverProfileId`, `capability`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `driverprofile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `managedById` VARCHAR(191) NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected', 'Online', 'Offline', 'Busy') NOT NULL DEFAULT 'Pending',
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `licenseNumber` VARCHAR(191) NULL,
    `licenseImages` LONGTEXT NULL,
    `idCardImages` LONGTEXT NULL,
    `currentLocation` LONGTEXT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 5,
    `totalRides` INTEGER NOT NULL DEFAULT 0,
    `currentVehicleId` VARCHAR(191) NULL,
    `currentCargoVehicleId` VARCHAR(191) NULL,

    UNIQUE INDEX `DriverProfile_userId_key`(`userId`),
    UNIQUE INDEX `DriverProfile_currentVehicleId_key`(`currentVehicleId`),
    UNIQUE INDEX `DriverProfile_currentCargoVehicleId_key`(`currentCargoVehicleId`),
    INDEX `DriverProfile_managedById_fkey`(`managedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 0,
    `ticketPrice` DOUBLE NOT NULL DEFAULT 0,
    `soldCount` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('active', 'cancelled', 'completed') NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Event_vendorId_fkey`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guest` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    INDEX `Guest_bookingId_fkey`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `starRating` INTEGER NULL,
    `propertyType` VARCHAR(191) NOT NULL DEFAULT 'hotel',
    `checkInTime` VARCHAR(191) NULL,
    `checkOutTime` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `policies` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `featuredUntil` DATETIME(3) NULL,
    `featuredPriority` INTEGER NOT NULL DEFAULT 0,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `city` VARCHAR(191) NULL,
    `cancellationPolicy` TEXT NULL,
    `childPolicy` TEXT NULL,
    `petPolicy` TEXT NULL,

    UNIQUE INDEX `Hotel_slug_key`(`slug`),
    INDEX `Hotel_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `Hotel_ownerId_idx`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotelamenity` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `amenityId` VARCHAR(191) NOT NULL,

    INDEX `HotelAmenity_amenityId_fkey`(`amenityId`),
    UNIQUE INDEX `HotelAmenity_hotelId_amenityId_key`(`hotelId`, `amenityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotelcalendarnote` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `note` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'info',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HotelCalendarNote_hotelId_date_key`(`hotelId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoteldailystat` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `impressions` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `totalBookings` INTEGER NOT NULL DEFAULT 0,
    `totalRevenue` DOUBLE NOT NULL DEFAULT 0,
    `conversionRate` DOUBLE NOT NULL DEFAULT 0,
    `cancellationRate` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `HotelDailyStat_hotelId_date_key`(`hotelId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotelfavorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HotelFavorite_hotelId_fkey`(`hotelId`),
    UNIQUE INDEX `HotelFavorite_userId_hotelId_key`(`userId`, `hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotelimage` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `HotelImage_hotelId_fkey`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotelpoi` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `attractionId` VARCHAR(191) NOT NULL,
    `distance` DOUBLE NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `HotelPOI_attractionId_fkey`(`attractionId`),
    UNIQUE INDEX `HotelPOI_hotelId_attractionId_key`(`hotelId`, `attractionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotelsearchsnapshot` (
    `hotelId` VARCHAR(191) NOT NULL,
    `minPrice` DOUBLE NOT NULL,
    `reviewScore` DOUBLE NOT NULL,
    `availableToday` BOOLEAN NOT NULL,
    `popularity` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`hotelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventorylock` (
    `id` VARCHAR(191) NOT NULL,
    `roomTypeId` VARCHAR(191) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `userId` VARCHAR(191) NOT NULL DEFAULT 'anonymous',
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InventoryLock_expiresAt_idx`(`expiresAt`),
    INDEX `InventoryLock_roomTypeId_startDate_endDate_idx`(`roomTypeId`, `startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investorprofile` (
    `id` VARCHAR(191) NOT NULL,
    `investmentFocus` LONGTEXT NULL,
    `budgetRange` LONGTEXT NULL,
    `companyName` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `InvestorProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `popularity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `address` VARCHAR(255) NULL,
    `googleMapsUrl` TEXT NULL,
    `vendorId` VARCHAR(191) NULL,

    INDEX `Location_vendorId_fkey`(`vendorId`),
    FULLTEXT INDEX `Location_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menucategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `MenuCategory_restaurantId_fkey`(`restaurantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menuitem` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MenuItem_categoryId_fkey`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menuitemoption` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `choices` LONGTEXT NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `maxSelect` INTEGER NOT NULL DEFAULT 1,

    INDEX `MenuItemOption_itemId_fkey`(`itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymenttransaction` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerTransId` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'AZN',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `paymentUrl` TEXT NULL,
    `callbackUrl` TEXT NULL,
    `errorMessage` TEXT NULL,
    `rawResponse` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PaymentTransaction_providerTransId_key`(`providerTransId`),
    INDEX `PaymentTransaction_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricingrule` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `roomTypeId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL,
    `adjustment` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `daysOfWeek` VARCHAR(191) NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `occupancyThreshold` DOUBLE NULL,

    INDEX `PricingRule_hotelId_roomTypeId_idx`(`hotelId`, `roomTypeId`),
    INDEX `PricingRule_roomTypeId_fkey`(`roomTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promocode` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `minOrderValue` DOUBLE NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NOT NULL,
    `usageLimit` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `isStackable` BOOLEAN NOT NULL DEFAULT false,
    `maxDiscountAmount` DOUBLE NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `PromoCode_code_key`(`code`),
    INDEX `PromoCode_restaurantId_fkey`(`restaurantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotion` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validTo` DATETIME(3) NOT NULL,
    `minStay` INTEGER NULL,
    `mobileOnly` BOOLEAN NOT NULL DEFAULT false,
    `geniusOnly` BOOLEAN NOT NULL DEFAULT false,
    `hotelId` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `maxUses` INTEGER NOT NULL DEFAULT 0,
    `minBookingValue` DOUBLE NOT NULL DEFAULT 0,
    `usedCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Promotion_code_key`(`code`),
    INDEX `Promotion_hotelId_fkey`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rateplan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `mealPlan` VARCHAR(191) NOT NULL DEFAULT 'RO',
    `isRefundable` BOOLEAN NOT NULL DEFAULT true,
    `prepaymentRequired` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `roomTypeId` VARCHAR(191) NOT NULL,
    `cancellationPolicyId` VARCHAR(191) NULL,

    INDEX `RatePlan_cancellationPolicyId_fkey`(`cancellationPolicyId`),
    INDEX `RatePlan_roomTypeId_fkey`(`roomTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `residentprofile` (
    `id` VARCHAR(191) NOT NULL,
    `permitNumber` VARCHAR(191) NULL,
    `localAddress` VARCHAR(191) NULL,
    `familyMembers` LONGTEXT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ResidentProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `priceRange` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `workingHours` LONGTEXT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `featuredUntil` DATETIME(3) NULL,
    `featuredPriority` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `vendorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `city` VARCHAR(191) NULL,

    UNIQUE INDEX `Restaurant_slug_key`(`slug`),
    INDEX `Restaurant_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `Restaurant_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurantcuisine` (
    `restaurantId` VARCHAR(191) NOT NULL,
    `cuisineId` VARCHAR(191) NOT NULL,

    INDEX `RestaurantCuisine_cuisineId_fkey`(`cuisineId`),
    PRIMARY KEY (`restaurantId`, `cuisineId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurantdailystat` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `totalOrders` INTEGER NOT NULL DEFAULT 0,
    `totalRevenue` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `RestaurantDailyStat_restaurantId_date_key`(`restaurantId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `cleanlinessScore` DOUBLE NULL,
    `locationScore` DOUBLE NULL,
    `staffScore` DOUBLE NULL,
    `comment` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NULL,
    `tourId` VARCHAR(191) NULL,
    `eventId` VARCHAR(191) NULL,
    `restaurantId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `attractionId` VARCHAR(191) NULL,
    `vendorReply` TEXT NULL,

    INDEX `Review_attractionId_fkey`(`attractionId`),
    INDEX `Review_eventId_fkey`(`eventId`),
    INDEX `Review_hotelId_fkey`(`hotelId`),
    INDEX `Review_restaurantId_userId_idx`(`restaurantId`, `userId`),
    INDEX `Review_tourId_fkey`(`tourId`),
    UNIQUE INDEX `Review_userId_attractionId_key`(`userId`, `attractionId`),
    UNIQUE INDEX `Review_userId_eventId_key`(`userId`, `eventId`),
    UNIQUE INDEX `Review_userId_hotelId_key`(`userId`, `hotelId`),
    UNIQUE INDEX `Review_userId_tourId_key`(`userId`, `tourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviewreport` (
    `id` VARCHAR(191) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `reviewType` VARCHAR(191) NOT NULL DEFAULT 'attraction',
    `reporterId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `customNote` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReviewReport_reporterId_fkey`(`reporterId`),
    INDEX `ReviewReport_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ride` (
    `id` VARCHAR(191) NOT NULL,
    `passengerId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NULL,
    `status` ENUM('Pending', 'DriverAssigned', 'OnWayToPickup', 'ArrivedAtPickup', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `pickupLocation` LONGTEXT NOT NULL,
    `dropoffLocation` LONGTEXT NOT NULL,
    `price` DOUBLE NULL,
    `distanceKm` DOUBLE NULL,
    `durationMin` DOUBLE NULL,
    `pricingRuleId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `waypoints` LONGTEXT NULL,
    `bookingNumber` VARCHAR(191) NULL,
    `scheduledAt` DATETIME(3) NULL,
    `paxCount` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Ride_bookingNumber_key`(`bookingNumber`),
    INDEX `Ride_driverId_fkey`(`driverId`),
    INDEX `Ride_passengerId_fkey`(`passengerId`),
    INDEX `Ride_pricingRuleId_fkey`(`pricingRuleId`),
    INDEX `Ride_vehicleId_fkey`(`vehicleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ridepricing` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('Fixed', 'PerKm', 'Hourly') NOT NULL,
    `basePrice` DOUBLE NOT NULL,
    `pricePerKm` DOUBLE NULL,
    `pricePerMin` DOUBLE NULL,
    `minPrice` DOUBLE NULL,
    `config` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room` (
    `id` VARCHAR(191) NOT NULL,
    `roomNumber` VARCHAR(191) NOT NULL,
    `floor` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'AVAILABLE',
    `roomTypeId` VARCHAR(191) NOT NULL,
    `housekeepingNote` TEXT NULL,
    `lastCleanedAt` DATETIME(3) NULL,

    INDEX `Room_roomTypeId_fkey`(`roomTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roomamenity` (
    `id` VARCHAR(191) NOT NULL,
    `roomTypeId` VARCHAR(191) NOT NULL,
    `amenityName` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'General',

    INDEX `RoomAmenity_roomTypeId_fkey`(`roomTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roomavailability` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `totalRooms` INTEGER NOT NULL,
    `reservedRooms` INTEGER NOT NULL DEFAULT 0,
    `availableRooms` INTEGER NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `roomTypeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RoomAvailability_roomTypeId_date_key`(`roomTypeId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roomimage` (
    `id` VARCHAR(191) NOT NULL,
    `roomTypeId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `RoomImage_roomTypeId_fkey`(`roomTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roomreview` (
    `id` VARCHAR(191) NOT NULL,
    `roomTypeId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `vendorReply` TEXT NULL,

    INDEX `RoomReview_roomTypeId_fkey`(`roomTypeId`),
    INDEX `RoomReview_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roomtype` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `maxAdults` INTEGER NOT NULL DEFAULT 2,
    `maxChildren` INTEGER NOT NULL DEFAULT 0,
    `baseOccupancy` INTEGER NOT NULL DEFAULT 2,
    `bedType` VARCHAR(191) NULL,
    `roomSizeM2` INTEGER NULL,
    `totalInventory` INTEGER NOT NULL DEFAULT 1,
    `overbookingLimit` INTEGER NOT NULL DEFAULT 0,
    `hotelId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `basePrice` DOUBLE NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Standard',

    INDEX `RoomType_hotelId_fkey`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipment` (
    `id` VARCHAR(191) NOT NULL,
    `idempotencyKey` VARCHAR(191) NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NULL,
    `cargoVehicleId` VARCHAR(191) NULL,
    `status` ENUM('Pending', 'DriverAssigned', 'VehicleArrived', 'PickedUp', 'InTransit', 'AtDropoff', 'Delivered', 'Completed', 'Cancelled', 'Failed') NOT NULL DEFAULT 'Pending',
    `pickupLocation` LONGTEXT NOT NULL,
    `dropoffLocation` LONGTEXT NOT NULL,
    `weightKg` DOUBLE NOT NULL,
    `volumeM3` DOUBLE NULL,
    `dimensions` LONGTEXT NULL,
    `cargoDescription` TEXT NULL,
    `isHazardous` BOOLEAN NOT NULL DEFAULT false,
    `requiresRefrigeration` BOOLEAN NOT NULL DEFAULT false,
    `declaredValue` DOUBLE NULL,
    `deliveredByDriverId` VARCHAR(191) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `estimatedDeliveryTime` DATETIME(3) NULL,
    `actualDeliveryTime` DATETIME(3) NULL,
    `proofOfDeliveryImages` LONGTEXT NULL,
    `signatureUrl` VARCHAR(191) NULL,
    `customerConfirmationUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `waypoints` LONGTEXT NULL,

    UNIQUE INDEX `Shipment_idempotencyKey_key`(`idempotencyKey`),
    INDEX `Shipment_cargoVehicleId_fkey`(`cargoVehicleId`),
    INDEX `Shipment_driverId_fkey`(`driverId`),
    INDEX `Shipment_senderId_fkey`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipmentpricing` (
    `id` VARCHAR(191) NOT NULL,
    `shipmentId` VARCHAR(191) NOT NULL,
    `basePrice` DOUBLE NOT NULL DEFAULT 0,
    `distanceFee` DOUBLE NOT NULL DEFAULT 0,
    `weightFee` DOUBLE NOT NULL DEFAULT 0,
    `insuranceFee` DOUBLE NOT NULL DEFAULT 0,
    `urgencyFee` DOUBLE NOT NULL DEFAULT 0,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `totalPrice` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ShipmentPricing_shipmentId_key`(`shipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taxrule` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `hotelId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` ENUM('pending', 'active', 'cancelled', 'used') NOT NULL DEFAULT 'pending',
    `paymentId` VARCHAR(191) NULL,
    `qrCode` VARCHAR(191) NULL,
    `purchasedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ticket_paymentId_key`(`paymentId`),
    UNIQUE INDEX `Ticket_qrCode_key`(`qrCode`),
    INDEX `Ticket_eventId_fkey`(`eventId`),
    INDEX `Ticket_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tour` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `images` LONGTEXT NULL,
    `durationDays` INTEGER NOT NULL,
    `durationNights` INTEGER NOT NULL,
    `difficulty` ENUM('Easy', 'Medium', 'Hard', 'Extreme') NOT NULL DEFAULT 'Medium',
    `groupSizeMin` INTEGER NOT NULL DEFAULT 1,
    `groupSizeMax` INTEGER NOT NULL,
    `pricePerPerson` DOUBLE NOT NULL,
    `itinerary` LONGTEXT NULL,
    `inclusions` LONGTEXT NULL,
    `exclusions` LONGTEXT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `city` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `availableSlots` INTEGER NULL,
    `meetingPoint` TEXT NULL,
    `mapLink` TEXT NULL,
    `meetingAddress` TEXT NULL,
    `destinationLink` TEXT NULL,

    INDEX `Tour_ownerId_fkey`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `touravailability` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `maxSeats` INTEGER NULL,
    `isStopped` BOOLEAN NOT NULL DEFAULT false,
    `priceOverride` DOUBLE NULL,
    `tourId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TourAvailability_tourId_date_key`(`tourId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tourcalendarnote` (
    `id` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `note` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'info',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TourCalendarNote_tourId_date_key`(`tourId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tourfavorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TourFavorite_tourId_fkey`(`tourId`),
    UNIQUE INDEX `TourFavorite_userId_tourId_key`(`userId`, `tourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `touristprofile` (
    `id` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NULL,
    `passportNumber` VARCHAR(191) NULL,
    `interests` LONGTEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `emergencyContact` LONGTEXT NULL,

    UNIQUE INDEX `TouristProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'vendor', 'tourist', 'resident', 'investor', 'admin', 'driver') NOT NULL DEFAULT 'user',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isBanned` BOOLEAN NOT NULL DEFAULT false,
    `isTransportBanned` BOOLEAN NOT NULL DEFAULT false,
    `isApproved` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `firstName` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL DEFAULT 'AZ',
    `lastName` VARCHAR(191) NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `category` ENUM('Economy', 'Business', 'Premium', 'Minivan', 'Bus') NOT NULL,
    `seats` INTEGER NOT NULL,
    `luggage` INTEGER NOT NULL,
    `description` TEXT NULL,
    `images` LONGTEXT NULL,
    `status` ENUM('Active', 'Inactive', 'Maintenance') NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `basePrice` DOUBLE NULL,
    `pricePerKm` DOUBLE NULL,

    INDEX `Vehicle_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehiclefavorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VehicleFavorite_vehicleId_fkey`(`vehicleId`),
    UNIQUE INDEX `VehicleFavorite_userId_vehicleId_key`(`userId`, `vehicleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendorprofile` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VendorProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,

    INDEX `Wishlist_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilityabonent` (
    `id` VARCHAR(191) NOT NULL,
    `abonentCode` VARCHAR(191) NOT NULL,
    `residentName` VARCHAR(191) NOT NULL,
    `localAddress` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `utilityabonent_abonentCode_key`(`abonentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilitybill` (
    `id` VARCHAR(191) NOT NULL,
    `abonentCode` VARCHAR(191) NOT NULL,
    `utilityType` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `dueDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'unpaid',
    `billingMonth` VARCHAR(191) NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `utilitybill_batchId_idx`(`batchId`),
    UNIQUE INDEX `utilitybill_abonentCode_utilityType_billingMonth_key`(`abonentCode`, `utilityType`, `billingMonth`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilitypayment` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `totalAmount` DOUBLE NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `paymentMethod` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `utilitypayment_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilitypaymentitem` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `billId` VARCHAR(191) NOT NULL,
    `amountPaid` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `utilitypaymentitem_paymentId_idx`(`paymentId`),
    INDEX `utilitypaymentitem_billId_idx`(`billId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilityuploadlog` (
    `id` VARCHAR(191) NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `rowCount` INTEGER NOT NULL,
    `successCount` INTEGER NOT NULL,
    `errorCount` INTEGER NOT NULL,
    `uploadedByAdminId` VARCHAR(191) NOT NULL,
    `isRolledBack` BOOLEAN NOT NULL DEFAULT false,
    `rolledBackAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `utilityuploadlog_batchId_key`(`batchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attraction` ADD CONSTRAINT `Attraction_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionfavorite` ADD CONSTRAINT `AttractionFavorite_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionfavorite` ADD CONSTRAINT `AttractionFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionhourlystat` ADD CONSTRAINT `AttractionHourlyStat_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionimage` ADD CONSTRAINT `AttractionImage_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionreview` ADD CONSTRAINT `AttractionReview_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionreview` ADD CONSTRAINT `AttractionReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionstat` ADD CONSTRAINT `AttractionStat_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractionworkinghour` ADD CONSTRAINT `AttractionWorkingHour_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `Booking_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `Booking_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `Booking_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `Booking_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `Booking_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookingauditlog` ADD CONSTRAINT `BookingAuditLog_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookingitem` ADD CONSTRAINT `BookingItem_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cargovehicle` ADD CONSTRAINT `CargoVehicle_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dailypricing` ADD CONSTRAINT `DailyPricing_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drivercapability` ADD CONSTRAINT `DriverCapability_driverProfileId_fkey` FOREIGN KEY (`driverProfileId`) REFERENCES `driverprofile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `driverprofile` ADD CONSTRAINT `DriverProfile_currentCargoVehicleId_fkey` FOREIGN KEY (`currentCargoVehicleId`) REFERENCES `cargovehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `driverprofile` ADD CONSTRAINT `DriverProfile_currentVehicleId_fkey` FOREIGN KEY (`currentVehicleId`) REFERENCES `vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `driverprofile` ADD CONSTRAINT `DriverProfile_managedById_fkey` FOREIGN KEY (`managedById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `driverprofile` ADD CONSTRAINT `DriverProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `Event_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guest` ADD CONSTRAINT `Guest_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel` ADD CONSTRAINT `Hotel_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelamenity` ADD CONSTRAINT `HotelAmenity_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `amenity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelamenity` ADD CONSTRAINT `HotelAmenity_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelcalendarnote` ADD CONSTRAINT `HotelCalendarNote_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hoteldailystat` ADD CONSTRAINT `HotelDailyStat_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelfavorite` ADD CONSTRAINT `HotelFavorite_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelfavorite` ADD CONSTRAINT `HotelFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelimage` ADD CONSTRAINT `HotelImage_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelpoi` ADD CONSTRAINT `HotelPOI_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelpoi` ADD CONSTRAINT `HotelPOI_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotelsearchsnapshot` ADD CONSTRAINT `HotelSearchSnapshot_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventorylock` ADD CONSTRAINT `InventoryLock_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investorprofile` ADD CONSTRAINT `InvestorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `Location_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menucategory` ADD CONSTRAINT `MenuCategory_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menuitem` ADD CONSTRAINT `MenuItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `menucategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menuitemoption` ADD CONSTRAINT `MenuItemOption_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `menuitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymenttransaction` ADD CONSTRAINT `PaymentTransaction_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricingrule` ADD CONSTRAINT `PricingRule_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricingrule` ADD CONSTRAINT `PricingRule_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promocode` ADD CONSTRAINT `PromoCode_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion` ADD CONSTRAINT `Promotion_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rateplan` ADD CONSTRAINT `RatePlan_cancellationPolicyId_fkey` FOREIGN KEY (`cancellationPolicyId`) REFERENCES `cancellationpolicy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rateplan` ADD CONSTRAINT `RatePlan_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `residentprofile` ADD CONSTRAINT `ResidentProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant` ADD CONSTRAINT `Restaurant_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurantcuisine` ADD CONSTRAINT `RestaurantCuisine_cuisineId_fkey` FOREIGN KEY (`cuisineId`) REFERENCES `cuisine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurantcuisine` ADD CONSTRAINT `RestaurantCuisine_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurantdailystat` ADD CONSTRAINT `RestaurantDailyStat_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewreport` ADD CONSTRAINT `ReviewReport_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `Ride_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driverprofile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `Ride_passengerId_fkey` FOREIGN KEY (`passengerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `Ride_pricingRuleId_fkey` FOREIGN KEY (`pricingRuleId`) REFERENCES `ridepricing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `Ride_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room` ADD CONSTRAINT `Room_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roomamenity` ADD CONSTRAINT `RoomAmenity_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roomavailability` ADD CONSTRAINT `RoomAvailability_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roomimage` ADD CONSTRAINT `RoomImage_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roomreview` ADD CONSTRAINT `RoomReview_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roomreview` ADD CONSTRAINT `RoomReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roomtype` ADD CONSTRAINT `RoomType_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment` ADD CONSTRAINT `Shipment_cargoVehicleId_fkey` FOREIGN KEY (`cargoVehicleId`) REFERENCES `cargovehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment` ADD CONSTRAINT `Shipment_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driverprofile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment` ADD CONSTRAINT `Shipment_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipmentpricing` ADD CONSTRAINT `ShipmentPricing_shipmentId_fkey` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `Ticket_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour` ADD CONSTRAINT `Tour_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `touravailability` ADD CONSTRAINT `TourAvailability_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tourcalendarnote` ADD CONSTRAINT `TourCalendarNote_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tourfavorite` ADD CONSTRAINT `TourFavorite_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tourfavorite` ADD CONSTRAINT `TourFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `touristprofile` ADD CONSTRAINT `TouristProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle` ADD CONSTRAINT `Vehicle_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehiclefavorite` ADD CONSTRAINT `VehicleFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehiclefavorite` ADD CONSTRAINT `VehicleFavorite_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendorprofile` ADD CONSTRAINT `VendorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilityabonent` ADD CONSTRAINT `utilityabonent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilitybill` ADD CONSTRAINT `utilitybill_abonentCode_fkey` FOREIGN KEY (`abonentCode`) REFERENCES `utilityabonent`(`abonentCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilitypayment` ADD CONSTRAINT `utilitypayment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilitypaymentitem` ADD CONSTRAINT `utilitypaymentitem_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `utilitypayment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilitypaymentitem` ADD CONSTRAINT `utilitypaymentitem_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `utilitybill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilityuploadlog` ADD CONSTRAINT `utilityuploadlog_uploadedByAdminId_fkey` FOREIGN KEY (`uploadedByAdminId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
