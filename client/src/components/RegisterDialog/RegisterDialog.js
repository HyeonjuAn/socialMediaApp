import { registerUser } from "../../helpers/Api";
import { useState } from "react";
import {
    IconButton,
    Button,
    FormControl,
    FormHelperText,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    Grid,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ImagePreview from "../ImagePreview/ImagePreview";

const RegisterDialog = ({ open, handleClose }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);

    // NOTE: Text will be used to display error messages
    const [text, setText] = useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setEmailError(!emailRegex.test(email));
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setImage(URL.createObjectURL(event.target.files[0]));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("image", file);

        registerUser(formData, setText);
        setEmail("");
        setUsername("");
        setPassword("");
        setFile(null);
        setImage(null);
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                handleClose();
                setText("");
                setEmail("");
                setUsername("");
                setPassword("");
                setFile(null);
                setImage(null);
            }}
            fullWidth
            maxWidth="sm"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ textAlign: "center", paddingBottom: 1 }}>
                    Register
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <Grid container spacing={3} sx={{ padding: 2 }}>
                        <Grid item xs={12}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: emailError ? "red" : null,
                                    },
                                }}
                            >
                                <InputLabel
                                    htmlFor="email-input"
                                    sx={{ color: emailError ? "red" : null }}
                                >
                                    Email
                                </InputLabel>
                                <OutlinedInput
                                    id="email-input"
                                    value={email}
                                    onChange={handleEmailChange}
                                    label="Email"
                                    sx={{
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: emailError ? "red" : null,
                                        },
                                    }}
                                />
                                {emailError && (
                                    <FormHelperText sx={{ color: "red" }}>
                                        Invalid email format
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="username-input">Username</InputLabel>
                                <OutlinedInput
                                    id="username-input"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    label="Username"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={password}
                                    onChange={handlePasswordChange}
                                    label="Password"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <input
                                id="image-input"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            {image && (
                                <ImagePreview
                                    image={image}
                                    clearImage={() => {
                                        setFile(null);
                                        setImage(null);
                                    }}
                                />
                            )}
                            <label htmlFor="image-input">
                                <IconButton color="primary" component="span">
                                    <AddPhotoAlternateIcon fontSize="large" />
                                </IconButton>
                                <span
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        marginLeft: 1,
                                        color: "primary.main",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    Set Profile Picture
                                </span>
                            </label>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: "16px", justifyContent: "center" }}>
                    <Button
                        onClick={() => {
                            handleClose();
                            setText("");
                            setEmail("");
                            setUsername("");
                            setPassword("");
                            setFile(null);
                            setImage(null);
                        }}
                        sx={{
                            fontSize: "0.875rem",
                            padding: "8px 16px",
                            borderWidth: "1px",
                        }}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={handleSubmit}
                        sx={{
                            fontSize: "0.875rem",
                            padding: "8px 16px",
                        }}
                    >
                        Register
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RegisterDialog;
