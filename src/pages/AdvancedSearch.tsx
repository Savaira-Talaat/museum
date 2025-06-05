import React, { useState, useMemo } from "react";
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography, CircularProgress, Alert, Pagination as MuiPagination} from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { fetchDepartments, fetchObjectIds, fetchObjectDetails, type AdvancedSearchParams, type MetObject } from "../queries/advancedSearch";

const ITEMS_PER_PAGE = 20;

const AdvancedSearch = () => {
  const [query, setQuery] = useState("");
  const [hasImages, setHasImages] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [activeSearchParams, setActiveSearchParams] = useState<AdvancedSearchParams | null>(null);

  const { data: departments = [], isLoading: isLoadingDepartments, error: departmentsError } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: allObjectIds = [],
    isLoading: isLoadingObjectIds,
    isError: isErrorObjectIds,
    error: objectIdsError,
    isFetching: isFetchingObjectIds,
  } = useQuery({
    queryKey: ['objectIds', activeSearchParams],
    queryFn: () => activeSearchParams ? fetchObjectIds(activeSearchParams) : Promise.resolve([]),
    enabled: !!activeSearchParams, 
    staleTime: 1000 * 60 * 5, 
  });

  const totalPages = Math.ceil(allObjectIds.length / ITEMS_PER_PAGE);
  const paginatedObjectIds = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allObjectIds.slice(startIndex, endIndex);
  }, [allObjectIds, currentPage]); 

  const {
    data: results = [],
    isLoading: isLoadingResults,
    isError: isErrorResults,
    error: resultsError,
    isFetching: isFetchingResults,
  } = useQuery<MetObject[], Error>({
    queryKey: ['objectDetails', paginatedObjectIds], 
    queryFn: () => fetchObjectDetails(paginatedObjectIds),
    enabled: paginatedObjectIds.length > 0, 
    staleTime: 1000 * 60 * 60, 
  });

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearchParams({
      q: query,
      hasImages,
      isHighlight,
      departmentId: departmentId || undefined,
      dateBegin: dateBegin || undefined,
      dateEnd: dateEnd || undefined,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayLoading = isLoadingObjectIds || isLoadingResults || isFetchingObjectIds || isFetchingResults;
  const displayError = departmentsError || objectIdsError || resultsError;

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
        control={<Checkbox checked={hasImages} onChange={(e) => setHasImages(e.target.checked)} sx={{ color: 'white' }} />}
        label="Uniquement avec image"
        sx={{ color: "white" }}
      />
      <FormControlLabel
        control={<Checkbox checked={isHighlight} onChange={(e) => setIsHighlight(e.target.checked)} sx={{ color: 'white' }} />}
        label="Œuvres mises en avant"
        sx={{ color: "white" }}
      />
      {isLoadingDepartments ? (
        <CircularProgress size={24} sx={{ mt: 2 }} />
      ) : departmentsError ? (
        <Alert severity="error" sx={{ mt: 2 }}>Erreur lors du chargement des départements : {departmentsError.message}</Alert>
      ) : (
        <Select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ mt: 2, color: "white", '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSelect-icon': { color: 'white' } }}
          inputProps={{ "aria-label": "Département", style: { color: "white" } }}
        >
          <MenuItem value="" sx={{ color: "black" }}>Tous les départements</MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept.departmentId} value={String(dept.departmentId)} sx={{ color: "black" }}>
              {dept.displayName}
            </MenuItem>
          ))}
        </Select>
      )}
      <TextField
        label="Date de début (année)"
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
        label="Date de fin (année)"
        type="number"
        value={dateEnd}
        onChange={(e) => setDateEnd(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "white" } }}
        inputProps={{ style: { color: "white" } }}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }} disabled={displayLoading}>
        Rechercher
      </Button>

      {displayLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2, color: 'white' }}>Chargement des résultats...</Typography>
        </Box>
      )}

      {displayError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Une erreur est survenue : {displayError instanceof Error ? displayError.message : String(displayError)}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Résultats :</Typography>

        {!displayLoading && !displayError && activeSearchParams && results.length === 0 && allObjectIds.length === 0 && (
          <Typography sx={{ mt: 2, color: 'white' }}>
            Aucun résultat trouvé pour votre recherche. Essayez d'ajuster vos critères.
          </Typography>
        )}

        {!displayLoading && results.length > 0 && (
          <>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {results.map((item) => (
                <li key={item.id} style={{ marginBottom: "1rem" }}>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    <strong>{item.title}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
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
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                <MuiPagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                    },
                    '& .MuiPaginationItem-icon': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdvancedSearch;