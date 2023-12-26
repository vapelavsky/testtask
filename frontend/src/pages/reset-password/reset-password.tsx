import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PasswordChangeStatus, ResetPasswordData } from "types";
import { Toast, ToastPropsData } from "components";
import { resetPassword } from "services";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styles from "./reset-password.module.css";


export const ResetPassword = (): JSX.Element => {
    const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordData>({
        password: "",
        confirmPassword: "",
        token: "",
    });
    const [errors, setErrors] = useState<ResetPasswordData>({
        password: "",
        confirmPassword: "",
        token: "",
    });
    const [working, setWorking] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastPropsData | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const passwordRegex = /^[^\s\t]+$/;

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        setWorking(true);

        if (resetPasswordData.password !== resetPasswordData.confirmPassword){
            setToastProps({
                severity: "error",
                message: "Passwords mismatch",
                closeToast: () => {
                    setToastProps(null);
                },
            });
            setWorking(false);
            return
        }

        if (!passwordRegex.test(resetPasswordData.password) || !passwordRegex.test(resetPasswordData.confirmPassword)) {
            setToastProps({
                severity: "error",
                message: "Password is blank, don't try to break this project!",
                closeToast: () => {
                    setToastProps(null);
                },
            });
            setWorking(false);
            return
        }

        if (!resetPasswordData.password || !resetPasswordData.confirmPassword){
            setToastProps({
                severity: "error",
                message: "Field(s) is empty",
                closeToast: () => {
                    setToastProps(null);
                },
            });
            setWorking(false);
            return
        }

        if (!searchParams.get("token")){
            setToastProps({
                severity: "error",
                message: "No token",
                closeToast: () => {
                    setToastProps(null);
                },
            });
            setWorking(false);
            return
        }

        const onSuccess = (data: PasswordChangeStatus): void => {
            setWorking(false);
            if (data.status === "ok"){
                navigate("/")
            }
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
        const token = searchParams.get("token")
        resetPassword({...resetPasswordData, token}, onSuccess, onError, onError);
    };

    
    return (
        <div className={styles.container}>
            <div className={styles.topSpacer} />
            <Stack spacing={2} className={styles.contentStack}>
                <Typography variant="h4" align="center">
                    Junior AI
                </Typography>
                <Typography variant="h5" align="center">
                    Enter your new password
                </Typography>
                <form onSubmit={onSubmit}>
                    <Stack spacing={1}>
                        <TextField
                            type="password"
                            value={resetPasswordData.password}
                            label="Password *"
                            error={errors.password ? true : false}
                            helperText={errors.password || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.password) {
                                    setErrors({ ...errors, password: "" });
                                }
                                setResetPasswordData({
                                    ...resetPasswordData,
                                    password: event.target.value,
                                });
                            }}
                        />
                         <TextField
                            type="password"
                            value={resetPasswordData.confirmPassword}
                            label="Confirm password *"
                            error={errors.confirmPassword ? true : false}
                            helperText={errors.confirmPassword || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.confirmPassword) {
                                    setErrors({ ...errors, confirmPassword: "" });
                                }
                                setResetPasswordData({
                                    ...resetPasswordData,
                                    confirmPassword: event.target.value,
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
