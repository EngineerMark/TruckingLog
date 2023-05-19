import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import { Box, Button, Card, CardContent, CardHeader, Container, CssBaseline, Grid, Paper, Stack, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import moment from 'moment';
import { useEffect, useState } from 'react';

let darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundImage: 'url("img/bg.jpg")',
        },
      }),
    },
  }
});

const MyMapsUrl = "https://www.google.com/maps/d/embed?mid=";
const YoutubeUrl = "https://www.youtube.com/embed/";

function App() {
  const [trips, setTrips] = useState([]);
  const [totalLengthKm, setTotalLengthKm] = useState(0);
  const [totalLengthMi, setTotalLengthMi] = useState(0);
  const [averageLengthKm, setAverageLengthKm] = useState(0);
  const [averageLengthMi, setAverageLengthMi] = useState(0);

  useEffect(()=>{
    (async()=>{
      const res = await fetch('Trips.json');
      const data = await res.json();
      setTrips(data);
    })();
  }, []);

  useEffect(() => {
    setTotalLengthKm(Math.round(trips.reduce((a, b) => a + (b.game === 'ets2' ? b.length : b.length * 0.621371), 0)));
    setTotalLengthMi(Math.round(trips.reduce((a, b) => a + (b.game === 'ets2' ? b.length * 1.60934449789 : b.length), 0)));

    setAverageLengthKm(Math.round(trips.reduce((a, b) => a + (b.game === 'ets2' ? b.length : b.length * 0.621371), 0) / trips.length));
    setAverageLengthMi(Math.round(trips.reduce((a, b) => a + (b.game === 'ets2' ? b.length * 1.60934449789 : b.length), 0) / trips.length));
  }, [trips]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container width='80%' sx={{ py: 5 }}>
        <Card>
          <CardHeader title="ATS & ETS2 Trips" />
          <CardContent>
            <Typography variant="body1" color="text.secondary" sx={{ pb: 1 }}>
              Total trips: {trips.length},
              Distance: {totalLengthKm.toLocaleString('en-US')}km / {totalLengthMi.toLocaleString('en-US')}mi,
              Average: {averageLengthKm.toLocaleString('en-US')}km / {averageLengthMi.toLocaleString('en-US')}mi
            </Typography>
            <Grid container spacing={2}>
              {trips.map((trip, index) => (
                <Grid item xs={4}>
                  <Paper elevation={30} key={index}>
                    <Box sx={{ p: 2 }}>
                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="h6" sx={{ fontSize: '16px' }} color="text.secondary">{trip.start} - {trip.end}</Typography>
                        <Typography variant="body2" color="text.secondary">{trip.length} {trip.game === 'ets2' ? 'km' : 'mi'}</Typography>
                        <Tooltip title={trip.date ? moment(trip.date).format('MMMM Do YYYY') : 'No date available'} placement="top">
                          <Typography variant="body2" color="text.secondary">{
                            trip.date ? `${moment(trip.date).fromNow()}` : 'No date available'
                          }</Typography>
                        </Tooltip>
                        <Stack direction="row" spacing={1}>
                          <Button color="error" startIcon={<YouTubeIcon />} variant="contained" href={'https://www.youtube.com/watch?v=' + trip.yt_timelapse} target="_blank" fullWidth>Timelapse</Button>
                          {
                            trip.yt_raw ? <Button color="error" startIcon={<YouTubeIcon />} variant="contained" href={'https://www.youtube.com/watch?v=' + trip.yt_raw} target="_blank" fullWidth>Original</Button> : '' 
                          }
                        </Stack>
                      </Stack>
                    </Box>
                    <Box sx={{
                      height: '255px',
                      overflow: 'hidden',
                      width: '100%',
                    }}>
                      <Box sx={{
                        position: 'abs',
                        height: 'calc(255px+46px)',
                        overflow: 'hidden',
                        display: 'inline-block',
                        width: '100%',
                        bottom: '-46px',
                      }}>
                        <iframe
                          title={trip.start + " - " + trip.end}
                          src={MyMapsUrl + trip.map}
                          width="100%"
                          style={{
                            border: 0, top: '-46px', bottom: '-16px', height: 'calc(255px + 46px + 16px)', position: 'relative',
                            borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'
                          }}
                          allowFullScreen=""
                          loading="lazy"
                        ></iframe>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
