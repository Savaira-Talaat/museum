import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface GalleryCardProps {
  image: string;
  title: string;
}

export default function GalleryCard({ image, title }: GalleryCardProps) {
  return (
    <Card
      sx={{
        width: { xs: 280, md: 340 },
        height: { xs: 320, md: 350 },
        boxShadow: 6,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          height: { xs: 180, md: 220 },
          objectFit: "cover",
          width: "100%",
        }}
      />
      <CardContent
        sx={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1,
          bgcolor: "#fff",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          align="center"
          noWrap
          sx={{ width: "100%" }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}