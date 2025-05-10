import { Box, Button, TextInput, Image } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/admin";
import { Link } from "react-router";

const links = [
  { name: "Homepage", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Deals", path: "/deals" },
  { name: "About", path: "/about" },
  { name: "Sell", path: "/sell" },
];

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/",
    bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/",
    bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/4456815/pexels-photo-4456815.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/",
    bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
  },
];

export default function HomePage() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.query("category"),
  });

  return (
    <Box>
      <Box className="border-b border-b-gray-300 px-4  h-[8vh] flex items-center sticky top-0 z-50 bg-white">
        <Box className="flex flex-1/3 gap-3.5">
          <h1 className="text-2xl font-bold text-orange-400">Revibe</h1>

          {/* Search box */}
          <TextInput
            className="grow"
            size="md"
            radius={1000}
            placeholder={"Search product"}
            leftSection={<IconSearch size={16} />}
          />
        </Box>

        {/* Links */}
        <Box className="flex-1/2 ">
          <Box className="flex justify-end items-center">
            {links.map((item, index) => (
              <Link
                to={item.path}
                key={item.name}
                className="relative px-4 py-2 group overflow-hidden"
              >
                <span
                  className={`text-gray-700 font-medium group-hover:text-[#FDA210] transition-colors duration-300`}
                >
                  {item.name}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`}
                  style={{
                    backgroundColor:
                      index % 3 === 0
                        ? "#FDA210"
                        : index % 3 === 1
                        ? "#3FA878"
                        : "#FF4E88",
                  }}
                ></span>
              </Link>
            ))}
            <Box className="flex gap-3">
              <div>Profile</div>
              <div className="hover:bg-gray-200 p-2 rounded-full cursor-pointer">
                Cart
              </div>
            </Box>
          </Box>
        </Box>
      </Box>

      <Carousel className="h-[92vh]" emblaOptions={{ loop: true }}>
        {slides.map((slide) => (
          <Carousel.Slide key={slide.id} className="h-full">
            <div
              className={`${slide.bg} h-[92vh] flex flex-col gap-16 xl:flex-row`}
            >
              {/*TEXT CONTAINER*/}
              <div className="h-1/2 xl:w-1/2 xl:h-[92vh] flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
                <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                  {slide.description}
                </h2>
                <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
                  {slide.title}
                </h1>
                <Link to={slide.url}>
                  <Button size="md">SHOP NOW</Button>
                </Link>
              </div>

              {/*IMAGE CONTAINER*/}
              <div className="h-1/2 xl:w-1/2 xl:h-[92vh] relative">
                <Image src={slide.img} className="object-cover" />
              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
      <Box className="px-8">
        <h1 className="text-3xl grow mb-4 mt-12">Categories</h1>
      </Box>

      <Box className="mt-20 h-[600px]"></Box>
    </Box>
  );
}
