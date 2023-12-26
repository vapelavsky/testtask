import React, { useState, useContext, useRef, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, useNavigate } from "react-router-dom";

import { appConfig } from "config";
import { SessionData, User } from "types";
import { Toast, ToastPropsData } from "components";
import { signup } from "services";
import { SessionContext } from "contexts";

import styles from "./signup.module.css";

export const Signup = (): JSX.Element => {
    const [user, setUser] = useState<User>({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        favColor: "",
        city: "",
    });
    const [errors, setErrors] = useState<User>({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        favColor: "",
        city: ""
    });
    const [working, setWorking] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastPropsData | null>(null);
    const session = useContext(SessionContext);
    const navigate = useNavigate();
    const signupAC = useRef<AbortController | null>(null);
    const passwordRegex = /^[^\s\t]+$/;

    useEffect(() => {
        return () => {
            if (signupAC.current) {
                signupAC.current.abort();
            }
        };
    }, []);

    const onSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        const currentErrors: User = {
            firstName: "",
            lastName: "",
            favColor: "",
            username: "",
            password: "",
            city: "",
        };

        if (!user.firstName) {
            currentErrors.firstName = "First Name is required";
        }

        if (!user.lastName) {
            currentErrors.lastName = "Last Name is required";
        }

        if (!user.favColor) {
            currentErrors.favColor = "Favorite Color is required";
        }

        if (!user.username) {
            currentErrors.username = "Username is required";
        }

        if (!user.password || !passwordRegex.test(user.password)) {
            console.log(`Invalid password: ${user.password}`);
            currentErrors.password = "Password is required";
        }

        if (!user.city) {
            currentErrors.city = "City is required";
        }

        if (
            currentErrors.firstName ||
            currentErrors.lastName ||
            currentErrors.favColor ||
            currentErrors.username ||
            currentErrors.password ||
            currentErrors.city
        ) {
            setErrors(currentErrors);
            return;
        }

        setWorking(true);

        const onSuccess = (sessionData: SessionData): void => {
            setWorking(false);
            signupAC.current = null;
            session.updateSessionData(sessionData);
            navigate(appConfig.userRoot);
        };

        const onError = (error: string | undefined): void => {
            setWorking(false);
            signupAC.current = null;
            setToastProps({
                severity: "error",
                message: error ?? "Unknown error",
                closeToast: () => {
                    setToastProps(null);
                },
            });
        };
        signupAC.current = signup(user, onSuccess, onError, onError);
    };

    return (
        <div className={styles.container}>
            <div className={styles.topSpacer} />
            <Stack spacing={2} className={styles.contentStack}>
                <Typography variant="h4" align="center">
                    Junior AI
                </Typography>
                <Typography variant="h5" align="center">
                    Registration
                </Typography>
                <form onSubmit={onSubmit}>
                    <Stack spacing={1}>
                        <TextField
                            value={user.firstName}
                            label="First Name *"
                            error={errors.firstName ? true : false}
                            helperText={errors.firstName || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            autoFocus
                            onChange={(event) => {
                                if (errors.firstName) {
                                    setErrors({ ...errors, firstName: "" });
                                }
                                setUser({
                                    ...user,
                                    firstName: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            value={user.lastName}
                            label="Last Name *"
                            error={errors.lastName ? true : false}
                            helperText={errors.lastName || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.lastName) {
                                    setErrors({ ...errors, lastName: "" });
                                }
                                setUser({
                                    ...user,
                                    lastName: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            value={user.favColor}
                            label="Favorite Color *"
                            error={errors.favColor ? true : false}
                            helperText={errors.favColor || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.favColor) {
                                    setErrors({ ...errors, favColor: "" });
                                }
                                setUser({
                                    ...user,
                                    favColor: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            value={user.username}
                            label="Username *"
                            error={errors.username ? true : false}
                            helperText={errors.username || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.username) {
                                    setErrors({ ...errors, username: "" });
                                }
                                setUser({
                                    ...user,
                                    username: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            type="password"
                            value={user.password}
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
                                setUser({
                                    ...user,
                                    password: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            type="city"
                            value={user.city}
                            label="City *"
                            error={errors.city ? true : false}
                            helperText={errors.city || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            onChange={(event) => {
                                if (errors.city) {
                                    setErrors({ ...errors, city: "" });
                                }
                                setUser({
                                    ...user,
                                    city: event.target.value,
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
                                Signup
                            </Button>
                            <br />
                            <Typography>
                                Already have an account?{" "}
                                <Link to={`${appConfig.rootPath}`}>Login!</Link>
                            </Typography>
                        </div>
                    </Stack>
                </form>
            </Stack>
            {toastProps ? <Toast data={toastProps} /> : null}
        </div>
    );
};
