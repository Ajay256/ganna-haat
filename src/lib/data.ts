import { prisma } from "@/lib/prisma";
import { ListingStatus, BidStatus, Role, UserStatus } from "@prisma/client";

// Safe User projection that excludes pinHash
const safeFarmerSelect = {
  id: true,
  name: true,
  phone: true,
  role: true,
  status: true,
  farmerProfile: true,
};

const safeBuyerSelect = {
  id: true,
  name: true,
  phone: true,
  role: true,
  status: true,
  buyerProfile: true,
};

export async function getMarketplaceListings(filters?: {
  district?: string;
  variety?: string;
  maxPrice?: number;
}) {
  const where: any = {
    status: ListingStatus.APPROVED,
  };

  if (filters?.district && filters.district !== "ALL") {
    where.district = filters.district;
  }

  if (filters?.variety && filters.variety !== "ALL") {
    where.variety = { contains: filters.variety };
  }

  if (filters?.maxPrice && filters.maxPrice > 0) {
    where.basePricePerQuintal = { lte: filters.maxPrice };
  }

  return await prisma.listing.findMany({
    where,
    include: {
      farmer: {
        select: {
          id: true,
          name: true,
          farmerProfile: true,
        },
      },
      bids: {
        orderBy: { bidPricePerQuintal: "desc" },
        take: 3,
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              buyerProfile: true,
            },
          },
        },
      },
      _count: {
        select: { bids: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getListingById(id: string) {
  return await prisma.listing.findUnique({
    where: { id },
    include: {
      farmer: {
        select: safeFarmerSelect,
      },
      bids: {
        orderBy: { bidPricePerQuintal: "desc" },
        include: {
          buyer: {
            select: safeBuyerSelect,
          },
        },
      },
    },
  });
}

export async function getFarmerDashboardData(phone = "9876543210") {
  const farmer = await prisma.user.findUnique({
    where: { phone },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      farmerProfile: true,
      listings: {
        orderBy: { createdAt: "desc" },
        include: {
          bids: {
            orderBy: { bidPricePerQuintal: "desc" },
            include: {
              buyer: {
                select: safeBuyerSelect,
              },
            },
          },
        },
      },
    },
  });

  return farmer;
}

export async function getBuyerDashboardData(phone = "9123456780") {
  const buyer = await prisma.user.findUnique({
    where: { phone },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      buyerProfile: true,
      bids: {
        orderBy: { createdAt: "desc" },
        include: {
          listing: {
            include: {
              farmer: {
                select: safeFarmerSelect,
              },
            },
          },
        },
      },
    },
  });

  return buyer;
}

export async function getAdminDashboardData() {
  const [
    totalFarmers,
    totalBuyers,
    activeListings,
    pendingListings,
    totalBids,
    soldListings,
    pendingApprovalListings,
    allUsers,
    recentBids,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.FARMER } }),
    prisma.user.count({ where: { role: Role.BUYER } }),
    prisma.listing.count({ where: { status: ListingStatus.APPROVED } }),
    prisma.listing.count({ where: { status: ListingStatus.PENDING_APPROVAL } }),
    prisma.bid.count(),
    prisma.listing.count({ where: { status: ListingStatus.SOLD } }),
    prisma.listing.findMany({
      where: { status: ListingStatus.PENDING_APPROVAL },
      include: {
        farmer: {
          select: safeFarmerSelect,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        farmerProfile: true,
        buyerProfile: true,
        _count: {
          select: { listings: true, bids: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.bid.findMany({
      include: {
        buyer: {
          select: safeBuyerSelect,
        },
        listing: true,
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  return {
    kpis: {
      totalFarmers,
      totalBuyers,
      activeListings,
      pendingListings,
      totalBids,
      soldListings,
    },
    pendingApprovalListings,
    allUsers,
    recentBids,
  };
}
