import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Skeleton } from '@mui/material';
import { API_URL } from '../constants';

interface SearchResultCardProps {
  objectID: number;
}

interface ObjectData {
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  department: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ objectID }) => {
  const [data, setData] = useState<ObjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const res = await fetch(`${API_URL}/objects/${objectID}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Erreur fetch objet:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchObject();
  }, [objectID]);

  if (loading) {
    return (
      <Card>
        <Skeleton variant="rectangular" height={140} />
        <CardContent>
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="error">
            Impossible de charger l'objet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {data.primaryImageSmall ? (
        <CardMedia
          component="img"
          height="140"
          image={data.primaryImageSmall}
          alt={data.title}
        />
      ) : (
        <Skeleton variant="rectangular" height={140} />
      )}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {data.title || 'Titre inconnu'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.artistDisplayName || 'Artiste inconnu'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.objectDate || 'Date inconnue'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.department || ''}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
