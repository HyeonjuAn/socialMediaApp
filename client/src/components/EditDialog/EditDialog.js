import { useContext, useState } from "react";
import { UserContext } from "../../helpers/UserContext";
import { Dialog } from "@mui/material";

const EditDialog = ({ open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}></form>
        </Dialog>
    );
};

export default EditDialog;
