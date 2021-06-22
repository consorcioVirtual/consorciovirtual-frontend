import React, { useEffect, useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import { StyledButtonPrimary, StyledButtonSecondary } from '../../components/Buttons'
import { useHistory, useParams } from 'react-router-dom';
import { Link, TextField, MenuItem, Divider, Box, List, ListItem } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { solicitudService } from "../../services/solicitudService";
import { usuarioService } from "../../services/usuarioService";
import { Historial } from '../../components/Historial'
import { SnackbarComponent } from '../../components/Snackbar'
import { ModalComponent } from '../../components/Modal'
import { Chevron } from '../../assets/icons';
import update from 'immutability-helper';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        marginLeft: 300,
        flexDirection: "row",
        height: "100%",
    },
    tittle: {
        textAlign: "left",
    },
    contenedorForm: {
        paddingTop: 30,
        display: "flex",
        width: "100%",
        flexDirection: "column",
        paddingRight: 50
    },
    buttonLog: {
        paddingTop: 30,
        display: "flex",
        backgroundColor: "white",
        height: "100%",
        width: "600px",
        flexDirection: "column"
    },
    link: {
        color: "#159D74",
        textAlign: "left",
        marginBottom: 20,
        cursor: "pointer",
    },
    linkModal: {
        color: "#159D74",
        textAlign: "left",
        marginLeft: 50,
        marginTop: 10,
        cursor: "pointer",
        fontWeight: 600
    },
    form: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 30
    },
    inputs: {
        backgroundColor: "white",
        textAlign: "left"
    },
    contenedorInput: {
        display: "flex",
        flexDirection: "column",
        flex: "50%",
        maxWidth: 400,
        marginBottom: 50,
    },
    contenedorInputDerecha: {
        display: "flex",
        flexDirection: "column",
        flex: "50%",
        maxWidth: 400,
        marginBottom: 50,
    },
    contenedorInputDescripcion: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 50,
        maxWidth: 1000,
    },
    span: {
        textAlign: "left",
        marginLeft: 10,
        marginBottom: 6,
        maxWidth: 600
    },
    botones: {
        display: "flex",
        marginTop: 10,
    },
    contenedorBotones: {
        display: "flex",
        flexDirection: "column",
        margin: "10px 50px"
    },
    divider: {
        marginTop: 40
    },
    inputsDisabled: {
        textAlign: "left",
        marginLeft: 10
    },
    spanDisabled: {
        textAlign: "left",
        marginLeft: 10,
        marginBottom: 6,
        color: "grey"
    },
    botonesDisabled: {
        background: "rgba(0, 0, 0 ,10%)",
    },
    chevron: {
        fontSize: "12px",
        marginRight: 8
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: "white",
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
        borderRadius: "6px",
        padding: "0 30px 32px 32px"
    },
    nroSolicitud: {
        fontSize: "15px",
        textAlign: "left",
        marginLeft: "10px",
        marginTop: "10px"
    },
    contenedorFecha: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconoFecha: {
        color: "grey",
        fontSize: 16,
        marginBottom: 6,
    },
    contenedorDescripcion: {
        width: "100%",
        display: "block"
    },
    contenedorNotas: {
        display: "block",
        textAlign: "left"
    },
    notas: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e7e7e7",
        width: "100%",
        fontSize: "14px",
        marginBottom: 15,
        marginLeft: 10,
        marginTop: 6
    },
    nota: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%"
    },
    autorNota: {
        color: "#159D74",
        fontWeight: 600,
        marginRight: 10
    },
    fechaNota: {
        color: "grey",
        display: "block"
    },
    infoNota: {
        marginLeft: 10
    }
});

const estadosDeSolicitud = [
    {
        value: 'Pendiente',
        label: 'Pendiente',
    },
    {
        value: 'Aprobado',
        label: 'Aprobado',
    }
]

const notas = [
    {
        autor: "Mariano",
        texto: "El técnico solucionó el problema",
        fecha: "16/6/2021",
        hora: "13:38 hs"
    },
    {
        autor: "Mariano",
        texto: "El técnico visitará el edificio el jueves",
        fecha: "12/6/2021",
        hora: "15:30 hs"
    }
]

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export const ABMCSolicitud = ({ edicion, creacion }) => {
    const classes = useStyles();
    const [solicitud, setSolicitud] = useState('')
    const [estado, setEstado] = useState('')
    const [titulo, setTitulo] = useState('')
    const [detalle, setDetalle] = useState('')
    const [campoEditado, setCampoEditado] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState('')
    const [mensajeSnack, setMensajeSnack] = useState()
    const [snackColor, setSnackColor] = useState()
    const [modalStyle] = useState(getModalStyle);

    let history = useHistory()
    const params = useParams()

    const fetchSolicitud = async () => {
        try {
            let unaSolicitud
            if (creacion) {
                unaSolicitud = new solicitud()
            } else {
                unaSolicitud = await solicitudService.getById(params.id)
            }
            setSolicitud(unaSolicitud)
            setEstado(unaSolicitud.nombreEstado)
            setTitulo(unaSolicitud.titulo)
            setDetalle(unaSolicitud.detalle)
        }
        catch {

        }
    }

    const actualizarValor = (event) => {
        const newState = update(solicitud, {
            [event.target.id]: { $set: event.target.value }
        })
        setSolicitud(newState)
        setCampoEditado(true)
    }

    const backToSolicitudes = () => {
        history.push("/solicitudes")
    }

    const popupModal = () => {
        setOpenModal(true)
    }

    const handleChangeType = (event) => {
        actualizarValor(event)
        setEstado(event.target.value);
    };

    useEffect(() => {
        fetchSolicitud()
    }, [])

    const crearSolicitud = async () => {
        try {
            if (validarSolicitud()) {
                await solicitudService.create(solicitud)
                history.push("/solicitudes", { openChildSnack: true })
            } else {
                usarSnack("Campos obligatorios faltantes.", true)
            }
        } catch (error) {
            usarSnack("No se puede conectar con el servidor.", true)
        }
    }

    const modificarSolicitud = async () => {
        try {
            await solicitudService.update(solicitud)
            usarSnack("Solicitud técnica modificada correctamente", false)
        } catch (errorRecibido) {
            usarSnack("No se puede conectar con el servidor.", true)
        }
    }

    const eliminarSolicitud = async () => {
        try {
            await solicitudService.delete(solicitud.id)
            backToSolicitudes()
        } catch (errorRecibido) {
            usarSnack("No se puede conectar con el servidor.", true)
        }
    }

    const validarSolicitud = () => {
        console.log(titulo + detalle)
        return titulo && detalle
    }

    const usarSnack = (mensaje, esError) => {
        if (esError) {
            setSnackColor("#F23D4F")
        } else {
            setSnackColor("#00A650")
        }
        setMensajeSnack(mensaje)
        setOpenSnackbar(true)
    }

    const bodyModal = (

        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">¿Estás seguro que querés eliminar esta solicitud técnica?</h2>
            <p id="simple-modal-description">Esta acción no se puede deshacer.</p>
            <Box display="flex" flexDirection="row" mt={4}>
                <StyledButtonPrimary onClick={eliminarSolicitud}>Eliminar solicitud técnica</StyledButtonPrimary>
                <Link className={classes.linkModal} onClick={() => setOpenModal(false)}>
                    Cancelar
                </Link>
            </Box>
        </div>
    )

    return (

        <div className={classes.root} >
            <div className={classes.contenedorForm}>
                <Link className={classes.link} onClick={backToSolicitudes}>
                    <Chevron className={classes.chevron} />
                    Volver a solicitudes técnicas
                </Link>
                {creacion &&
                    <Typography component="h2" variant="h5" className={classes.tittle}>
                        Nueva solicitud técnica
                    </Typography>
                }

                {!creacion && edicion &&
                    <Typography component="h2" variant="h5" className={classes.tittle}>
                        Modificar solicitud técnica
                    </Typography>
                }

                <form className={classes.form} noValidate autoComplete="off">
                    <div className={classes.contenedorInput}>
                        <span className={classes.spanDisabled}>Nro de solicitud técnica</span>
                        <span className={classes.nroSolicitud}>{edicion ? solicitud.id : '-'}</span>
                    </div>

                    <div className={classes.contenedorInputDerecha}>
                        <span className={classes.span} >Estado</span>
                        <TextField className={edicion ? classes.inputs : classes.inputsDisabled} id="estadoSolicitud" select disabled={creacion} onChange={handleChangeType} value={estado || ''} label={creacion ? 'Activa' : ''} variant={creacion ? 'filled' : 'outlined'} >
                            {estadosDeSolicitud.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className={classes.contenedorInput}>
                        <span className={classes.spanDisabled}>Autor</span>
                        {creacion ? <span className={classes.span}>{usuarioService.usuarioLogueado.nombre + " " + usuarioService.usuarioLogueado.apellido}</span>
                            : <span className={classes.span}>{solicitud.nombreAutor}</span>}
                    </div>

                    <div className={classes.contenedorInput}>
                        <span className={classes.spanDisabled}>Fecha</span>
                        <div className={classes.contenedorFecha}>
                            <span className={classes.span}>{edicion ? solicitud.fecha : (new Date()).toLocaleDateString()}</span>
                            {edicion && <CalendarTodayIcon className={classes.iconoFecha}></CalendarTodayIcon>}
                        </div>
                    </div>

                    <div className={classes.contenedorInput}>
                        <span className={classes.spanDisabled}>Titulo</span>
                        {edicion ? <span className={classes.span}>{solicitud.titulo}</span>
                            : <TextField className={classes.inputs} id="titulo" variant="outlined" onChange={(e) => setTitulo(e.target.value)}></TextField>}
                    </div>

                </form>

                <div className={classes.contenedorDescripcion}>
                        <div className={classes.contenedorInputDescripcion}>
                            <span className={classes.spanDisabled}>Descripción</span>
                            {edicion ? <span className={classes.span}>{solicitud.detalle}</span>
                                : <TextField className={classes.inputs} id="descripcion" variant="outlined" onChange={(e) => setDetalle(e.target.value)}></TextField>}
                        </div>
                    </div>

                {(edicion && !creacion) &&
                    <div className={classes.contenedorNotas}>
                        <span className={classes.spanDisabled}>Notas</span>

                        <List className={classes.notas} disablePadding>
                            {notas.map((nota) => { return <ListItem button className={classes.nota} divider>
                                <div>
                                    <span className={classes.autorNota}>{nota.autor}: </span>
                                    <span>{nota.texto}</span>
                                </div>
                                <div>
                                    <span className={classes.fechaNota}>{nota.fecha}</span>
                                    <Typography variant="body2" align="right">{nota.hora}</Typography>
                                </div>
                            </ListItem>})}
                        </List>
                    </div>
                }


            </div>

            <div className={classes.buttonLog}>
                {creacion &&
                    <div className={classes.contenedorBotones}>
                        <StyledButtonPrimary className={classes.botones} onClick={() => crearSolicitud()} >Crear solicitud técnica</StyledButtonPrimary>
                        <StyledButtonSecondary className={classes.botones} onClick={backToSolicitudes}>Cancelar</StyledButtonSecondary>
                    </div>
                }
                {edicion && !creacion &&
                    <div className={classes.contenedorBotones}>
                        {campoEditado &&
                            <StyledButtonPrimary className={classes.botones} onClick={modificarSolicitud}>Guardar cambios</StyledButtonPrimary>
                        }
                        {!campoEditado &&
                            <StyledButtonPrimary className={classes.botonesDisabled} disabled>Guardar cambios</StyledButtonPrimary>
                        }
                        <StyledButtonSecondary className={classes.botones} onClick={popupModal}>Eliminar solicitud</StyledButtonSecondary>
                    </div>
                }
                <Divider className={classes.divider} />

                {edicion && !creacion &&
                    <Historial usuariosHistorial={usuarioService.usuariosPrueba} />
                }

            </div>

            <SnackbarComponent snackColor={snackColor} openSnackbar={openSnackbar} mensajeSnack={mensajeSnack} handleCloseSnack={() => setOpenSnackbar(false)} />

            <ModalComponent openModal={openModal} bodyModal={bodyModal} handleCloseModal={() => setOpenModal(false)} />

        </div>

    )
}

