import {AppBar, Stack, Button, Toolbar, Box, TextField, IconButton, Paper, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoodIcon from "@mui/icons-material/Mood";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { quickSearch } from "../queries/quickSearch";

function CustomAppBar() {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const doSearch = async () => {
    if (!search) return;

    const data = await quickSearch(search);
    if (data.length === 0) {
      setNoResults(true);
      setResults([]);
    } else {
      setNoResults(false);
      setResults(data);
    }
    setShowDropdown(true);
  };

  const handleResultClick = (id: number) => {
    navigate(`/object/${id}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AppBar sx={{ width: "100%", position: "relative" }}>
      <Toolbar
        disableGutters
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "64px",
        }}
      >
        <img src="/watermelonIcon.png"alt="Logo"style={{ height: 60, marginLeft: 30 }}/>
        <Stack direction="row" spacing={2} sx={{ marginLeft: "20px" }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Accueil
          </Button>
          <Button variant="contained" onClick={() => navigate("/advanced-search")}>
            Recherche avancée
          </Button>
        </Stack>

        <Box
          ref={containerRef}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "white",
              borderRadius: 2,
              px: 2,
              py: 0.5,
              boxShadow: 1,
            }}
          >
            <TextField
              variant="standard"
              placeholder="Recherche rapide"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSearch();
              }}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={doSearch}>
              <SearchIcon sx={{ color: "action.active" }} />
            </IconButton>
          </Box>

          {showDropdown && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                mt: 1,
                width: 300,
                maxHeight: 300,
                overflowY: "auto",
                p: 1,
                zIndex: 1000,
              }}
              elevation={4}
            >
              {noResults ? (
                <Typography sx={{ p: 1 }}>Aucun résultat trouvé</Typography>
              ) : (
                results.map((item) => (
                  <Box
                    key={item.id}
                    className="quick-search-item"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                    onClick={() => handleResultClick(item.id)}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: 40,
                          height: 40,
                          marginRight: 8,
                          borderRadius: 4,
                        }}
                      />
                    )}
                    <Typography variant="body2">{item.title}</Typography>
                  </Box>
                ))
              )}
            </Paper>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar;
