import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ForgotPasswordData, TokenData } from "types";
import { useNavigate } from "react-router-dom";
import { Toast, ToastPropsData } from "components";
import { forgotPassword } from "services";

import styles from "./forgot-password.module.css";

export const ForgotPassword = (): JSX.Element => {
    const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordData>({
        username: "",
    });
    const [errors, setErrors] = useState<ForgotPasswordData>({
        username: "",
    });
    const [working, setWorking] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastPropsData | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        setWorking(true);

        const onSuccess = (data: TokenData): void => {
            setWorking(false);
            let token = data.token;  
            navigate(`/reset?token=${token}`)
        };

        const onError = (error: string | undefined): void => {
            setWorking(false);
            setToastProps({
                severity: "error",
                message: error ?? "Unknown error",
                closeToast: () => {
                    setToastProps(null);
                },
            });
        }
        forgotPassword(forgotPasswordData, onSuccess, onError, onError);
    };

    
    return (
        <div className={styles.container}>
            <div className={styles.topSpacer} />
            <Stack spacing={2} className={styles.contentStack}>
                <Typography variant="h4" align="center">
                    Junior AI
                </Typography>
                <Typography variant="h5" align="center">
                    Enter your username
                </Typography>
                <form onSubmit={onSubmit}>
                    <Stack spacing={1}>
                        <TextField
                            type="username"
                            value={forgotPasswordData.username}
                            label="username *"
                            error={errors.username ? true : false}
                            helperText={errors.username || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.username) {
                                    setErrors({ ...errors, username: "" });
                                }
                                setForgotPasswordData({
                                    ...forgotPasswordData,
                                    username: event.target.value,
                                });
                            }}
                        />
                        <div className={styles.centeredContent}>
                            <Button
                                color="secondary"
                                variant="contained"
                                type="submit"
                                fullWidth={false}
                                size="medium"
                                disabled={working}
                            >
                                Submit
                            </Button>
                            <br />
                        </div>
                    </Stack>
                </form>
            </Stack>
            {toastProps ? <Toast data={toastProps} /> : null}
        </div>
    );
};