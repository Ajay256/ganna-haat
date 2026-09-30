import { PrismaClient, Role, BusinessType, HarvestStatus, ListingStatus, BidStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 शुरू कर रहे हैं: गन्ना हाट डेमो डेटा सीडिंग...");

  // Clear existing data (in reverse dependency order)
  await prisma.bid.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPinHash = await bcrypt.hash("1234", 10);

  // 1. व्यवस्थापक (Admin)
  const admin = await prisma.user.create({
    data: {
      phone: "9999999999",
      name: "प्रशासनिक अधिकारी (Admin)",
      pinHash: defaultPinHash,
      role: Role.ADMIN,
    },
  });

  // 2. किसान (Farmers)
  const farmer1 = await prisma.user.create({
    data: {
      phone: "9876543210",
      name: "चौधरी रमेश सिंह",
      pinHash: defaultPinHash,
      role: Role.FARMER,
      farmerProfile: {
        create: {
          village: "शाहपुर (Shahpur)",
          panchayat: "शाहपुर ग्राम पंचायत",
          tehsil: "बुढ़ाना",
          district: "मुज़फ़्फ़रनगर",
          state: "उत्तर प्रदेश",
          totalLandAcres: 12.5,
          kisanId: "UP-MZ-2026-8819",
        },
      },
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      phone: "9876543211",
      name: "सुनील कुमार वर्मा",
      pinHash: defaultPinHash,
      role: Role.FARMER,
      farmerProfile: {
        create: {
          village: "दौराला (Daurala)",
          panchayat: "दौराला कलां",
          tehsil: "सरधना",
          district: "मेरठ",
          state: "उत्तर प्रदेश",
          totalLandAcres: 8.0,
          kisanId: "UP-MRT-2026-4421",
        },
      },
    },
  });

  const farmer3 = await prisma.user.create({
    data: {
      phone: "9876543212",
      name: "बलदेव राणा",
      pinHash: defaultPinHash,
      role: Role.FARMER,
      farmerProfile: {
        create: {
          village: "कांधला (Kandhla)",
          panchayat: "कांधला देहात",
          tehsil: "कैराना",
          district: "शामली",
          state: "उत्तर प्रदेश",
          totalLandAcres: 15.0,
          kisanId: "UP-SHM-2026-9012",
        },
      },
    },
  });

  // 3. खरीदार (Buyers / Mills / Crushers)
  const buyer1 = await prisma.user.create({
    data: {
      phone: "9123456780",
      name: "राजेश सिंघल (प्रबंधक)",
      pinHash: defaultPinHash,
      role: Role.BUYER,
      buyerProfile: {
        create: {
          businessName: "त्रिवेणी शुगर मिल, खतौली",
          businessType: BusinessType.SUGAR_MILL,
          address: "जीटी रोड, खतौली बाईपास",
          district: "मुज़फ़्फ़रनगर",
          state: "उत्तर प्रदेश",
          gstin: "09AAACT1234M1Z5",
        },
      },
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      phone: "9123456781",
      name: "महेंद्र सिंह तोमर",
      pinHash: defaultPinHash,
      role: Role.BUYER,
      buyerProfile: {
        create: {
          businessName: "किसान गुड़ एवं खांडसारी उद्योग",
          businessType: BusinessType.JAGGERY_CRUSHER_KOLHU,
          address: "मवाना रोड, परीक्षितगढ़ तिराहा",
          district: "मेरठ",
          state: "उत्तर प्रदेश",
          gstin: "09BBBPK9876J2Z1",
        },
      },
    },
  });

  const buyer3 = await prisma.user.create({
    data: {
      phone: "9123456782",
      name: "अमित कुमार बंसल",
      pinHash: defaultPinHash,
      role: Role.BUYER,
      buyerProfile: {
        create: {
          businessName: "शामली को-ऑपरेटिव शुगर मिल",
          businessType: BusinessType.SUGAR_MILL,
          address: "करनाल रोड, शामली",
          district: "शामली",
          state: "उत्तर प्रदेश",
        },
      },
    },
  });

  // 4. गन्ने की फसल लिस्टिंग्स (Listings)
  const expiresFuture = new Date();
  expiresFuture.setDate(expiresFuture.getDate() + 7);

  const listing1 = await prisma.listing.create({
    data: {
      farmerId: farmer1.id,
      variety: "Co 0238 (करन 4)",
      quantityQuintals: 800,
      harvestStatus: HarvestStatus.STANDING_CROP,
      basePricePerQuintal: 385,
      village: "शाहपुर",
      tehsil: "बुढ़ाना",
      district: "मुज़फ़्फ़रनगर",
      landmark: "नहर पुलिया के पास, बुढ़ाना रोड",
      status: ListingStatus.APPROVED,
      approvedById: admin.id,
      approvedAt: new Date(),
      expiresAt: expiresFuture,
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      farmerId: farmer2.id,
      variety: "Co 15023 (अग्रणी)",
      quantityQuintals: 1200,
      harvestStatus: HarvestStatus.FRESHLY_CUT,
      basePricePerQuintal: 395,
      village: "दौराला",
      tehsil: "सरधना",
      district: "मेरठ",
      landmark: "दौराला मिल रेलवे क्रॉसिंग के पीछे",
      status: ListingStatus.APPROVED,
      approvedById: admin.id,
      approvedAt: new Date(),
      expiresAt: expiresFuture,
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      farmerId: farmer3.id,
      variety: "Co 0118 (करन 2)",
      quantityQuintals: 650,
      harvestStatus: HarvestStatus.STANDING_CROP,
      basePricePerQuintal: 380,
      village: "कांधला",
      tehsil: "कैराना",
      district: "शामली",
      landmark: "कांधला-बुढ़ाना मार्ग",
      status: ListingStatus.PENDING_APPROVAL, // एडमिन अनुमोदन के लिए
      expiresAt: expiresFuture,
    },
  });

  // 5. बोलियाँ (Bids)
  await prisma.bid.create({
    data: {
      listingId: listing1.id,
      buyerId: buyer1.id,
      bidPricePerQuintal: 392,
      totalAmount: 392 * 800,
      paymentTerms: "मिल गेट तौल के तुरंत बाद आरटीजीएस बैंक ट्रांसफर",
      notes: "ट्रैक्टर-ट्रॉली उठान हमारी ओर से उपलब्ध कराया जाएगा",
      status: BidStatus.PENDING,
    },
  });

  await prisma.bid.create({
    data: {
      listingId: listing1.id,
      buyerId: buyer2.id,
      bidPricePerQuintal: 398,
      totalAmount: 398 * 800,
      paymentTerms: "कांटे पर तौलते ही 100% नकद भुगतान",
      notes: "आज शाम ही ट्रॉली लग जाएगी",
      status: BidStatus.PENDING,
    },
  });

  await prisma.bid.create({
    data: {
      listingId: listing2.id,
      buyerId: buyer3.id,
      bidPricePerQuintal: 405,
      totalAmount: 405 * 1200,
      paymentTerms: "24 घंटे में सीधा बैंक खाते में",
      notes: "ताजा कटा हुआ माल प्राथमिकता पर लिया जाएगा",
      status: BidStatus.PENDING,
    },
  });

  console.log("✅ डेमो डेटा सीडिंग सफलतापूर्वक संपन्न!");
  console.log("-----------------------------------------");
  console.log("🌾 किसान लॉगिन: 9876543210 (पिन: 1234)");
  console.log("🏢 मिल/खरीदार लॉगिन: 9123456780 (पिन: 1234)");
  console.log("🛡️ एडमिन लॉगिन: 9999999999 (पिन: 1234)");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ त्रुटि:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
