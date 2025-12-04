-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "defaultLocationLat" DECIMAL(10,8),
    "defaultLocationLng" DECIMAL(11,8),
    "defaultLocationAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietaryRequirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DietaryRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDietaryRequirement" (
    "userId" TEXT NOT NULL,
    "dietaryRequirementId" TEXT NOT NULL,

    CONSTRAINT "UserDietaryRequirement_pkey" PRIMARY KEY ("userId","dietaryRequirementId")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "googlePlaceId" TEXT NOT NULL,
    "foodTypes" TEXT[],
    "establishmentType" TEXT,
    "priceLevel" INTEGER,
    "rating" DECIMAL(3,2),
    "userRatingsTotal" INTEGER,
    "openingHours" JSONB,
    "phoneNumber" TEXT,
    "website" TEXT,
    "photoUrl" TEXT,
    "lastCachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "lastVisitedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantCategoryLink" (
    "restaurantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "RestaurantCategoryLink_pkey" PRIMARY KEY ("restaurantId","categoryId")
);

-- CreateTable
CREATE TABLE "LunchGroup" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "locationLat" DECIMAL(10,8) NOT NULL,
    "locationLng" DECIMAL(11,8) NOT NULL,
    "locationAddress" TEXT,
    "aggregatedDietaryRequirements" TEXT[],
    "selectedRestaurantId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LunchGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LunchGroupParticipant" (
    "lunchGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LunchGroupParticipant_pkey" PRIMARY KEY ("lunchGroupId","userId")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "lunchGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitHistory" (
    "id" TEXT NOT NULL,
    "lunchGroupId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "visitedAt" DATE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryRequirement_name_key" ON "DietaryRequirement"("name");

-- CreateIndex
CREATE INDEX "UserDietaryRequirement_userId_idx" ON "UserDietaryRequirement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_googlePlaceId_key" ON "Restaurant"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Restaurant_googlePlaceId_idx" ON "Restaurant"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Restaurant_establishmentType_idx" ON "Restaurant"("establishmentType");

-- CreateIndex
CREATE INDEX "Restaurant_lastVisitedAt_idx" ON "Restaurant"("lastVisitedAt");

-- CreateIndex
CREATE INDEX "Restaurant_visitCount_idx" ON "Restaurant"("visitCount");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantCategory_name_key" ON "RestaurantCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantCategory_slug_key" ON "RestaurantCategory"("slug");

-- CreateIndex
CREATE INDEX "RestaurantCategoryLink_restaurantId_idx" ON "RestaurantCategoryLink"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantCategoryLink_categoryId_idx" ON "RestaurantCategoryLink"("categoryId");

-- CreateIndex
CREATE INDEX "LunchGroup_date_idx" ON "LunchGroup"("date");

-- CreateIndex
CREATE INDEX "LunchGroup_status_idx" ON "LunchGroup"("status");

-- CreateIndex
CREATE INDEX "LunchGroup_createdById_idx" ON "LunchGroup"("createdById");

-- CreateIndex
CREATE INDEX "LunchGroup_selectedRestaurantId_idx" ON "LunchGroup"("selectedRestaurantId");

-- CreateIndex
CREATE INDEX "LunchGroupParticipant_lunchGroupId_idx" ON "LunchGroupParticipant"("lunchGroupId");

-- CreateIndex
CREATE INDEX "LunchGroupParticipant_userId_idx" ON "LunchGroupParticipant"("userId");

-- CreateIndex
CREATE INDEX "Vote_lunchGroupId_idx" ON "Vote"("lunchGroupId");

-- CreateIndex
CREATE INDEX "Vote_restaurantId_idx" ON "Vote"("restaurantId");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_lunchGroupId_userId_restaurantId_key" ON "Vote"("lunchGroupId", "userId", "restaurantId");

-- CreateIndex
CREATE INDEX "VisitHistory_lunchGroupId_idx" ON "VisitHistory"("lunchGroupId");

-- CreateIndex
CREATE INDEX "VisitHistory_restaurantId_idx" ON "VisitHistory"("restaurantId");

-- CreateIndex
CREATE INDEX "VisitHistory_visitedAt_idx" ON "VisitHistory"("visitedAt");

-- CreateIndex
CREATE INDEX "VisitHistory_restaurantId_visitedAt_idx" ON "VisitHistory"("restaurantId", "visitedAt");

-- AddForeignKey
ALTER TABLE "UserDietaryRequirement" ADD CONSTRAINT "UserDietaryRequirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDietaryRequirement" ADD CONSTRAINT "UserDietaryRequirement_dietaryRequirementId_fkey" FOREIGN KEY ("dietaryRequirementId") REFERENCES "DietaryRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantCategoryLink" ADD CONSTRAINT "RestaurantCategoryLink_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantCategoryLink" ADD CONSTRAINT "RestaurantCategoryLink_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RestaurantCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LunchGroup" ADD CONSTRAINT "LunchGroup_selectedRestaurantId_fkey" FOREIGN KEY ("selectedRestaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LunchGroup" ADD CONSTRAINT "LunchGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LunchGroupParticipant" ADD CONSTRAINT "LunchGroupParticipant_lunchGroupId_fkey" FOREIGN KEY ("lunchGroupId") REFERENCES "LunchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LunchGroupParticipant" ADD CONSTRAINT "LunchGroupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_lunchGroupId_fkey" FOREIGN KEY ("lunchGroupId") REFERENCES "LunchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitHistory" ADD CONSTRAINT "VisitHistory_lunchGroupId_fkey" FOREIGN KEY ("lunchGroupId") REFERENCES "LunchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitHistory" ADD CONSTRAINT "VisitHistory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
