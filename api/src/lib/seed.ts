import { prisma } from "./prisma";

export const seed = async () => {
  try {
    console.log("Seeding");
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
};
