import { useEffect, useState } from "react"
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants.js';
import theme from '../theme.js';
import { CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from '../NavBar.jsx';

export default function Auth({ children, notRequired }) {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    async function run() {
      const res = await fetch(API_URL + '/user', {
        credentials: 'include'
      })

      if (res.status == 200) {
        setUser(await res.json());
        setLoading(false);
      } else {
        !notRequired && navigate('/signin', { replace: true })
        setLoading(false);
      }
    }

    run();
  }, [notRequired]);

  return (
    <UserContext.Provider value={{ user: user, loading: loading }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        {children}
      </ThemeProvider>
    </UserContext.Provider>
  )
}