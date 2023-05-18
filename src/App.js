import './App.css';
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
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
  const [dataToBeDisplayed, setDataToBeDisplayed] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userEdit, setUserEdit] = useState(-1);

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setCount(Math.ceil(data.length / recordsPerPage));
        setDataToBeDisplayed(prepareDataToBeDisplayed(data, startPage));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setCount(Math.ceil(filteredUsers.length / recordsPerPage));
    setCurrentPage(startPage);
    setDataToBeDisplayed(prepareDataToBeDisplayed(filteredUsers, startPage));
  }, [filteredUsers]);

  useEffect(() => {
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
  }, [searchText]);

  const prepareDataToBeDisplayed = (userList, pageNumber) => {
    setSelectAll(false);
    setSelected([]);
    const endIndex = pageNumber * recordsPerPage;
    const startIndex = endIndex - recordsPerPage;
    return userList.slice(startIndex, endIndex);
  };

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

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handlePage = (event, value) => {
    setCurrentPage(value);
    setSelectAll(false);
    setDataToBeDisplayed(prepareDataToBeDisplayed(filteredUsers, value));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dataToBeDisplayed.map((n) => n.name);
      setSelectAll(true);
      setSelected(newSelected);
    } else {
      setSelectAll(false);
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
    setIsEdit(true);
    setUserEdit(userId);
  };

  const handleSubmit = (userId, data) => {
    const newData = users.map((user) => {
      if (user.id === userId) {
        return {
          id: userId,
          name: data.name,
          email: data.email,
          role: data.role,
        };
      }
      return user;
    });

    setUsers(newData);
    setFilteredUsers(newData);
    setIsEdit(false);
    setUserEdit(-1);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserEdit(-1);
  };

  const handleDelete = (userId) => {
    const newData = users.filter((user) => user.id !== userId);
    setUsers(newData);
    setFilteredUsers(newData);
  };

  const handleDeleteSelected = () => {
    const newData = users.filter((user) => !selected.includes(user.name));
    setUsers(newData);
    setFilteredUsers(newData);
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
      {isEdit && (
        <Box m={1}>
          <EditSection
            users={users}
            userId={userEdit}
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
            users={dataToBeDisplayed}
            handleSelectAllClick={handleSelectAllClick}
            handleClick={handleClick}
            isSelected={isSelected}
            selectAll={selectAll}
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
