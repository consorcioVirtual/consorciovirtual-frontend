import { Typography, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { TextField, List, ListItem, Button } from '@material-ui/core';
import { usuarioService } from "../services/usuarioService";

const useStyles = makeStyles((theme) => ({
    tittle: {
        textAlign: "left",
        marginTop: 20
    },
    spanDisabled: {
        textAlign: "left",
        marginLeft: 10,
        marginBottom: 6,
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
        marginTop: 6
    },
    nota: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%"
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
    }
}));

export const Notas = ({ notas, dato, setCampoEditado }) => {
    const classes = useStyles();
    const [textoNota, setTextoNota] = useState('')
    const [textoInvalido, setTextoInvalido] = useState(false)

    const agregarNota = () => {
        if (textoNota) {
            let nota = {
                autor: usuarioService.usuarioLogueado.nombre,
                texto: textoNota,
                fechaHora: new Date()
            }
            dato.notas.push(nota)
            setTextoNota('')
            setCampoEditado(true)
            setTextoInvalido(false)
        } else {
            setTextoInvalido(true)
        }
    }

    const escribirNota = (event) => {
        setTextoNota(event.target.value);
    };

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
                        <div>
                            <span className={classes.fechaNota}>{(new Date(nota.fechaHora)).toLocaleDateString()}</span>
                            <Typography variant="body2" align="right">{(new Date(nota.fechaHora)).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}</Typography>
                        </div>
                    </ListItem>
                })}
                {usuarioService.usuarioLogueado.tipo === "Administrador_consorcio" &&
                    <ListItem button divider>
                        <TextField error={textoInvalido} className={classes.inputNota} size="small" id="nota" name="nota" label="Escriba una nota" value={textoNota} variant="outlined" onChange={escribirNota}></TextField>
                        <Button size="small" variant="outlined" onClick={agregarNota}>Agregar</Button>
                    </ListItem>
                }
            </List>
        </div>
    )
}

