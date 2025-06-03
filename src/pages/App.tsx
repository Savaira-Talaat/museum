import CustomAppBar from "../components/CustomAppBar";
import { useQuery } from "@tanstack/react-query";
import GalleryCard from "../components/GalleryCard";
import { getHighlightedObjects, getRandomObjects } from "../queries/objects";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GalleryGrid from "../components/GalleryGrid";

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

  // Réglages du carrousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900,  settings: { slidesToShow: 2 } },
      { breakpoint: 600,  settings: { slidesToShow: 1 } },
    ],
    arrows: true,
  };

  return (
    <>
      <CustomAppBar />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Oeuvres en vedette
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
        {highlightedObjects && highlightedObjects.length > 0 && (
          <section className="highlights-section" style={{ marginTop: 32 }}>
            <Slider {...carouselSettings}>
              {highlightedObjects.map((item) => (
                <Box key={item.objectID} px={2}>
                  <GalleryCard
                    objectID={item.objectID}
                    image={item.primaryImageSmall}
                    title={item.title}
                    artist={item.artist}
                    date={item.date}
                    className="artwork-card"
                  />
                </Box>
              ))}
            </Slider>
          </section>
        )}
      </Container>

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