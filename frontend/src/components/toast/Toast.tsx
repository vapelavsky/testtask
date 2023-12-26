import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { AlertColor } from "@mui/material/Alert";

import { appConfig } from "config";

export interface ToastPropsData {
    severity: AlertColor;
    message: string;
    closeToast: () => void;
}

interface ToastProps {
    data: ToastPropsData;
}

export const Toast = (props: ToastProps): JSX.Element => {
    const onSnackbarClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        props.data.closeToast();
    };

    return (
        <Snackbar
            open={true}
            autoHideDuration={appConfig.toastTimeoutMS}
            onClose={onSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <MuiAlert
                onClose={onSnackbarClose}
                elevation={6}
                variant="filled"
                severity={props.data.severity}
                sx={{ width: "100%" }}
            >
                {props.data.message}
            </MuiAlert>
        </Snackbar>
    );
};
