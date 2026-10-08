import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { phoneSchema, pinSchema, farmerRegisterSchema, buyerRegisterSchema } from "../../src/schemas/auth";
import { listingSchema } from "../../src/schemas/listing";
import { bidSchema } from "../../src/schemas/bid";

describe("1. Validation & Input Schemas Test Suite", () => {
  describe("Phone & PIN Schemas", () => {
    it("accepts valid 10-digit Indian mobile numbers starting with 6-9", () => {
      const validNumbers = ["9876543210", "8123456789", "7000000000", "6999999999"];
      for (const phone of validNumbers) {
        const result = phoneSchema.safeParse(phone);
        assert.equal(result.success, true);
      }
    });

    it("rejects invalid mobile numbers (too short, starting with 0-5, non-digits)", () => {
      const invalidNumbers = ["1234567890", "5999999999", "98765", "98765432101", "abcdefghij"];
      for (const phone of invalidNumbers) {
        const result = phoneSchema.safeParse(phone);
        assert.equal(result.success, false);
      }
    });

    it("accepts valid 4-digit PIN", () => {
      assert.equal(pinSchema.safeParse("1234").success, true);
      assert.equal(pinSchema.safeParse("0000").success, true);
      assert.equal(pinSchema.safeParse("9999").success, true);
    });

    it("rejects non-4-digit PINs", () => {
      assert.equal(pinSchema.safeParse("123").success, false);
      assert.equal(pinSchema.safeParse("12345").success, false);
      assert.equal(pinSchema.safeParse("abcd").success, false);
    });
  });

  describe("Farmer & Buyer Registration Schemas", () => {
    it("validates valid farmer registration payload", () => {
      const payload = {
        phone: "9876543210",
        pin: "1234",
        name: "चौधरी रमेश सिंह",
        village: "शाहपुर",
        tehsil: "बुढ़ाना",
        district: "मुज़फ़्फ़रनगर",
        totalLandAcres: 12.5,
      };
      const result = farmerRegisterSchema.safeParse(payload);
      assert.equal(result.success, true);
    });

    it("rejects farmer registration with names exceeding 100 characters", () => {
      const payload = {
        phone: "9876543210",
        pin: "1234",
        name: "A".repeat(101),
        village: "शाहपुर",
        tehsil: "बुढ़ाना",
        district: "मुज़फ़्फ़रनगर",
      };
      const result = farmerRegisterSchema.safeParse(payload);
      assert.equal(result.success, false);
    });

    it("validates valid buyer registration with standard Indian GSTIN", () => {
      const payload = {
        phone: "9123456780",
        pin: "1234",
        name: "राजेश सिंघल",
        businessName: "त्रिवेणी शुगर मिल",
        businessType: "SUGAR_MILL" as const,
        address: "खतौली, मुज़फ़्फ़रनगर",
        district: "मुज़फ़्फ़रनगर",
        gstin: "09AAAAA0000A1Z5",
      };
      const result = buyerRegisterSchema.safeParse(payload);
      assert.equal(result.success, true);
    });

    it("rejects buyer registration with malformed GSTIN", () => {
      const payload = {
        phone: "9123456780",
        pin: "1234",
        name: "राजेश सिंघल",
        businessName: "त्रिवेणी शुगर मिल",
        businessType: "SUGAR_MILL" as const,
        address: "खतौली, मुज़फ़्फ़रनगर",
        district: "मुज़फ़्फ़रनगर",
        gstin: "INVALID_GSTIN_123",
      };
      const result = buyerRegisterSchema.safeParse(payload);
      assert.equal(result.success, false);
    });
  });

  describe("Listing Validation Schema", () => {
    it("accepts valid listing within quantity and price bounds", () => {
      const payload = {
        variety: "Co 0238 (करन 4)",
        quantityQuintals: 500,
        harvestStatus: "STANDING_CROP",
        harvestDate: "2026-11-15",
        basePricePerQuintal: 380,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
        landmark: "नहर के पास",
      };
      const result = listingSchema.safeParse(payload);
      assert.equal(result.success, true);
    });

    it("rejects listing below minimum quantity (10 quintals)", () => {
      const payload = {
        variety: "Co 0238",
        quantityQuintals: 5,
        harvestStatus: "STANDING_CROP",
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
      };
      const result = listingSchema.safeParse(payload);
      assert.equal(result.success, false);
    });

    it("rejects listing with base price below floor ₹200 or above ceiling ₹1,000", () => {
      const tooLow = {
        variety: "Co 0238",
        quantityQuintals: 100,
        harvestStatus: "STANDING_CROP",
        basePricePerQuintal: 150,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
      };
      const tooHigh = { ...tooLow, basePricePerQuintal: 1200 };
      assert.equal(listingSchema.safeParse(tooLow).success, false);
      assert.equal(listingSchema.safeParse(tooHigh).success, false);
    });

    it("rejects malformed harvestDate format (must be YYYY-MM-DD)", () => {
      const malformedDate = {
        variety: "Co 0238",
        quantityQuintals: 100,
        harvestStatus: "STANDING_CROP",
        harvestDate: "15/11/2026",
        basePricePerQuintal: 350,
        district: "मुज़फ़्फ़रनगर",
        tehsil: "बुढ़ाना",
        village: "शाहपुर",
      };
      assert.equal(listingSchema.safeParse(malformedDate).success, false);
    });
  });

  describe("Bid Validation Schema", () => {
    it("accepts valid bid with payment terms", () => {
      const payload = {
        listingId: "listing_cuid_123",
        bidPricePerQuintal: 410,
        paymentTerms: "कांटे पर तौल के तुरंत बाद बैंक ट्रांसफर",
        notes: "परिवहन की व्यवस्था हमारी होगी।",
      };
      const result = bidSchema.safeParse(payload);
      assert.equal(result.success, true);
    });

    it("rejects bid below ₹200 or above ₹5,000", () => {
      const tooLow = {
        listingId: "listing_123",
        bidPricePerQuintal: 180,
        paymentTerms: "तौल पर नकद",
      };
      const tooHigh = {
        listingId: "listing_123",
        bidPricePerQuintal: 6000,
        paymentTerms: "तौल पर नकद",
      };
      assert.equal(bidSchema.safeParse(tooLow).success, false);
      assert.equal(bidSchema.safeParse(tooHigh).success, false);
    });

    it("rejects bid with payment terms shorter than 3 characters or exceeding 200 characters", () => {
      const tooShort = {
        listingId: "listing_123",
        bidPricePerQuintal: 400,
        paymentTerms: "OK",
      };
      const tooLong = {
        listingId: "listing_123",
        bidPricePerQuintal: 400,
        paymentTerms: "A".repeat(201),
      };
      assert.equal(bidSchema.safeParse(tooShort).success, false);
      assert.equal(bidSchema.safeParse(tooLong).success, false);
    });
  });
});
