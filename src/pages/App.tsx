import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomAppBar from '../components/CustomAppBar'
import { useQuery } from '@tanstack/react-query'
import { getHighlightedObjects } from '../queries/objects'
import { Card, CardContent, Grid, Typography } from '@mui/material'

function App() {
  const { data, refetch } = useQuery({queryKey: ["get_highlighted_objects"], queryFn: getHighlightedObjects})

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <CustomAppBar/>
      <Grid container spacing={2} direction="column">
        {data && data?.map(value => (
          <Grid size={8}>
            <Card>
              <CardContent>
                <Typography >{value?.title}</Typography >
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <h1>Vite + React</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
