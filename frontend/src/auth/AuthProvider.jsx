import {useEffect, useState} from "react"
import {UserContext} from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom';
import {API_URL} from '../utils/constants.js';
import theme from '../theme.js';
import {CssBaseline, ThemeProvider} from "@mui/material";
import NavBar from '../NavBar.jsx';


export default function Auth({children, notRequired}) {
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
                setUser(await res.json());
                // setLoading(false);
            } else {
                !notRequired && navigate('/signin', {replace: true})
                setLoading(false);
            }
        }

        run();
    }, [notRequired]);

    //right now this runs every mount :/
    useEffect(() => {
        async function fetchRoleData() {
            if (!user) return
            let url = ""
            if (user.role === "PATIENT") {
                url = API_URL + `/patients?userId=${user.id}`
            } else if (user.role === "DOCTOR") {
                url = API_URL + `/doctors?userId=${user.id}`
            } else if (user.role === "PHARACIST") {
                url = API_URL + `/pharmacists?userId=${user.id}`
            } else {
                throw new Error("Role undefined")
            }
            const res = await fetch(url, {
                credentials: 'include'
            })

            if (res.status === 200) {
                setRoleData(await res.json());
            }
            setLoading(false);
        }

        fetchRoleData();
    }, [user]);

    return (
        <UserContext.Provider value={{user, roleData, loading}}>
            <ThemeProvider theme={theme} defaultMode={"light"}>
                <CssBaseline/>
                <NavBar/>
                {children}
            </ThemeProvider>
        </UserContext.Provider>
    )
}