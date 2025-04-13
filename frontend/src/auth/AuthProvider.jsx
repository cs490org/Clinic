import {useEffect, useState} from "react"
import {UserContext} from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom';
import {API_URL} from '../utils/constants.js';
import theme from '../theme.js';
import {CssBaseline, ThemeProvider, Typography} from "@mui/material";
import NavBar from '../NavBar.jsx';
import Box from "@mui/material/Box";

export default function Auth({children, notRequired, allowedRoles}) {
    const navigate = useNavigate();

    const [user, setUser] = useState();
    const [roleData, setRoleData] = useState()
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        async function run() {
            const res = await fetch(API_URL + '/user', {
                credentials: 'include'
            })

            if (res.status === 200) {
                const userData = await res.json();
                setUser(userData);

                // Check role-based access if allowedRoles is specified
                if (allowedRoles && !allowedRoles.includes(userData.role)) {
                    navigate('/', {replace: true});
                }
            } else {
                !notRequired && navigate('/signin', {replace: true})
                setLoading(false);
            }
        }

        run();
    }, [notRequired]);

    useEffect(() => {
        async function fetchRoleData() {
            if (!user) return
            let url = ""
            if (user.role === "PATIENT") {
                url = API_URL + `/patients?userId=${user.id}`
            } else if (user.role === "DOCTOR") {
                url = API_URL + `/doctors?userId=${user.id}`
            } else if (user.role === "PHARMACIST") {
                url = API_URL + `/pharmacists?userId=${user.id}`
            } else {
                throw new Error("Role undefined")
            }
            const res = await fetch(url, {
                credentials: 'include'
            })

            if (res.status === 200) {
                const roleData = await res.json()
                setRoleData(roleData)

            } else if (res.status === 404) {
                if (user.role === "PATIENT") {
                    navigate('/patient/complete-profile')
                } else if (user.role === "DOCTOR") {
                    navigate('/doctor/complete-profile')
                } else if (user.role === "PHARMACIST") {
                    navigate('/pharmacist/complete-profile')
                }
            } else {
                throw new Error("Role data fetch failed")
            }
            setLoading(false);
        }

        fetchRoleData();
    }, [user]);

    // we dont have auth data yet
    const LoadingScreen = () => {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                p: 4

            }}>
                <Box
                    sx={{
                        animation: 'float 3s ease-in-out infinite',
                        maxWidth: '200px'
                    }}
                >
                    <img
                        style={{
                            width: '100%',
                            display: 'block'
                        }}
                        src="chips.png"
                        alt="Weight loss journey"
                    />
                    <style>
                        {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-30px); }
                100% { transform: translateY(0px); }
              }
            `}
                    </style>
                </Box>
                <Typography textAlign={"center"} fontSize={"1.5rem"} fontWeight={"bold"} gutterBottom> Our servers
                    are
                    loading...</Typography>
                <Typography fontSize={".7rem"} sx={{color: "text.secondary"}}>Did you forget to run the
                    backend?</Typography>
            </Box>
        )
    }
    return (
        <UserContext.Provider value={{user, roleData, loading}}>
            <ThemeProvider theme={theme} defaultMode={"light"}>
                <CssBaseline/>
                {loading ? <LoadingScreen/>
                    :
                    <>
                        <NavBar/>
                        {children}
                    </>
                }
            </ThemeProvider>
        </UserContext.Provider>
    )
}
