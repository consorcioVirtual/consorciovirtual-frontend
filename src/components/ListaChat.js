
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import { horaYMinutos, soloFecha } from '../utils/formats'; 
import { chatService } from '../services/chatService';

//SE TIENE QUE BORRAR
const iDusuarioHardcodeado = 1

const useStyles = makeStyles ({
    root: {
        height: "50vh",
        backgroundColor: "rgb(232, 232, 232)",
        marginTop: "37px",
        display: "flex",
        flexDirection: "column-reverse",
        padding: "30px 20px",
      },
    mensajePropio: {
        display: "flex",
        flexDirection: "row-reverse",
        padding: "10px"
    },
    mensajePropioInterno: {
        backgroundColor: "#159D74",
        padding: "13px 16px",
        borderRadius: "8px 8px 0 8px",
        marginLeft: "10px",
        color: "white"
    },
    mensajeAjeno: {
        padding: "10px"
        
    },
    mensajeAjenoInterno: {
        display: "flex",
    },
    mensajeAjenoNombre:{
        color: "#159D74",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "8px"
    },
    mensajeAjenoMensaje:{
        backgroundColor: "white",
        padding: "13px 16px",
        borderRadius: "0 8px 8px 8px",
        marginRight: "10px"
    },
    mensajeAjenoFechaHora: {
        fontSize: "0.9rem",
        paddingTop: "3px",
        color: "grey"
    },
    mensajeAjenoHora: {
        fontWeight: "bold"
    }
})

export const ListaChat = ({mensajesFiltrados}) => {
    const classes = useStyles();
    const [mensajes,setMensajes] = useState('')
    const [idUsuario,setIdUsuario] = useState('')

    const getMensajes = async () => {
        let listaMensajes = await chatService.getMensajes()
        console.log(listaMensajes)
        setMensajes(listaMensajes)
    }
 
    const mensajeBloque = (mensaje) => {
        //SE TIENE QUE LIGAR CON EL ID DE USUARIO POSTA
        return iDusuarioHardcodeado == mensaje.idEmisor? 
            <div className={classes.mensajePropio}>
                <span className={classes.mensajePropioInterno}>{mensaje.mensaje}</span>
                <span className={classes.mensajeAjenoFechaHora}>
                    <div>{soloFecha(mensaje.fechaHora)}</div>
                    <div className={classes.mensajeAjenoHora}>{horaYMinutos(mensaje.fechaHora)} hs</div>
                </span>
            </div>
        :    
            <div className={classes.mensajeAjeno}>
                <div className={classes.mensajeAjenoNombre}>{mensaje.nombreEmisor}</div>
                <div className={classes.mensajeAjenoInterno}>
                    <span className={classes.mensajeAjenoMensaje}>{mensaje.mensaje}</span>
                    <span className={classes.mensajeAjenoFechaHora}>
                        <div>{soloFecha(mensaje.fechaHora)}</div>
                        <div className={classes.mensajeAjenoHora}>{horaYMinutos(mensaje.fechaHora)} hs</div>
                    </span> 
                </div>
            </div>       
    } 
    
    useEffect( ()  =>  {
        getMensajes()
    })

    return (
        <div className={classes.root}>
            { mensajes && mensajes.map( mensaje => mensajeBloque(mensaje))
            }
        </div>
    )
}