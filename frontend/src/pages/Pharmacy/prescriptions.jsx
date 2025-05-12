import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Slide,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { API_URL, PHARMACY_API_URL } from '../../utils/constants';
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
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedDrugId, setSelectedDrugId] = useState("");
  const [unassignedDrugs, setUnassignedDrugs] = useState([]);
  const [newDrug, setNewDrug] = useState([]);
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
        credentials: 'include'
      });
      const pharmacyData = await pharmacyRes.json();
      const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;
      if (!pharmacyId) return;

      const drugsRes = await fetch(`${PHARMACY_API_URL}/pharmacies/drugs?pharmacyId=${pharmacyId}`, {
        credentials: 'include'
      });

      const drugData = await drugsRes.json();
      setPrescriptions(drugData);

    } catch (err) {
      console.error("Error loading prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchPrescriptions();
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

    const qty = Number(newQuantity);
    if (isNaN(qty) || qty < 0) {
      alert("Quantity must be a non-negative number.");
      return;
    }

    try {
      await fetch(`${PHARMACY_API_URL}/pharmacies/drugs/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pharmacyId: selectedPill.pharmacy.id,
          drugId: selectedPill.drug.id,
          quantity: qty,
          dispensed: false
        })
      });

      await fetchPrescriptions();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update inventory:', err);
    }
  };

  const handleDispense = async (pill) => {
    try {
      await fetch(`${PHARMACY_API_URL}/pharmacies/drugs/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pharmacyId: pill.pharmacy.id,
          drugId: pill.drug.id,
          quantity: pill.inventory,
          dispensed: true
        })
      });

      await fetch(`${API_URL}/dispenselog/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pharmacyId: pill.pharmacy.id,
          drugId: pill.drug.id,
          quantity: pill.inventory
        })
      });

      await fetchPrescriptions();
    } catch (err) {
      console.error('Failed to mark as dispensed:', err);
    }
  };

  const openPillHistory = async (pill) => {
    setSelectedPill(pill);

    try {
      const res = await fetch(`${API_URL}/dispenselog/dispense-history?pharmacyId=${pill.pharmacy.id}&drugId=${pill.drug.id}`, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch dispense history.');
      }

      const data = await res.json();
      setHistoryData(data);
      setOpenHistory(true);
    } catch (err) {
      console.error("Error fetching dispense history:", err);
    }
  };

  const handleOpenAddDrug = async () => {
    setOpenAddDialog(true);
    setNewDrug({ name: '', description: '', dosage: '', price: '', image: '', quantity: '' });

    try {
      const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
        credentials: 'include'
      });
      const pharmacyData = await pharmacyRes.json();
      const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;

      const res = await fetch(`${API_URL}/pharmacies/unassigned?pharmacyId=${pharmacyId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setUnassignedDrugs(data);
    } catch (err) {
      console.error("Error fetching unassigned drugs:", err);
    }
  };

  const handleAddDrug = async () => {
    const { quantity } = newDrug;
    if (!selectedDrugId || !quantity) {
      alert('Please select a drug and specify quantity.');
      return;
    }

    try {
      const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
        credentials: 'include'
      });
      const pharmacyData = await pharmacyRes.json();
      const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;

      await fetch(`${API_URL}/pharmacies/assign-drug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pharmacyId,
          drugId: parseInt(selectedDrugId),
          quantity: quantity,
          dispensed: false
        })
      });

      setOpenAddDialog(false);
      await fetchPrescriptions();
    } catch (err) {
      console.error("Error adding new drug:", err);
      alert("Failed to add drug.");
    }
  };

  if (loading) {
    return <Container sx={{ mt: 4 }}><Typography>Loading prescriptions...</Typography></Container>;
  }

  if (!prescriptions.length) {
    return (
        <Container sx={{ mt: 4 }}>
      <Typography>No prescriptions found for this pharmacy.</Typography>
          <Box
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 999,
              }}
          >
            <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '50%',
                  minWidth: 64,
                  width: 64,
                  height: 64,
                  boxShadow: 6,
                  fontSize: 32,
                  p: 0,
                }}
                onClick={handleOpenAddDrug}
            >
              <AddIcon fontSize="inherit" />
            </Button>
          </Box>

          <Dialog
              open={openAddDialog}
              onClose={() => setOpenAddDialog(false)}
              TransitionComponent={Transition}
          >
            <DialogTitle>Add New Drug</DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <FormControl fullWidth margin="dense" variant="filled">
                <InputLabel id="drug-select-label">Select Drug</InputLabel>
                <Select
                    labelId="drug-select-label"
                    value={selectedDrugId}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const drug = unassignedDrugs.find((d) => d.id === id);
                      setSelectedDrugId(id);
                      if (drug) {
                        setNewDrug({
                          name: drug.name,
                          description: drug.description,
                          dosage: drug.dosage,
                          price: drug.price,
                          image: drug.image,
                          quantity: "", // default empty quantity
                        });
                      }
                    }}
                    variant={"filled"}>
                  {unassignedDrugs.map((drug) => (
                      <MenuItem key={drug.id} value={drug.id}>
                        {drug.name} — {drug.dosage}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                  margin="dense"
                  label="Quantity"
                  type="number"
                  fullWidth
                  variant="filled"
                  value={newDrug.quantity || ""}
                  onChange={(e) =>
                      setNewDrug((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  inputProps={{ min: 0 }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
              <Button
                  variant="contained"
                  onClick={handleAddDrug}
                  disabled={!selectedDrugId || !newDrug.quantity}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
    </Container>
  );
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
                    <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={() => handleDispense(pill)} disabled={pill.dispensed}>
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

        {/* Floating Add Button */}
        <Box
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 999,
            }}
        >
          <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: '50%',
                minWidth: 64,
                width: 64,
                height: 64,
                boxShadow: 6,
                fontSize: 32,
                p: 0,
              }}
              onClick={handleOpenAddDrug}
          >
            <AddIcon fontSize="inherit" />
          </Button>
        </Box>

        {/* Modify Quantity Dialog */}
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
                inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveQuantity} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Dispense History Dialog */}
        <Dialog open={openHistory} onClose={() => setOpenHistory(false)} TransitionComponent={Transition}>
          <DialogTitle>History for {selectedPill?.drug?.name}</DialogTitle>
          <DialogContent>
            <List>
              {historyData.map((entry, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={`${entry.quantity} pills`} secondary={`Date: ${entry.dispensedAt}`} />
                  </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHistory(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add New Drug Dialog */}
        <Dialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            TransitionComponent={Transition}
        >
          <DialogTitle>Add New Drug</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <FormControl fullWidth margin="dense" variant="filled">
              <InputLabel id="drug-select-label">Select Drug</InputLabel>
              <Select
                  labelId="drug-select-label"
                  value={selectedDrugId}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const drug = unassignedDrugs.find((d) => d.id === id);
                    setSelectedDrugId(id);
                    if (drug) {
                      setNewDrug({
                        name: drug.name,
                        description: drug.description,
                        dosage: drug.dosage,
                        price: drug.price,
                        image: drug.image,
                        quantity: "", // default empty quantity
                      });
                    }
                  }}
               variant={"filled"}>
                {unassignedDrugs.map((drug) => (
                    <MenuItem key={drug.id} value={drug.id}>
                      {drug.name} — {drug.dosage}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
                margin="dense"
                label="Quantity"
                type="number"
                fullWidth
                variant="filled"
                value={newDrug.quantity || ""}
                onChange={(e) =>
                    setNewDrug((prev) => ({ ...prev, quantity: e.target.value }))
                }
                inputProps={{ min: 0 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button
                variant="contained"
                onClick={handleAddDrug}
                disabled={!selectedDrugId || !newDrug.quantity}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default Prescriptions;