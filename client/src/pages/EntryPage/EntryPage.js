import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import LoginDialog from "../../components/LoginDialog/LoginDialog";
import RegisterDialog from "../../components/RegisterDialog/RegisterDialog";

const EntryPage = () => {
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

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
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5">Welcome to smApp Demo</Typography>

                    <Box mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleLoginDialogOpen}
                        >
                            Log In
                        </Button>
                        <LoginDialog
                            open={loginDialogOpen}
                            handleClose={handleLoginDialogClose}
                        />

                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            style={{ marginTop: "20px" }}
                            onClick={handleRegisterDialogOpen}
                        >
                            Register
                        </Button>
                        <RegisterDialog
                            open={registerDialogOpen}
                            handleClose={handleRegisterDialogClose}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default EntryPage;
