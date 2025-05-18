import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password: Bun.password.hashSync("admin"),
        role: "ADMIN",
      },
    });
  } catch (error: any) {
    console.info("Admin already created");
  }

  try {
    await prisma.user.create({
      data: {
        name: "Client",
        email: "client@gmail.com",
        password: Bun.password.hashSync("client"),
        role: "CLIENT",
        client: {
          create: {},
        },
      },
    });
  } catch (error) {
    console.info("Client already created");
  }

  try {
    await prisma.user.create({
      data: {
        name: "Seller",
        email: "seller@gmail.com",
        password: Bun.password.hashSync("seller"),
        role: "SELLER",
        seller: {
          create: {
            shop: "Shop",
          },
        },
      },
    });
  } catch (error) {
    console.info("Seller already created");
  }
}

main().then(async () => {
  await prisma.$disconnect();
});
