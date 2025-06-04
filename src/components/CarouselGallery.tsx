  import Slider from "react-slick";
  import GalleryCard from "./GalleryCard";
  import { Box } from "@mui/material";

  interface CarouselGalleryProps {
    items: {
      objectID: number;
      primaryImageSmall: string;
      title: string;
      artist: string;
      date: string;
    }[];
  }

  export default function CarouselGallery({ items }: CarouselGalleryProps) {
    const settings = {
      dots: true,
      infinite: true,
      speed: 700,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      centerPadding: "0px",
      responsive: [
        {
          breakpoint: 1400,
          settings: { slidesToShow: 3 },
        },
        {
          breakpoint: 900,
          settings: { slidesToShow: 2 },
        },
        {
          breakpoint: 600,
          settings: { slidesToShow: 1 },
        },
      ],
    };

    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 1600,
          mx: "auto",
          mt: 2,
          mb: 4,
          overflowY: "hidden",
          minHeight: { xs: 400, sm: 460, md: 500 },
          ".slick-slide": {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            height: "100%",
          },
          ".slick-list": {
            pb: 2,
          },
        }}
      >
        <Slider {...settings}>
          {items.map((item) => (
            <Box key={item.objectID} sx={{ px: { xs: 1, md: 2 } }}>
              <GalleryCard
                objectID={item.objectID}
                image={item.primaryImageSmall}
                title={item.title}
                artist={item.artist}
                date={item.date}
              />
            </Box>
          ))}
        </Slider>
      </Box>
    );
  }