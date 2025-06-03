import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";

interface GalleryCardProps {
  image: string;
  title: string;
  artist: string;
  date: string;
}

export default function GalleryCard({ image, title, artist, date }: GalleryCardProps) {
  return (
    <Card
      sx={{
        width: { xs: 260, sm: 320, md: 360 },
        height: { xs: 390, sm: 430, md: 480 },
        boxShadow: 8,
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.04)",
          boxShadow: 16,
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          height: { xs: 220, sm: 260, md: 300 },
          objectFit: "cover",
          width: "100%",
          bgcolor: "#eee",
        }}
      />
      <CardContent
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          px: 2,
          py: 2,
          bgcolor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          noWrap
          sx={{
            width: "100%",
            color: "#222",
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, fontStyle: 'italic', width: "100%" }}
          noWrap
        >
          {artist}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.3, width: "100%" }}
        >
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
}