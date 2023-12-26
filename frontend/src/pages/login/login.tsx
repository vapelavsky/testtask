import React, { useState, useContext, useRef, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";

import { appConfig } from "config";
import { LoginData, SessionData, NavigationFrom } from "types";
import { Toast, ToastPropsData } from "components";
import { login } from "services";
import { SessionContext } from "contexts";

import styles from "./login.module.css";

export const Login = (): JSX.Element => {
    const [loginData, setLoginData] = useState<LoginData>({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginData>({
        username: "",
        password: "",
    });
    const [working, setWorking] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastPropsData | null>(null);
    const session = useContext(SessionContext);
    const location = useLocation();
    const navigate = useNavigate();
    const loginAC = useRef<AbortController | null>(null);

    let gotoAfterLogin = "/user";
    let replaceLocationInRouter = false;

    if (
        location.state &&
        NavigationFrom.isInstance(location.state) &&
        location.state.location
    ) {
        gotoAfterLogin =
            location.state.location.pathname +
            location.state.location.search +
            location.state.location.hash;
        replaceLocationInRouter = true;
    }

    useEffect(() => {
        return () => {
            if (loginAC.current) {
                loginAC.current.abort();
            }
        };
    }, []);

    const onSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        const currentErrors: LoginData = {
            "username": "",
            "password": "",
        }

        if (!loginData.username) {
            currentErrors.username = "Username is required";
        }

        if (!loginData.password) {
            currentErrors.password = "Password is required";
        }

        if (currentErrors.username || currentErrors.password) {
            setErrors(currentErrors);
            return;
        }

        setWorking(true);

        const onSuccess = (sessionData: SessionData): void => {
            setWorking(false);
            loginAC.current = null;
            session.updateSessionData(sessionData);
            navigate(gotoAfterLogin, { replace: replaceLocationInRouter });
        };

        const onError = (error: string | undefined): void => {
            setWorking(false);
            loginAC.current = null;
            setToastProps({
                severity: "error",
                message: error ?? "Unknown error",
                closeToast: () => {
                    setToastProps(null);
                },
            });
        };
        loginAC.current = login(loginData, onSuccess, onError, onError);
    };

    if (session.sessionData) {
        if (gotoAfterLogin) {
            return <Navigate to={gotoAfterLogin} replace />;
        } else {
            return <Navigate to={appConfig.userRoot} replace />;
        }
        
    }

    return (
        <div className={styles.container}>
            <div className={styles.topSpacer} />
            <Stack spacing={2} className={styles.contentStack}>
                <Typography variant="h4" align="center">
                    Junior AI
                </Typography>
                <Typography variant="h5" align="center">
                    Login
                </Typography>
                <form onSubmit={onSubmit}>
                    <Stack spacing={1}>
                        <TextField
                            value={loginData.username}
                            label="Username *"
                            error={errors.username ? true : false}
                            helperText={errors.username || " "}
                            InputProps={{
                                readOnly: working,
                            }}
                            autoFocus
                            onChange={(event) => {
                                if (errors.username) {
                                    setErrors({ ...errors, username: "" });
                                }
                                setLoginData({
                                    ...loginData,
                                    username: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            type="password"
                            value={loginData.password}
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
                                setLoginData({
                                    ...loginData,
                                    password: event.target.value,
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
                                Login
                            </Button>
                            <br />
                            <Typography>
                                Dont' have an account?{" "}
                                <Link to={`${appConfig.rootPath}signup`}>
                                    Signup!
                                </Link>
                            </Typography>
                            <Typography>
                                <Link to={`${appConfig.rootPath}reset-password`}>
                                    Forgot password?
                                </Link>
                            </Typography>
                        </div>
                    </Stack>
                </form>
            </Stack>
            {toastProps ? <Toast data={toastProps} /> : null}
        </div>
    );
};