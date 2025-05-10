import {
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography, Container, IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {APP_BAR_HEIGHT} from "../utils/constants.js";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import ChecklistIcon from '@mui/icons-material/Checklist';
import RestaurantIcon from '@mui/icons-material/Restaurant';
export default function FoodNav() {

    // drawer gets in the way on smaller screens
    const [open, setOpen] = useState(window.innerWidth>1200)
    const navigate = useNavigate();
    const drawerWidth = 300;

    return (
        <>
            {!open
                &&
            <IconButton
                sx={{position:"fixed", left:23,zIndex:1}}
                onClick={()=>setOpen(true)}>
                <ArrowForwardIosIcon></ArrowForwardIosIcon>
            </IconButton>
            }
        <Drawer
            variant="persistent"
            open={open}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    //render under appbar
                    top: APP_BAR_HEIGHT,
                    height: `calc(100% - ${APP_BAR_HEIGHT})`
                },
            }}
        >
            <Box sx={{ p:".8rem",pl:"1.2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <Typography variant="h6" >
                    Food
                </Typography>
                <IconButton onClick={() => setOpen(false)}>
                    <ArrowBackIcon></ArrowBackIcon>
                </IconButton>
            </Box>


            <List>
                {/*<ListItemButton*/}
                {/*    onClick={() => navigate('/recipes')}*/}
                {/*>*/}
                {/*    <ListItemIcon>*/}
                {/*        <MenuBookIcon />*/}
                {/*    </ListItemIcon>*/}
                {/*    <ListItemText primary="All Recipes" />*/}
                {/*</ListItemButton>*/}

                <Divider sx={{mb:".8rem"}}></Divider>

                <ListItemButton
                    onClick={() => navigate('/recipes')}
                >
                    <ListItemIcon>
                        <RestaurantIcon/>
                    </ListItemIcon>
                    <ListItemText primary="View Recipes" />
                </ListItemButton>
                <ListItemButton
                    onClick={() => navigate('/recipes/create')}
                >
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Create Recipe" />
                </ListItemButton>

                <ListItemButton
                    onClick={() => navigate('/ingredients/create')}
                >
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Create ingredient" />
                </ListItemButton>



                <Divider sx={{my:".8rem"}}></Divider>

                <ListItemButton
                    onClick={() => navigate('/mealplans')}
                >
                    <ListItemIcon>
                        <ChecklistIcon/>
                    </ListItemIcon>
                    <ListItemText primary="View Meal Plans" />
                </ListItemButton>
                <ListItemButton
                    onClick={() => navigate('/mealplans/create')}
                >
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Create a Meal Plan" />
                </ListItemButton>
                <Divider sx={{my:".8rem"}}></Divider>
            </List>

        </Drawer>

            </>
    )
}