import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Paper,
} from '@mui/material';
import { BorderColorOutlined as BorderColorOutlinedIcon, DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';

export default function TableComponent({
  headers,
  users,
  handleSelectAllClick,
  handleClick,
  isSelected,
  selectAll,
  handleEdit,
  handleDelete,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                onClick={handleSelectAllClick}
                checked={selectAll}
              />
            </TableCell>
            {headers.map((header) => (
              <TableCell key={header.id} sx={{ fontWeight: 1000 }}>
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ ...(isSelected(user.name) && { backgroundColor: '#D3D3D3' }) }}
              onClick={(event) => handleClick(event, user.name)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isSelected(user.name)}
                  onClick={(event) => handleClick(event, user.name)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEdit(user.id)}>
                  <BorderColorOutlinedIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(user.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
