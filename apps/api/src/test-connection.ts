import prisma from "./lib/prisma";

async function testConnection() {
  console.log("🚀 Testing database connection...");

  try {
    // 1. Try to connect and count users
    const userCount = await prisma.user.count();
    console.log(`✅ Connection successful! Current user count: ${userCount}`);

    // 2. Test a write operation (Create a dummy user)
    console.log("📝 Testing write permissions (creating a temporary user)...");
    const testEmail = `test-${Date.now()}@example.com`;
    
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: "testing123",
        displayName: "Test User",
      },
    });
    console.log(`✅ Write successful! Created user with ID: ${newUser.id}`);

    // 3. Clean up the test data
    await prisma.user.delete({
      where: { id: newUser.id },
    });
    console.log("🧹 Cleaned up test data.");
    
    console.log("\n✨ Database is fully functional!");
  } catch (error) {
    console.error("❌ Database test failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
