import { Typography, makeStyles } from '@material-ui/core';
import React, { useState, useContext } from 'react'
import { TextField, List, ListItem, Button, IconButton } from '@material-ui/core';
import { UserContext } from '../hooks/UserContext';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { StyledButtonPrimary } from './Buttons';

const useStyles = makeStyles((theme) => ({
    tittle: {
        textAlign: "left",
        marginTop: 20
    },
    spanDisabled: {
        textAlign: "left",
        marginLeft: 10,
        marginBottom: 10,
        color: "grey"
    },
    contenedorNotas: {
        display: "block",
        textAlign: "left"
    },
    textoNoHayNotas: {
        textAlign: "left",
        marginLeft: 25,
        marginBottom: 6,
        marginTop: 10,
        color: "grey"
    },
    notas: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e7e7e7",
        width: "100%",
        fontSize: "14px",
        marginBottom: 15, 
        marginLeft: 10,
        marginTop: 6,
        borderRadius: 2
    },
    nota: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        cursor: "default",
        borderRadius: 2
    },
    inputNota: {
        width: "100%",
        marginRight: "16px"
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
    },
    seccionDerecha: {
        display: "flex",
        alignItems: "center",
        gap: 8
    },
    botonEliminarNota: {
        backgroundColor: "#c3c3c387"
    }
}));

export const Notas = ({ notas, setCampoEditado, update, puedeAgregarNotas }) => {
    const classes = useStyles();
    const [textoNota, setTextoNota] = useState('')
    const [textoInvalido, setTextoInvalido] = useState(false)
    const {user, setUser} = useContext(UserContext);

    const agregarNota = () => {
        if (textoNota) {
            let nota = {
                autor: user.nombre,
                texto: textoNota
            }
            notas.push(nota)
            setCampoEditado(true)
            setTextoNota('')
            setTextoInvalido(false)
        } else {
            setTextoInvalido(true)
        }
     }

    const escribirNota = (event) => {
        setTextoNota(event.target.value);
    };

    const eliminarNota = (notaAEliminar) => {
        notas.splice(notas.indexOf(notaAEliminar), 1)
        notas = notas.filter(nota => nota !== notaAEliminar)
        update(notas)
        setCampoEditado(true)
    }

    return (
        <div className={classes.contenedorNotas}>
            <span className={classes.spanDisabled}>Notas</span>

            {notas.length === 0 &&
                <Typography className={classes.textoNoHayNotas} variant="body2">Aún no hay notas</Typography>
            }

            <List className={classes.notas} disablePadding>
                {notas.map((nota) => {
                    return <ListItem button className={classes.nota} divider>
                        <div>
                            <span className={classes.autorNota}>{nota.autor}: </span>
                            <span>{nota.texto}</span>
                        </div>
                        <div className={classes.seccionDerecha}>
                            <div>
                            <span className={classes.fechaNota}>{nota.fechaHora ? (new Date(nota.fechaHora)).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                            <Typography variant="body2" align="right">{nota.fechaHora ? (new Date(nota.fechaHora)).toLocaleTimeString().replace(/(.*)\D\d+/, '$1') : new Date().toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}</Typography>
                            </div> 
                            {user.tipo === 'Administrador_consorcio' && <IconButton className={classes.botonEliminarNota} onClick={() => eliminarNota(nota)}><DeleteForeverSharpIcon color="error"></DeleteForeverSharpIcon></IconButton> }
                        </div>
                    </ListItem>
                })}
                {puedeAgregarNotas &&
                    <ListItem button divider>
                        <TextField 
                        error={textoInvalido} 
                        className={classes.inputNota} 
                        size="small" 
                        id="nota" 
                        name="nota" 
                        label="Escriba una nota" 
                        value={textoNota} 
                        variant="outlined" 
                        onChange={escribirNota}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                agregarNota()
                            }}}
                        ></TextField>
                        <StyledButtonPrimary onClick={agregarNota}>Agregar</StyledButtonPrimary>
                    </ListItem>
                }
            </List>
        </div>
    )
}

