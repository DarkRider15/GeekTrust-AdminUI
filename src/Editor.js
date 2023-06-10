import React, { useState } from 'react';
import { Button, TextField, Stack } from '@mui/material';

export default function EditSection({ users, userId, handleSubmit, handleCancel }) {
  const [editData, setEditData] = useState(() => getUserData(users, userId));

  function getUserData(users, userId) {
    const user = users.find((user) => user.id === userId);
    return {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
    };
  }

  const handleEditData = ({ target: { name, value } }) => {
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Stack spacing={2} direction="row">
      <TextField
        variant="outlined"
        size="small"
        label="Name"
        name="name"
        value={editData.name}
        onChange={handleEditData}
      />
      <TextField
        variant="outlined"
        size="small"
        label="Email"
        name="email"
        value={editData.email}
        onChange={handleEditData}
      />
      <TextField
        variant="outlined"
        size="small"
        label="Role"
        name="role"
        value={editData.role}
        onChange={handleEditData}
      />
      <Button variant="contained" size="small" onClick={() => handleSubmit(userId, editData)}>
        Save
      </Button>
      <Button variant="contained" size="small" onClick={handleCancel}>
        Cancel
      </Button>
    </Stack>
  );
}
