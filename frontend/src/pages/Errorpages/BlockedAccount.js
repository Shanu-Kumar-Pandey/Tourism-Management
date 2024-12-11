import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block'; 


function BlockedAccount() {
  const navigate = useNavigate();

  return (
    <div className="blocked-account-container " style={{ marginTop:140}}>
      <BlockIcon style={{ fontSize: 80, color: 'red' }} />
      <h2>Your account has been blocked</h2>
      <p>
        Your account has been blocked due to some reason. Please contact the admin for further details.
      </p>
      <p>
        Admin email: <a href="mailto:projectljtourism@gmail.com">projectljtourism@gmail.com</a>
      </p>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go back to home
      </Button>
    </div>
  );
}

export default BlockedAccount;
