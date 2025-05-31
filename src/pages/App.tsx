import CustomAppBar from "../components/CustomAppBar";
import { useQuery } from "@tanstack/react-query";
import CarouselGallery from "../components/CarouselGallery";
import { getHighlightedObjects } from "../queries/objects";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const {
    data: highlightedObjects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["get_highlighted_objects"],
    queryFn: getHighlightedObjects,
  });

  return (
    <>
      <CustomAppBar />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Les Highlights (c'est top !)
        </Typography>
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Alert severity="error">
            Erreur lors du chargement des œuvres :{" "}
            {error instanceof Error ? error.message : "Erreur inconnue"}
          </Alert>
        )}
      </Container>
      {highlightedObjects && highlightedObjects.length > 0 && (
        <CarouselGallery items={highlightedObjects} />
      )}
    </>
  );
}

export default App;