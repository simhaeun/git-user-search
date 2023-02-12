import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import { Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import User from "./Pages/User";

function App() {
  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <IconButton>
            <GitHubIcon sx={{color: 'white', marginRight: '20px'}}/>
          </IconButton>
          <Typography variant='h6' component='div'>
            GitHub Search Engine
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{maxWidth: '1000px', margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/user/:username" element={<User/>}/>
          {/* <Route path="*" element={<Navigator to="/" />}/> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
