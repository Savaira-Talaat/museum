import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { Link } from "react-router-dom";

interface GalleryCardProps {
  objectID: number;
  image: string;
  title: string;
  artist: string;
  date: string;
}

export default function GalleryCard({ objectID, image, title, artist, date }: GalleryCardProps) {
  return (
    <Card
      component={Link}
      to={`/object/${objectID}`}
      sx={{
        width: { xs: 260, sm: 320, md: 360 },
        height: { xs: 390, sm: 430, md: 480 },
        boxShadow: 8,
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.04)",
          boxShadow: 16,
        },
      }}
      aria-label={`Voir la fiche détaillée de ${title}`}
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
          sx={{
            width: "100%",
            color: "#222",
            fontSize: { xs: "1.08rem", md: "1.18rem" },
            mb: 0.5,
            lineHeight: 1.2,
          }}
          gutterBottom
        >
          {title}
        </Typography>
        <Box sx={{ width: "100%", mb: 0.5 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic', mb: 0.25, display: "block" }}
            noWrap
            title={artist}
          >
            {artist}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {date}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}