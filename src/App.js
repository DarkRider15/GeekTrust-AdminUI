import "./App.css";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TableComponent from "./Component";
import EditSection from "./Editor";
import { getUsers } from "./users/getUsers";

const headers = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "actions", label: "Actions" },
];
const recordsPerPage = 10;
const startPage = 1;

function App() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(startPage);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setCount(Math.ceil(data.length / recordsPerPage));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setCount(Math.ceil(filteredUsers.length / recordsPerPage));
    setCurrentPage(startPage);
  }, [filteredUsers]);

  useEffect(() => {
    const searchUsers = (searchText) => {
      const lowerCaseSearchText = searchText.toLowerCase();
      return users.filter((user) => {
        const { name, email, role } = user;
        const lowerCaseName = name.toLowerCase();
        const lowerCaseEmail = email.toLowerCase();
        const lowerCaseRole = role.toLowerCase();
        return (
          lowerCaseName.includes(lowerCaseSearchText) ||
          lowerCaseEmail.includes(lowerCaseSearchText) ||
          lowerCaseRole.includes(lowerCaseSearchText)
        );
      });
    };

    if (searchText.length === 0) {
      setFilteredUsers(users);
      setSearchNotFound(false);
    } else {
      const results = searchUsers(searchText);
      if (results.length > 0) {
        setFilteredUsers(results);
        setSearchNotFound(false);
      } else {
        setSearchNotFound(true);
      }
    }
  }, [searchText, users]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handlePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredUsers.map((user) => user.name);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, name];
    } else {
      newSelected = selected.filter((item) => item !== name);
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.includes(name);

  const handleEdit = (userId) => {
    setEditUserId(userId);
  };

  const handleSubmit = (userId, data) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...data } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditUserId(null);
  };

  const handleCancel = () => {
    setEditUserId(null);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter((user) => !selected.includes(user.name));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  return (
    <div className="container">
      <h3 className="AdminDashboard">Admin Dashboard</h3>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Search"
          placeholder="Search by name, email or role"
          name="search"
          value={searchText}
          onChange={handleSearch}
        />
      </Box>
      {editUserId && (
        <Box m={1}>
          <EditSection
            users={users}
            userId={editUserId}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        </Box>
      )}
      {searchNotFound ? (
        <Box>
          <p>No Results Found.</p>
        </Box>
      ) : (
        <Box>
          <TableComponent
            headers={headers}
            users={filteredUsers}
            handleSelectAllClick={handleSelectAllClick}
            handleClick={handleClick}
            isSelected={isSelected}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <Box mt={2}>
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
              <Pagination
                count={count}
                showFirstButton
                showLastButton
                onChange={handlePage}
                page={currentPage}
              />
            </Stack>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default App;
