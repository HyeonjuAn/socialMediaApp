import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useState, useContext } from "react";
import { UserContext } from "../../helpers/UserContext";
import { Link } from "react-router-dom";
import RegisterDialog from "../RegisterDialog/RegisterDialog";
import LoginDialog from "../LoginDialog/LoginDialog";
import ProfileMenuButton from "../ProfileMenuButton/ProfileMenuButton";

const Navbar = () => {
    const { user } = useContext(UserContext);
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    const handleLoginDialogOpen = () => {
        setLoginDialogOpen(true);
    };

    const handleLoginDialogClose = () => {
        setLoginDialogOpen(false);
    };

    const handleRegisterDialogOpen = () => {
        setRegisterDialogOpen(true);
    };

    const handleRegisterDialogClose = () => {
        setRegisterDialogOpen(false);
    };

    return (
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" fontWeight="fontWeightBold">
                        LOGO
                    </Typography>
                </Link>
                <div style={{ flexGrow: 1 }}></div>
                {user ? (
                    <ProfileMenuButton />
                ) : (
                    <>
                        <Button
                            variant="contained"
                            onClick={handleLoginDialogOpen}
                            sx={{
                                margin: 1,
                                backgroundColor: (theme) => theme.palette.background.default,
                                color: (theme) => theme.palette.text.primary,
                            }}
                        >
                            Log in
                        </Button>
                        <LoginDialog
                            open={loginDialogOpen}
                            handleClose={handleLoginDialogClose}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleRegisterDialogOpen}
                            sx={{
                                margin: 1,
                                borderColor: (theme) => theme.palette.text.primary,
                                color: (theme) => theme.palette.text.primary,
                            }}
                        >
                            Register
                        </Button>
                        <RegisterDialog
                            open={registerDialogOpen}
                            handleClose={handleRegisterDialogClose}
                        />
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
