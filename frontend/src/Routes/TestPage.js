import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';

function TestPage() {
    return (
        <div>
            <h1>This is the page for testing shit.</h1>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={8}>
                <Paper>
                  Item 1
                </Paper>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Paper>
                  Item 2
                </Paper>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Paper>
                  Item 3
                </Paper>
              </Grid>
              <Grid xs={12} sm={6} md={8}>
                <Paper>
                  Item 4
                </Paper>
              </Grid>
            </Grid>
        </div>
    )
}


export default TestPage