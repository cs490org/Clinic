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
import {APP_BAR_HEIGHT} from "../../utils/constants.js";
import MenuBookIcon from '@mui/icons-material/MenuBook';
export default function RecipeNav() {

    // drawer gets in the way on smaller screens
    const [open, setOpen] = useState(window.innerWidth>1200)
    const navigate = useNavigate();
    const drawerWidth = 300;

    return (
        <>
            {!open
                &&
            <IconButton
                sx={{position:"fixed", left:23,zIndex:10000}}
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
                    Recipes
                </Typography>
                <IconButton onClick={() => setOpen(false)}>
                    <ArrowBackIcon></ArrowBackIcon>
                </IconButton>
            </Box>

            <Divider />

            <List>
                {/*<ListItemButton*/}
                {/*    onClick={() => navigate('/recipes')}*/}
                {/*>*/}
                {/*    <ListItemIcon>*/}
                {/*        <MenuBookIcon />*/}
                {/*    </ListItemIcon>*/}
                {/*    <ListItemText primary="All Recipes" />*/}
                {/*</ListItemButton>*/}

                <ListItemButton
                    onClick={() => navigate('/recipes/create')}
                >
                    <ListItemIcon>
                        <MenuBookIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Create Recipe" />
                </ListItemButton>

                <ListItemButton
                    onClick={() => navigate('/ingredients/create')}
                >
                    <ListItemIcon>
                        <AddCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create ingredient" />
                </ListItemButton>
            </List>

            <Divider />
        </Drawer>

            </>
    )
}