import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getObjectById } from "../queries/objects";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Button,
} from "@mui/material";

export default function ObjectPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: obj,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["object", id],
    queryFn: () => getObjectById(id!),
    enabled: Boolean(id),
  });

  if (isLoading)
    return (
      <Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Erreur : {error instanceof Error ? error.message : "Objet introuvable"}
        </Alert>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Button variant="outlined" component={RouterLink} to="/" sx={{ mb: 2 }}>
        Retour à l’accueil
      </Button>
      <section className="artwork-detail">
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="flex-start"
          gap={4}
        >
          <Box
            flex="1 1 300px"
            maxWidth={400}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#fafafa"
            borderRadius={2}
            boxShadow={1}
            mb={{ xs: 2, md: 0 }}
          >
            <img
              className="artwork-detail-image"
              src={obj.primaryImage || obj.primaryImageSmall}
              alt={obj.title}
              style={{
                width: "100%",
                maxWidth: 380,
                borderRadius: 12,
                objectFit: "contain",
                background: "#eee",
              }}
            />
          </Box>
          <Box flex="2 1 400px" width="100%">
            <Typography variant="h1" fontWeight={700} gutterBottom>
              {obj.title}
            </Typography>
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              {obj.culture && <Chip label={obj.culture} color="secondary" />}
              {obj.period && <Chip label={obj.period} />}
              {obj.objectDate && <Chip label={obj.objectDate} />}
            </Stack>
            <Typography variant="body1" gutterBottom>
              <b>Département :</b> {obj.department || "—"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Auteur :</b> {obj.artistDisplayName || "Inconnu"}
            </Typography>
            {obj.artistDisplayBio && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <i>{obj.artistDisplayBio}</i>
              </Typography>
            )}
            <Typography variant="body1" gutterBottom>
              <b>Type :</b> {obj.objectName || "—"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Période :</b> {obj.period || "—"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Origine :</b> {obj.country || "—"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Dimensions :</b> {obj.dimensions || "—"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Matériaux :</b> {obj.medium || "—"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Lieu actuel :</b> {obj.repository || "—"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <b>Description / Détails supplémentaires :</b>
              <br />
              {obj.creditLine || "—"}
            </Typography>
            {obj.objectURL && (
              <Button variant="contained" color="primary" href={obj.objectURL} target="_blank">
                Voir sur le site du MET
              </Button>
            )}
          </Box>
        </Box>
      </section>
    </Container>
  );
}