import React, { useEffect, useContext } from 'react';
import { Avatar, TextField, FormControlLabel, Checkbox, Link, Paper, Grid, Box, Typography } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { useState } from 'react'
import Logo from '../assets/logo.png'
import LogoCV from '../assets/logoconsov3.svg'
import { StyledButtonPrimary } from '../components/Buttons'
import Fondo from '../assets/new-background.svg'
import { SnackbarComponent } from '../components/Snackbar.js';
import useAuth from '../hooks/UseAuth.js';
import Solicitudes from '../assets/images/Solicitudes.png'
import Documentos from '../assets/images/Documentos.png'
import Inquilinos from '../assets/images/Inquilinos.png'
import Expensas from '../assets/images/Expensas.png'
import Gastos from '../assets/images/Gastos.png'
import Chat from '../assets/images/Chat.png'
import { UserContext } from '../hooks/UserContext';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100vh"
  },
  image: {
    display: "flex",
    width:"100%",
    backgroundImage: `url(${Fondo})`,
    backgroundColor: "#F5F5F5",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: "1px -2px -1px 3px black",
    flexGrow: "2",
    [theme.breakpoints.down("sm")]: {
      justifyContent:"center"
    },
  },
  footer: {
    position: "fixed",
    paddingBottom: ".5rem",
    width: "100%",
    bottom: "0",
    display: "flex",
    justifyContent: "space-around",
    height: "fit-content",
    flexGrow: "0",
    backgroundColor: "#ffffffc7",
    boxShadow: "inset 0px 0px 4px 0px black",
    [theme.breakpoints.down("sm")]: {
      display:"none"
    },
  },
  paper: {
    margin: theme.spacing(20, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: "1.4rem",
    maxWidth: "400px",
    maxHeigth: "100px!important",
    opacity: "none",


  },
  avatar: {
    margin: theme.spacing(0),
    width: "4rem",
    height: "4rem",
    backgroundColor: "#159D74",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: theme.spacing(1),
      height:"100%"
    },
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
  },
  container: {
    borderRadius: "5px",
    maxHeight: "700px",
    boxShadow: "0px 0px 8px 1px rgba(0,0,0,0.50)",
    display: "flex",
    alignItems: "center",
    margin: "30px 180px 20px 0px",
    justifyContent:"flex-end",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1),
      alignSelf:"center",
      justifySelf:"center",
    },
    [theme.breakpoints.down("lg")]: {
      maxHeight: "580px",
    },
  },
  bold: {
    fontWeight: 500,
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.60)",
    textAlign: "center"
  },
  contenedorIcono: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "250px",
    paddingTop: 15
  },
  inputForm: {
    marginBottom: "2rem"
  },
  textoLogo: {
    position: 'fixed',
    left: '12rem',
    top: '3rem',
    fontSize: '2.5rem',
  },
  logoCV: {
    width: "30rem",
    [theme.breakpoints.down("sm")]: {
      display:"none"
    },
  },
  slogan: {
    left: '12.3rem',
    top: '24rem',
    fontSize: '2.4rem',
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  textoLogin: {
    color: "#159D74",
  },
  logoPaper:{
    display:"none",
    [theme.breakpoints.down("sm")]: {
      width: "15rem",
      display:"flex",
    },
  },
  logoContainer:{
    display:"flex",
    flexDirection:"column",
    marginTop: 200,
    marginLeft:150,
    paddingRight: 20,
    flex:"50%",
    [theme.breakpoints.down("sm")]: {
      display:"none"
    },
  }

}));

export const Login = () => {
  const [correo, setCorreo] = useState(window.localStorage.getItem("mailLogged") || "")
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [mensajeSnack, setMensajeSnack] = useState('')
  const { user, setUser } = useContext(UserContext);
  const [errors, setErrors] = useState({})

  let history = useHistory()
  const classes = useStyles();
  const { loginUser } = useAuth();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (window.localStorage.getItem('mailLogged')) {
      setRemember(true)
    }

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setCorreo(user.correo)
      setPassword(user.password)
    }

    setUser(null)

  }, [])


  const handleRememberStorage = () => {
    if (remember) {
      window.localStorage.setItem('mailLogged', correo)
    } else {
      window.localStorage.removeItem('mailLogged')
    }
  }

  const redirectTypeUser = (user) => {
    if (user.tipo === "Propietario" || user.tipo === "Inquilino") {
      history.push("/departamentos")
    } else {
      history.push('/usuarios')
    }
  }

  const validarLogin = () => {
    setErrors(null)

    if (!correo) {
      setErrors(prev => ({ ...prev, correo: "Campo obligatorio" }))
    }

    if (!password) {
      setErrors(prev => ({ ...prev, password: "Campo obligatorio" }))
    }

    return correo && password
  }


  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      if (validarLogin()) {
        const logueado = await loginUser(correo, password)
        handleRememberStorage()
        redirectTypeUser(logueado)
      } else {
        usarSnack("Campos obligatorios faltantes.", true)
      }
    } catch (e) {
      console.log(e.message)
      usarSnack("Usuario o contraseña incorrectos.")
    }
  }

  const handleChange = (event) => {
    setRemember(event.target.checked);
  };

  const usarSnack = (message) => {
    setOpenSnackbar(true)
    setMensajeSnack(message)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.image} >

        <div className={classes.logoContainer}>
          <div className="logo-login animate__animated animate__fadeIn">
            <img src={LogoCV} className={classes.logoCV} alt="Logo"/>
          </div>
          <div className="slogan-login animate__animated animate__fadeIn">
            <span className={classes.slogan}>Una <b>nueva experiencia</b> en la gestión de tu consorcio.</span>
          </div>
        </div>

        <Box className={classes.container} component={Paper}>
          <div className={classes.paper} >
            <img src={LogoCV} className={classes.logoPaper} alt="Logo"/>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <span className={classes.textoLogin}>Ingresá a la aplicación</span>

            <form className={classes.form}>
              <TextField
                className={classes.inputForm}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electronico"
                autoComplete="email"
                autoFocus
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                error={Boolean(errors?.correo)}
                helperText={errors?.correo}
              />
              <TextField
                className={classes.inputForm}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors?.password)}
                helperText={errors?.password}
              />
              <FormControlLabel
                control={<Checkbox value={remember} checked={remember} onChange={handleChange} color="primary" />}
                label="Recordarme"
              />
              <StyledButtonPrimary
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={handleLogin}
              >
                Ingresar
              </StyledButtonPrimary>
            </form>
          </div>
        </Box>
      </Box>
      <Box className={classes.footer}>

        <Box className={classes.contenedorIcono}>
          <img src={Documentos} alt="Documentos"></img>
          <span className={classes.bold}>Accedé a los anuncios y la documentacion.</span>
        </Box>

        <Box className={classes.contenedorIcono}>
          <img src={Solicitudes} alt="Solicitudes"></img>
          <span className={classes.bold}>Realizá reclamos y solicitudes tecnicas.</span>
        </Box>

        <Box className={classes.contenedorIcono}>
          <img src={Gastos} alt="Gastos"></img>
          <span className={classes.bold}>Consultá los gastos del mes.</span>
        </Box>

        <Box className={classes.contenedorIcono}>
          <img src={Expensas} alt="Expensas"></img>
          <span className={classes.bold}>Pagá tus expensas.</span>
        </Box>

        <Box className={classes.contenedorIcono}>
          <img src={Inquilinos} alt="Inquilinos"></img>
          <span className={classes.bold}>Gestioná tus inquilinos.</span>
        </Box>

        <Box className={classes.contenedorIcono}>
          <img src={Chat} alt="Chat"></img>
          <span className={classes.bold}>Chateá con tus vecinos.</span>
        </Box>

      </Box>
      <SnackbarComponent snackColor={"#F23D4F"} openSnackbar={openSnackbar} mensajeSnack={mensajeSnack} handleCloseSnack={() => setOpenSnackbar(false)} />
    </Box>


  );
}