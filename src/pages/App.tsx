import { useState, useEffect } from "react";
import CustomAppBar from "../components/CustomAppBar";
import { useQuery } from "@tanstack/react-query";
import GalleryCard from "../components/GalleryCard";
import { getHighlightedObjects, getAllObjectIDs, getObjectsByPage } from "../queries/objects";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Pagination,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GalleryGrid from "../components/GalleryGrid";

const PAGE_SIZE = 12;

function App() {
  const [page, setPage] = useState(1);
  const [shuffledIDs, setShuffledIDs] = useState<number[] | null>(null);

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
    data: allObjectIDs,
    isLoading: isLoadingAllIDs,
    isError: isErrorAllIDs,
    error: errorAllIDs,
  } = useQuery({
    queryKey: ["all_object_ids"],
    queryFn: getAllObjectIDs,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (allObjectIDs && !shuffledIDs) {
      const shuffled = [...allObjectIDs].sort(() => 0.5 - Math.random());
      setShuffledIDs(shuffled);
    }
  }, [allObjectIDs, shuffledIDs]);

  const {
    data: pageObjects,
    isLoading: isLoadingPage,
    isError: isErrorPage,
    error: errorPage,
  } = useQuery({
    queryKey: ["objects_by_page", page, shuffledIDs],
    queryFn: () => (shuffledIDs ? getObjectsByPage(PAGE_SIZE, page, shuffledIDs) : []),
    enabled: !!shuffledIDs,
  });

  const totalPages = shuffledIDs ? Math.ceil(shuffledIDs.length / PAGE_SIZE) : 0;

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
            <Box sx={{ overflowX: "hidden" }}>
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
            </Box>
          </section>
        )}
      </Container>

      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          Sélection d'œuvres aléatoires
        </Typography>
        {isLoadingAllIDs || isLoadingPage || !shuffledIDs ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : isErrorAllIDs ? (
          <Alert severity="error">
            Erreur lors du chargement des IDs :{" "}
            {errorAllIDs instanceof Error ? errorAllIDs.message : "Erreur inconnue"}
          </Alert>
        ) : isErrorPage ? (
          <Alert severity="error">
            Erreur lors du chargement de la galerie :{" "}
            {errorPage instanceof Error ? errorPage.message : "Erreur inconnue"}
          </Alert>
        ) : (
          <>
            <GalleryGrid items={pageObjects || []} />
            <Box display="flex" justifyContent="center" my={4}>
              <Pagination
                count={totalPages}
                page={page}
                color="primary"
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

export default App;