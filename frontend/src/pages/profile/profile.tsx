import React, { useState, useContext, useRef, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { User } from "types";
import { Toast, ToastPropsData, RequireSession } from "components";
import { userGet, userUpdate } from "services";
import { SessionContext } from "contexts";

import styles from "./profile.module.css";

export const Profile = (): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [loadErrorMessage, setLoadErrorMessage] = useState<string>("");

    const [errors, setErrors] = useState<User>({
        firstName: "",
        lastName: "",
        username: "",
        favColor: "",
        city: "",
    });
    const [working, setWorking] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastPropsData | null>(null);
    const session = useContext(SessionContext);
    const loadAC = useRef<AbortController | null>(null);
    const saveAC = useRef<AbortController | null>(null);

    useEffect(() => {
        const onSuccess = (user: User): void => {
            loadAC.current = null;
            setUser(user);
            setLoadErrorMessage("");
        };

        const onError = (error: string | undefined): void => {
            loadAC.current = null;
            setUser(null);
            setLoadErrorMessage(`Error loading user (${error})`);     
        };

        loadAC.current = userGet(onSuccess, onError, onError);

        return () => {
            if (loadAC.current) {
                loadAC.current.abort();
            }
            if (saveAC.current) {
                saveAC.current.abort();
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
            city: ""
        };

        if (!user?.firstName) {
            currentErrors.firstName = "First Name is required";
        }

        if (!user?.lastName) {
            currentErrors.lastName = "Last Name is required";
        }

        if (!user?.favColor) {
            currentErrors.favColor = "Favorite Color is required";
        }

        if (!user?.username) {
            currentErrors.username = "Username is required";
        }

        if (!user?.city) {
            currentErrors.city = "City is required";
        }

        if (
            currentErrors.firstName ||
            currentErrors.lastName ||
            currentErrors.favColor ||
            currentErrors.username ||
            currentErrors.city
        ) {
            setErrors(currentErrors);
            return;
        }

        setWorking(true);

        const onSuccess = (updatedUser: User): void => {
            setWorking(false);
            saveAC.current = null;
            if (session.sessionData) {
                session.updateSessionData({
                    ...session.sessionData,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    username: updatedUser.username,
                });
            }
            setUser(updatedUser);
            setToastProps({
                severity: "success",
                message: "Changes saved successfully",
                closeToast: () => {
                    setToastProps(null);
                },
            });
        };

        const onError = (error: string | undefined): void => {
            setWorking(false);
            saveAC.current = null;
            setToastProps({
                severity: "error",
                message: error ?? "Unknown error",
                closeToast: () => {
                    setToastProps(null);
                },
            });
        };
        saveAC.current = userUpdate(user!, onSuccess, onError, onError);
    };

    return (
        <RequireSession>
            <div className={styles.container}>
                <div className={styles.topSpacer} />
                <Stack spacing={2} className={styles.contentStack}>
                    <Typography variant="h4" align="center">
                        Junior AI
                    </Typography>
                    <Typography variant="h5" align="center">
                        My Profile
                    </Typography>
                    {user && (
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
                                        Save
                                    </Button>
                                </div>
                            </Stack>
                        </form>
                    )}
                    {!loadErrorMessage && !user && (
                        <Typography align="center">
                            Loading...
                        </Typography>   
                    )}
                    {loadErrorMessage && (
                        <Typography align="center">
                            {loadErrorMessage}
                        </Typography>
                    )}
                </Stack>
                {toastProps ? <Toast data={toastProps} /> : null}
            </div>
        </RequireSession>
    );
};
