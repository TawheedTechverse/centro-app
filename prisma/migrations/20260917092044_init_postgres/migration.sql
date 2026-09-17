-- CreateTable
CREATE TABLE "Roster" (
    "id" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,
    "shiftStart" TEXT NOT NULL,
    "shiftEnd" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "swappedFrom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceUpload" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpiryProduct" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "suggestedPrice" DOUBLE PRECISION,
    "saleStartDate" TIMESTAMP(3),
    "aiNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpiryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Roster_weekStart_idx" ON "Roster"("weekStart");

-- CreateIndex
CREATE INDEX "OrderItem_productName_idx" ON "OrderItem"("productName");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "InvoiceUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
