import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const EditButton = ({ text, handleEditClick }) => {
    return (
        <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
                borderRadius: "4px",
            }}
            onClick={handleEditClick}
        >
            {text}
        </Button>
    );
};

export default EditButton;
