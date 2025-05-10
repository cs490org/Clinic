import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, Button, CardMedia,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Slide, Fab, List, ListItem, ListItemText
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getColorDot = (qty) => {
  if (qty === 0) return "🔴";
  if (qty < 10) return "🟡";
  return "🟢";
};

const Prescriptions = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPill, setSelectedPill] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [openHistory, setOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    async function run() {
      try {
        const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
          credentials: 'include'
        });
        const pharmacyData = await pharmacyRes.json();
        const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;
        if (!pharmacyId) return;

        const drugsRes = await fetch(`${API_URL}/pharmacies/drugs?pharmacyId=${pharmacyId}`, {
          credentials: 'include'
        });

        const drugData = await drugsRes.json();
        setPrescriptions(drugData);
      } catch (err) {
        console.error("Error loading prescriptions:", err);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [user]);

  const handleOpenDialog = (pill) => {
    setSelectedPill(pill);
    setNewQuantity(pill.inventory);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPill(null);
    setNewQuantity('');
  };

  const handleSaveQuantity = async () => {
    if (!selectedPill) return;

    try {
      await fetch(`${API_URL}/pharmacies/inventory`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pharmacyId: selectedPill.pharmacyId,
          drugId: selectedPill.drugId,
          quantity: Number(newQuantity)
        })
      });

      setPrescriptions(prev =>
        prev.map(p =>
          p.id === selectedPill.id
            ? { ...p, inventory: Number(newQuantity) }
            : p
        )
      );
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update inventory:', err);
    }
  };

  const handleDispense = (id) => {
    console.log(`Mark pill ${id} as dispensed`);
    // update backend & history optionally
  };

  const openPillHistory = (pill) => {
    // Dummy logic for now – simulate per-pill dispense history
    const mock = [
      { quantity: 2, date: "2025-05-09" },
      { quantity: 1, date: "2025-05-07" },
    ];
    setSelectedPill(pill);
    setHistoryData(mock);
    setOpenHistory(true);
  };

  if (loading) {
    return <Container sx={{ mt: 4 }}><Typography>Loading prescriptions...</Typography></Container>;
  }

  if (!prescriptions.length) {
    return <Container sx={{ mt: 4 }}><Typography>No prescriptions found for this pharmacy.</Typography></Container>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Prescription Inventory</Typography>

      <Box display="flex" gap={2} mb={2}>
        <Typography><span style={{ color: "green" }}>🟢</span> Enough</Typography>
        <Typography><span style={{ color: "orange" }}>🟡</span> Low (&lt; 10)</Typography>
        <Typography><span style={{ color: "red" }}>🔴</span> Out of Stock</Typography>
      </Box>

      <Grid container spacing={4}>
        {prescriptions.map((pill) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pill.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={pill.drug?.image}
                alt={pill.drug?.name}
                sx={{ objectFit: 'contain', p: 1 }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{pill.drug?.name}</Typography>
                <Typography variant="body2">{pill.drug?.description}</Typography>
                <Typography variant="body2"><strong>Dosage:</strong> {pill.drug?.dosage}</Typography>
                <Typography variant="body2"><strong>Price:</strong> ${pill.drug?.price}</Typography>
                <Typography variant="body2">
                  <strong>Quantity:</strong> {pill.inventory} {getColorDot(pill.inventory)}
                </Typography>
                <Typography variant="body2" color={pill.dispensed ? 'green' : 'warning.main'} fontWeight="bold">
                  <strong>Status:</strong> {pill.dispensed ? 'Dispensed' : 'Not Dispensed'}
                </Typography>
              </CardContent>
              <Box px={2} pb={2}>
                <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={() => handleDispense(pill.id)}>
                  Mark as Dispensed
                </Button>
                <Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => handleOpenDialog(pill)}>
                  Modify Quantity
                </Button>
                <Button variant="text" fullWidth onClick={() => openPillHistory(pill)}>
                  See Dispense History
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modify Quantity */}
      <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
        <DialogTitle>Modify Quantity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Quantity"
            type="number"
            fullWidth
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveQuantity} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Pill History */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} TransitionComponent={Transition}>
        <DialogTitle>History for {selectedPill?.drug?.name}</DialogTitle>
        <DialogContent>
          <List>
            {historyData.map((entry, i) => (
              <ListItem key={i}>
                <ListItemText primary={`${entry.quantity} pills`} secondary={`Date: ${entry.date}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Prescriptions;
