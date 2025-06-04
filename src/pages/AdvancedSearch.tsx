import React, { useEffect, useState } from "react"; 
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import { advancedSearch } from "../queries/advancedSearch";
import { API_URL } from "../constants";

const AdvancedSearch = () => {
  const [query, setQuery] = useState("");
  const [hasImages, setHasImages] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [departments, setDepartments] = useState<{ departmentId: number; displayName: string }[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/departments`);
        const data = await res.json();
        setDepartments(data.departments);
      } catch (e) {
        console.error("Erreur lors du chargement des départements :", e);
      }
    };
    fetchDepartments();
  }, []);

  const handleSearch = async () => {
    setError(null);
    setResults([]);
    setHasSearched(false);

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
        resultIds.slice(0, 20).map(async (id: any) => {
          try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Not Found");
            const data = await res.json();
            return {
              title: data.title || "Sans titre",
              department: data.department || "N/A",
              objectDate: data.objectDate || "N/A",
              image: data.primaryImageSmall || null,
            };
          } catch (e) {
            return null;
          }
        })
      );

      setResults(details.filter(Boolean));
    } catch (err) {
      console.error("Erreur de recherche :", err);
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setHasSearched(true);
    }
  };

  return (
    <Box sx={{ p: 4, color: "white" }}>
      <Typography variant="h4" gutterBottom>
        Recherche Avancée
      </Typography>
      <TextField
        label="Mot-clés"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "white" } }}
        inputProps={{ style: { color: "white" } }}
        variant="outlined"
      />
      <FormControlLabel
        control={<Checkbox checked={hasImages} onChange={(e) => setHasImages(e.target.checked)} />}
        label="Uniquement avec image"
        sx={{ color: "white" }}
      />
      <FormControlLabel
        control={<Checkbox checked={isHighlight} onChange={(e) => setIsHighlight(e.target.checked)} />}
        label="Œuvres mises en avant"
        sx={{ color: "white" }}
      />
      <Select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ mt: 2, color: "white" }}
        inputProps={{ "aria-label": "Département" }}
      >
        <MenuItem value="" sx={{ color: "black" }}>Tous les départements</MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept.departmentId} value={String(dept.departmentId)} sx={{ color: "black" }}>
            {dept.displayName}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Date de début"
        type="number"
        value={dateBegin}
        onChange={(e) => setDateBegin(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "white" } }}
        inputProps={{ style: { color: "white" } }}
        variant="outlined"
      />
      <TextField
        label="Date de fin"
        type="number"
        value={dateEnd}
        onChange={(e) => setDateEnd(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "white" } }}
        inputProps={{ style: { color: "white" } }}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
        Rechercher
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Résultats :</Typography>

        {results.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {results.map((item, index) => (
              <li key={index} style={{ marginBottom: "1rem" }}>
                <Typography variant="subtitle1">
                  <strong>{item.title}</strong>
                </Typography>
                <Typography variant="body2">
                  Département : {item.department} - Date : {item.objectDate}
                </Typography>
                {item.image && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        maxWidth: "150px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    />
                  </Box>
                )}
              </li>
            ))}
          </ul>
        ) : (
          hasSearched && (
            <Typography sx={{ mt: 2 }}>
              Aucun résultat trouvé. Essayez d'ajuster vos critères de recherche.
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default AdvancedSearch;
