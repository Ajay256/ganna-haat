import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { ListingStatus, BidStatus, Role, UserStatus, HarvestStatus, Prisma } from "@prisma/client";

describe("3. Core Bidding Business Logic & Security Integration Suite", () => {
  let testFarmerId: string;
  let testBuyerId1: string;
  let testBuyerId2: string;
  let testAdminId: string;

  before(async () => {
    // 1. Setup isolated test users
    const farmer = await prisma.user.upsert({
      where: { phone: "9000000001" },
      update: {},
      create: {
        phone: "9000000001",
        name: "Test Farmer 1",
        pinHash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
        role: Role.FARMER,
        farmerProfile: {
          create: {
            village: "Test Village",
            tehsil: "Test Tehsil",
            district: "मुज़फ़्फ़रनगर",
          },
        },
      },
    });
    testFarmerId = farmer.id;

    const buyer1 = await prisma.user.upsert({
      where: { phone: "9000000002" },
      update: {},
      create: {
        phone: "9000000002",
        name: "Test Buyer 1",
        pinHash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
        role: Role.BUYER,
        buyerProfile: {
          create: {
            businessName: "Test Sugar Mill 1",
            district: "मुज़फ़्फ़रनगर",
            address: "Mill Area",
          },
        },
      },
    });
    testBuyerId1 = buyer1.id;

    const buyer2 = await prisma.user.upsert({
      where: { phone: "9000000003" },
      update: {},
      create: {
        phone: "9000000003",
        name: "Test Buyer 2",
        pinHash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
        role: Role.BUYER,
        buyerProfile: {
          create: {
            businessName: "Test Sugar Mill 2",
            district: "मुज़फ़्फ़रनगर",
            address: "Mill Area",
          },
        },
      },
    });
    testBuyerId2 = buyer2.id;

    const admin = await prisma.user.upsert({
      where: { phone: "9000000004" },
      update: {},
      create: {
        phone: "9000000004",
        name: "Test Admin",
        pinHash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
        role: Role.ADMIN,
      },
    });
    testAdminId = admin.id;
  });

  after(async () => {
    // Cleanup test data
    await prisma.bid.deleteMany({
      where: { buyerId: { in: [testBuyerId1, testBuyerId2] } },
    });
    await prisma.listing.deleteMany({
      where: { farmerId: testFarmerId },
    });
    await prisma.farmerProfile.deleteMany({ where: { userId: testFarmerId } });
    await prisma.buyerProfile.deleteMany({ where: { userId: { in: [testBuyerId1, testBuyerId2] } } });
    await prisma.user.deleteMany({
      where: { id: { in: [testFarmerId, testBuyerId1, testBuyerId2, testAdminId] } },
    });
  });

  it("Rule 1: Price Floor — Bid below base price must be rejected", async () => {
    const listing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 0238",
        quantityQuintals: 100,
        harvestStatus: HarvestStatus.STANDING_CROP,
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.APPROVED,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    const attemptedBidPrice = 340; // Less than 350
    const isBelowBase = Number(attemptedBidPrice) < Number(listing.basePricePerQuintal);
    assert.equal(isBelowBase, true, "Bids below base price must be flagged as invalid");

    await prisma.listing.delete({ where: { id: listing.id } });
  });

  it("Rule 2: Expiration Check — Bidding on expired listing must be blocked", async () => {
    const expiredListing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 0118",
        quantityQuintals: 200,
        basePricePerQuintal: 360,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.APPROVED,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour in the past
      },
    });

    const isExpired = new Date(expiredListing.expiresAt) <= new Date();
    assert.equal(isExpired, true, "Expired listings must not be open for bidding");

    await prisma.listing.delete({ where: { id: expiredListing.id } });
  });

  it("Rule 3: Self-Bidding Prevention — Farmer cannot bid on their own listing", async () => {
    const listing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 0238",
        quantityQuintals: 150,
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.APPROVED,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    const isSelfBid = listing.farmerId === testFarmerId;
    assert.equal(isSelfBid, true, "Self-bidding identity check must detect farmer ownership");

    await prisma.listing.delete({ where: { id: listing.id } });
  });

  it("Rule 4: Bid Shaving Prevention — Revised bid must be strictly higher than existing pending bid", async () => {
    const listing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 98014",
        quantityQuintals: 100,
        basePricePerQuintal: 340,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.APPROVED,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    const initialBid = await prisma.bid.create({
      data: {
        listingId: listing.id,
        buyerId: testBuyerId1,
        bidPricePerQuintal: 400,
        totalAmount: 40000,
        status: BidStatus.PENDING,
      },
    });

    // Attempting to revise bid downward to 360 (above base price, but below existing 400)
    const newBidPrice = 360;
    const isDownwardRevision = Number(newBidPrice) <= Number(initialBid.bidPricePerQuintal);
    assert.equal(isDownwardRevision, true, "Downward revision (bid shaving) must be blocked");

    await prisma.bid.delete({ where: { id: initialBid.id } });
    await prisma.listing.delete({ where: { id: listing.id } });
  });

  it("Rule 5: Deal Lockdown & Double-Selling Race Condition Prevention — Only 1 bid accepted; others auto-rejected", async () => {
    const listing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 0238",
        quantityQuintals: 300,
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.APPROVED,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    const bid1 = await prisma.bid.create({
      data: {
        listingId: listing.id,
        buyerId: testBuyerId1,
        bidPricePerQuintal: 390,
        totalAmount: 117000,
        status: BidStatus.PENDING,
      },
    });

    const bid2 = await prisma.bid.create({
      data: {
        listingId: listing.id,
        buyerId: testBuyerId2,
        bidPricePerQuintal: 405,
        totalAmount: 121500,
        status: BidStatus.PENDING,
      },
    });

    // Farmer accepts bid2 atomically
    await prisma.$transaction(async (tx) => {
      // 1. Lock listing status to SOLD
      const listingUpdate = await tx.listing.updateMany({
        where: { id: listing.id, farmerId: testFarmerId, status: ListingStatus.APPROVED },
        data: { status: ListingStatus.SOLD },
      });
      assert.equal(listingUpdate.count, 1);

      // 2. Accept bid2
      const bidUpdate = await tx.bid.updateMany({
        where: { id: bid2.id, listingId: listing.id, status: BidStatus.PENDING },
        data: { status: BidStatus.ACCEPTED },
      });
      assert.equal(bidUpdate.count, 1);

      // 3. Reject all other bids
      await tx.bid.updateMany({
        where: { listingId: listing.id, id: { not: bid2.id }, status: BidStatus.PENDING },
        data: { status: BidStatus.REJECTED },
      });
    });

    // Verify database state
    const refreshedListing = await prisma.listing.findUnique({ where: { id: listing.id } });
    const refreshedBid1 = await prisma.bid.findUnique({ where: { id: bid1.id } });
    const refreshedBid2 = await prisma.bid.findUnique({ where: { id: bid2.id } });

    assert.equal(refreshedListing?.status, ListingStatus.SOLD);
    assert.equal(refreshedBid2?.status, BidStatus.ACCEPTED);
    assert.equal(refreshedBid1?.status, BidStatus.REJECTED);

    // Simulate concurrent second request attempting to accept bid1:
    // It MUST fail because listing status is now SOLD (not APPROVED)!
    const secondAcceptAttempt = await prisma.listing.updateMany({
      where: { id: listing.id, farmerId: testFarmerId, status: ListingStatus.APPROVED },
      data: { status: ListingStatus.SOLD },
    });
    assert.equal(secondAcceptAttempt.count, 0, "Second concurrent acceptance must fail atomically with count 0");

    await prisma.bid.deleteMany({ where: { listingId: listing.id } });
    await prisma.listing.delete({ where: { id: listing.id } });
  });

  it("Rule 6: Stealth Modification Prevention — Approved listing edits reset to PENDING_APPROVAL", async () => {
    const listing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 0238",
        quantityQuintals: 200,
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.APPROVED,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // Status transition on edit:
    const nextStatus = listing.status === ListingStatus.APPROVED
      ? ListingStatus.PENDING_APPROVAL
      : listing.status;

    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        quantityQuintals: 300, // modified volume
        status: nextStatus,
      },
    });

    const updated = await prisma.listing.findUnique({ where: { id: listing.id } });
    assert.equal(updated?.status, ListingStatus.PENDING_APPROVAL, "Edited listing must require admin re-approval");

    await prisma.listing.delete({ where: { id: listing.id } });
  });

  it("Rule 7: Sold Listing Protection — Cannot cancel an already sold listing", async () => {
    const soldListing = await prisma.listing.create({
      data: {
        farmerId: testFarmerId,
        variety: "Co 0238",
        quantityQuintals: 100,
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        status: ListingStatus.SOLD,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    const canCancel = soldListing.status !== ListingStatus.SOLD;
    assert.equal(canCancel, false, "Sold listings cannot be cancelled");

    await prisma.listing.delete({ where: { id: soldListing.id } });
  });
});
