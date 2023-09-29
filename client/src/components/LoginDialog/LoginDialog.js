import { useContext, useState } from "react";
import { loginUser } from "../../helpers/Api";
import { UserContext } from "../../helpers/UserContext";
import {
    IconButton,
    Button,
    FormHelperText,
    FormControl,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    Grid,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginDialog = ({ open, handleClose }) => {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);

    // NOTE: Text will be used to display error messages
    const [text, setText] = useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setEmailError(!emailRegex.test(email));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(email, password, setText, setUser);
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                handleClose();
                setText("");
                setEmail("");
                setPassword("");
            }}
            fullWidth
            maxWidth="sm"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ textAlign: "center", paddingBottom: 1 }}>
                    Login
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
                        <Grid item xs={12}>
                            {text && <p style={{ color: "red" }}>{text}</p>}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: "16px", justifyContent: "center" }}>
                    <Button
                        onClick={() => {
                            handleClose();
                            setText("");
                            setEmail("");
                            setPassword("");
                        }}
                        color="secondary"
                        variant="outlined"
                        sx={{
                            fontSize: "0.875rem",
                            padding: "8px 16px",
                            borderWidth: "1px",
                        }}
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
                        Login
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LoginDialog;
