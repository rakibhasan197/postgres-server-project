const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding database...");

  // 1. Clear existing data
  console.log("🧹 Clearing old data...");
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  console.log("👤 Creating users...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const vendorPassword = await bcrypt.hash("vendor123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@shopsphere.com",
      password: adminPassword,
      name: "Admin Rakib",
      role: "ADMIN",
    },
  });

  const vendor = await prisma.user.create({
    data: {
      email: "vendor@shopsphere.com",
      password: vendorPassword,
      name: "Vendor John",
      role: "USER", // Can create products
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: "user@shopsphere.com",
      password: userPassword,
      name: "Jane User",
      role: "USER",
    },
  });

  // 3. Create Categories
  console.log("📦 Creating categories...");
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Smartphones, Laptops, Accessories, and Smart Gadgets",
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing & Apparel",
      description: "Fashion, Shoes, Jackets, and Accessories",
    },
  });

  const home = await prisma.category.create({
    data: {
      name: "Home & Kitchen",
      description: "Home appliances, Cookware, and Decor",
    },
  });

  // 4. Create Products
  console.log("🛒 Creating products...");
  const iPhone = await prisma.product.create({
    data: {
      title: "iPhone 15 Pro Max",
      description: "The latest Apple flagship smartphone with Titanium design, A17 Pro chip.",
      price: 1199.99,
      stock: 50,
      categoryId: electronics.id,
      vendorId: vendor.id,
    },
  });

  const macbook = await prisma.product.create({
    data: {
      title: "MacBook Pro M3 Max",
      description: "Powerful professional laptop with M3 Max chip, 36GB unified memory, and 1TB SSD.",
      price: 3199.99,
      stock: 15,
      categoryId: electronics.id,
      vendorId: vendor.id,
    },
  });

  const leatherJacket = await prisma.product.create({
    data: {
      title: "Premium Leather Jacket",
      description: "Genuine black leather jacket, tailored fit, wind resistant.",
      price: 189.99,
      stock: 30,
      categoryId: clothing.id,
      vendorId: vendor.id,
    },
  });

  const coffeeMaker = await prisma.product.create({
    data: {
      title: "Express Espresso Coffee Maker",
      description: "15-bar pump espresso machine with milk frother wand for barista quality drinks.",
      price: 149.50,
      stock: 25,
      categoryId: home.id,
      vendorId: vendor.id,
    },
  });

  // 5. Create Reviews
  console.log("⭐ Creating reviews...");
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Incredible phone! The battery life and camera are outstanding.",
      userId: normalUser.id,
      productId: iPhone.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: "Super powerful laptop, compiles code in seconds. Heavy price tag though.",
      userId: normalUser.id,
      productId: macbook.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Feels premium and fits perfectly. Totally worth it!",
      userId: admin.id,
      productId: leatherJacket.id,
    },
  });

  console.log("🎉 Seeding database completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
