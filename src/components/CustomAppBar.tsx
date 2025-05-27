import { AppBar, Stack, Button, Toolbar, Box, TextField, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MoodIcon from '@mui/icons-material/Mood';
import { useEffect, useState } from "react";

function customAppBar() {
    const [search, setSearch] = useState<string>("");

    const doSearch = () => {
        // TODO Fill with some behavior
    }


    return(
        <AppBar sx={{width: "100%"}}>
            <Toolbar disableGutters sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start"}}>
                <MoodIcon sx={{ml: 4}}/>
                <Stack direction="row" spacing={2} sx={{marginLeft: "20px"}}>
                    <Button variant="contained">Home</Button>
                    <Button variant="contained">Advanced Search</Button>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton aria-label="search" onClick={doSearch}>
                        <SearchIcon sx={{ color: 'action.active'}}/>
                    </IconButton>
                    <TextField id="input-with-sx" label="With sx" variant="standard" value={search} onChange={(e) => setSearch(e.target.value)}/>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default customAppBar;