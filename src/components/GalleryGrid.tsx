import { Grid, Box } from "@mui/material";
import GalleryCard from "./GalleryCard";

interface GalleryGridProps {
  items: {
    objectID: number;
    primaryImageSmall: string;
    title: string;
    artist: string;
    date: string;
  }[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto", mt: 4, mb: 6 }}>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.objectID}>
            <GalleryCard
              objectID={item.objectID}
              image={item.primaryImageSmall}
              title={item.title}
              artist={item.artist}
              date={item.date}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}