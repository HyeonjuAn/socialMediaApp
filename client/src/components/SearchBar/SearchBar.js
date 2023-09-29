import { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { searchUsers, searchPosts } from "../../helpers/Api";

const SearchBar = ({ setPosts, setUsers, setHasSearched, setIsLoading }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef(null);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async (event) => {
        // Prevent the default behavior of the form submit
        event.preventDefault();
        setHasSearched(true);
        setIsLoading(true);
        try {
            const data = await searchPosts(searchTerm);
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
        try {
            const data = await searchUsers(searchTerm);
            setUsers(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
        inputRef.current.blur();
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: 20,
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            }}
        >
            <form onSubmit={handleSearch} style={{ width: "70%" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for a post or user..."
                    value={searchTerm}
                    onChange={handleChange}
                    inputRef={inputRef}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        borderRadius: "2rem",
                        "& fieldset": {
                            borderRadius: "2rem",
                        },
                    }}
                />
            </form>
        </div>
    );
};

export default SearchBar;
