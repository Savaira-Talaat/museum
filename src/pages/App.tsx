import CustomAppBar from "../components/CustomAppBar";
import { useQuery } from "@tanstack/react-query";
import CarouselGallery from "../components/CarouselGallery";
import GalleryGrid from "../components/GalleryGrid";
import { getHighlightedObjects, getRandomObjects } from "../queries/objects";
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
    isLoading: isLoadingHighlights,
    isError: isErrorHighlights,
    error: errorHighlights,
  } = useQuery({
    queryKey: ["get_highlighted_objects"],
    queryFn: getHighlightedObjects,
  });

  const {
    data: randomObjects,
    isLoading: isLoadingRandom,
    isError: isErrorRandom,
    error: errorRandom,
  } = useQuery({
    queryKey: ["get_random_objects"],
    queryFn: () => getRandomObjects(12),
  });

  return (
    <>
      <CustomAppBar />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          Highlights
        </Typography>
        {isLoadingHighlights && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        )}
        {isErrorHighlights && (
          <Alert severity="error">
            Erreur lors du chargement des œuvres :{" "}
            {errorHighlights instanceof Error ? errorHighlights.message : "Erreur inconnue"}
          </Alert>
        )}
      </Container>
      {highlightedObjects && highlightedObjects.length > 0 && (
        <CarouselGallery items={highlightedObjects} />
      )}

      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          Sélection d'œuvres aléatoires
        </Typography>
        {isLoadingRandom && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        )}
        {isErrorRandom && (
          <Alert severity="error">
            Erreur lors du chargement de la galerie :{" "}
            {errorRandom instanceof Error ? errorRandom.message : "Erreur inconnue"}
          </Alert>
        )}
        {randomObjects && randomObjects.length > 0 && (
          <GalleryGrid items={randomObjects} />
        )}
      </Container>
    </>
  );
}

export default App;