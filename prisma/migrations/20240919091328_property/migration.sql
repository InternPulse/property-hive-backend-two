-- CreateTable
CREATE TABLE "property" (
    "id" SERIAL NOT NULL,
    "sellerID" INTEGER NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "squareMeters" DOUBLE PRECISION NOT NULL,
    "price" INTEGER NOT NULL,
    "propertyType" TEXT,
    "status" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);
