import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface GalleryCardProps {
  image: string;
  title: string;
}

export default function GalleryCardSimple({ image, title }: GalleryCardProps) {
  return (
    <Card sx={{ maxWidth: 220, margin: "0 auto" }}>
      {image && (
        <CardMedia component="img" height="180" image={image} alt={title} />
      )}
      <CardContent>
        <Typography variant="body2" noWrap>{title}</Typography>
      </CardContent>
    </Card>
  );
}