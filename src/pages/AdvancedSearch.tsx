import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { advancedSearch } from "../queries/advancedSearch";
import { API_URL } from "../constants";

interface ItemDetails {
  title?: string;
  department?: string;
  objectDate?: string;
  [key: string]: any; 
}

function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [hasImages, setHasImages] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [results, setResults] = useState<ItemDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setResults([]);

    try {
      const resultIds = await advancedSearch({
        q: query || "*",
        hasImages,
        isHighlight,
        departmentId: departmentId || undefined,
        dateBegin: dateBegin || undefined,
        dateEnd: dateEnd || undefined,
      });

      const details = await Promise.all(
        resultIds.slice(0, 10).map(async (id: any) => {
          const res = await fetch(`${API_URL}/items/${id}`);
          const data = await res.json();
          console.log(data);
          return {
            title: data.title || data.name || "Sans titre",
            department: data.department || data.dept || "N/A",
            objectDate: data.objectDate || data.date || "N/A",
          };
        })
      );

      setResults(details);
    } catch (err) {
      console.error("Erreur de recherche :", err);
      setError("Une erreur est survenue lors de la recherche.");
    }
  };

  return (
    <Box sx={{ mt: 12, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Recherche Avancée
      </Typography>

      <TextField
        label="Mot-clé"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={hasImages}
            onChange={(e) => setHasImages(e.target.checked)}
          />
        }
        label="Avec image"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isHighlight}
            onChange={(e) => setIsHighlight(e.target.checked)}
          />
        }
        label="Œuvre en vedette"
      />

      <TextField
        label="ID du département"
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Date de début"
        type="number"
        value={dateBegin}
        onChange={(e) => setDateBegin(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Date de fin"
        type="number"
        value={dateEnd}
        onChange={(e) => setDateEnd(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleSearch}>
        Lancer la recherche
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Résultats :</Typography>
        {results.length > 0 ? (
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong> - Département : {item.department} -{" "}
                Date : {item.objectDate}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>Aucun résultat pour cette recherche.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default AdvancedSearch;
