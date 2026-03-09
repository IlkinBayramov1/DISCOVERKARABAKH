    # Project Backend Documentation

    This document provides a comprehensive overview of the backend structure, request flow, module organization, architectural patterns (Controllers, Services), and core database models. The project utilizes Node.js, Express.js, and Prisma ORM to connect to a MySQL database.

    ---

    ## 1. Architectural Overview & Request Flow

    The application follows a strictly modular, domain-driven architecture pattern separating concerns between routing, controlling, and business logic execution.

    The standard execution lifecycle of an API request:

    1. **Global Routing (`app.js` & `routes/index.js`)**
    - The entry point (`server.js`) initializes the Express app (`app.js`), Socket.io gateways, and scheduled background jobs.
    - `app.js` handles global middleware (CORS, body parsing) and delegates all routing to `routes/index.js`.
    - `routes/index.js` currently routes API calls through `/api/v1`, leading into `routes/v1/index.js`.

    2. **Module Route Declaration (`routes/v1/index.js`)**
    - This router registers all major sub-domains. Example endpoints include `/auth`, `/users`, `/hotels`, `/transport`, and `/bookings`.
    - Each domain points to its respective `*.routes.js` module file mapping specific HTTP methods to Controller functions.

    3. **Controllers (`*.controller.js`)**
    - **Purpose**: Manage the HTTP layer in isolation.
    - **Responsibilities**:
        - Extract data (parameters, body data, query strings) from the Express `req` object.
        - Call the necessary Service methods, passing the extracted DTOs (Data Transfer Objects).
        - Standardize the JSON response (success messages, data payloads) and gracefully pass any thrown exceptions to the next global error handler via `next(error)`.

    4. **Services (`*.service.js`)**
    - **Purpose**: Pure business logic execution, detached from the HTTP context.
    - **Responsibilities**:
        - Handle data validation, algorithmic processing, and state checks.
        - Perform all CRUD operations and relational querying via the Prisma ORM Client.
        - Throw specific application errors (e.g., Validation Errors, Not Found, Unauthorized) that controllers catch and format.

    5. **Prisma ORM & Database (`prisma/schema.prisma`)**
    - The final layer where the Services securely interact with the relational MySQL database using statically typed Prisma queries.

    ---

    ## 2. Modules Structure

    The backend consists of several strictly divided, domain-centric modules stored within the `modules/` directory:

    - **`auth/`**: Manages authentication strategies, user registration, login, token generation (JWT), and system authentication validation.
    - **`users/`**: Profile and account management for base system users.
    - **`admins/`**: Administrative endpoints for system-wide configuration, bans, user approvals, and comprehensive data viewing.
    - **`vendors/`**: specialized endpoints for B2B users managing inventory (Hotels, Vehicles, Events).
    - **`businesses/`**: Contains sub-modules for the diverse core businesses:
    - `hotel/`: Management of properties, room types, rate plans, and amenities.
    - `tour/`: Travel packages, itineraries, and dates.
    - `event/`: Concerts, conferences, capacity, and ticket management.
    - `restaurant/`: Food venues, menu categories/items, and promos.
    - `attraction/`: Sites of interest and their reviews/favorites.
    - **`transport/`**: Comprehensive module containing logic for:
    - `Vehicle` management.
    - `Driver` oversight, status, and capabilities tracking.
    - `Ride` & `Pricing` management logic.
    - Real-time `tracking` via Socket.io.
    - **`booking/` & `bookings/`**: Universal transactional endpoints handling all reservation operations natively spanning Stays, Tours, and Events. Includes pricing breakdown validation and availability checks.
    - **`payments/`**: Integrating with external financial systems and tracking payment processing logic/statuses.
    - **`interactions/`**: Cross-domain mechanics like user `reviews` on hotels, tours, or transport.

    ---

    ## 3. Database Models (Prisma Schema)

    The database, engineered comprehensively via `schema.prisma`, defines several fundamental domains.

    ### 3.1. Authentication and User Profiles
    *The platform utilizes role-based accounts attached to detailed specific sub-profiles based on the user's primary persona.*
    - **`User`**: The root model containing credentials, auth status (Banned, Approved), and a global `Role` enum (`user`, `vendor`, `tourist`, `resident`, `investor`, `admin`, `driver`).
    - **Profiles**: `VendorProfile`, `TouristProfile`, `ResidentProfile`, `InvestorProfile`, and `DriverProfile`. One user links tightly to context-specific profiles for specialized features.

    ### 3.2. Core Businesses Domain
    *The inventory structures vendors use to generate revenue.*
    - **`Hotel`**: Top-level record for accommodations. Relates heavily to `RoomType`, `Room`, `RatePlan` (e.g., Refundable, Meals Included), `DailyPricing`, and `RoomAvailability`.
    - **`Tour`**: Includes properties for location, difficulty, prices, min/max group sizes, and extensive `.json` payloads for detailed itineraries.
    - **`Event` & `Ticket`**: Temporal entities bounded by `capacity` and `startDate`/`endDate`, linking users to generated unique QR-coded `Tickets`.
    - **`Restaurant`**: Represents culinary properties mapping to robust `MenuCategory`, `.json` working hours, and physical geographic coordinates.

    ### 3.3. Transport & Delivery
    *For ridesharing and cargo operations across the region.*
    - **`Vehicle`**: Ties vehicles strictly to a Vendor, classifying them by generic categories (`Economy`, `Minivan`) and detailed aspects (`plateNumber`, `luggage`).
    - **`DriverProfile` & `DriverCapability`**: Defines active drivers, their real-time geographical coordinates, ratings, and array of capabilities (`CARGO_LIGHT`, `PASSENGER`, `HAZARDOUS`).
    - **`Ride` & `RidePricing`**: Establishes trips between a `Passenger` and a `Driver`. It maintains highly granular states (`Pending`, `DriverAssigned`, `Ongoing`, `Completed`), and incorporates variable distance mapping and pricing rules.

    ### 3.4. Bookings and Transactions
    *The universal transactional backbone for all business reservations.*
    - **`Booking`**: A polymorphic master container capable of bridging to `Hotel`, `Tour`, or `Event`. Governs unified statuses (`pending`, `confirmed`, `checked_in`) and tracks total financial values natively.
    - **`BookingItem`**: Breakdown details mapping specific business configurations uniquely to the booking (e.g., specific dates targeting a certain `roomTypeId`).
    - **`Guest`**: Tracks all constituent individuals tied natively to the master booking.
    - **`BookingAuditLog`**: Highly structured append-only tracing for accountability and transparency when bookings scale statuses (created, modified, cancelled).
