import React, { useEffect, useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import { Tabla, StyledTableRow, StyledTableCell } from '../../components/Tabla';
import { Busqueda } from '../../components/Busqueda'
import { useHistory } from 'react-router-dom';
import { anuncioService } from '../../services/anuncioService';
import { StyledButtonPrimary } from '../../components/Buttons'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        marginLeft: 300,
        marginTop: 30,
        marginRight: 50,
        flexDirection: "column"
    },
    tittle: {
        textAlign: "left",
    },
    contenedorBusqueda: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 20
    },
    cantidadObject: {
        fontWeight: 300,
        marginRight: 10
    }
});

const headers = [
    { id: "fechaCreacion", label: "Fecha" },
    { id: "titulo", label: "Titulo" },
    { id: "nombreAutor", label: "Autor" },
    { id: "fechaModificacion", label: "Actividad" },
    { id: "fechaVencimiento", label: "Vencimiento" }
]

const ColumnasCustom = (dato) => {

    let history = useHistory()

    const getAnuncio = (id) => {
        history.push(`/anuncio/${id}`)
    }

    return (
        <StyledTableRow key={dato.id} onClick={() => getAnuncio(dato.id)} className="pointer">
            <StyledTableCell component="th" scope="row">
                <div className="contenedorColumna">
                    <span className="tableBold">{dato.fecha}</span>
                    <span>{dato.fechaCreacion}</span>
                </div>
            </StyledTableCell>
            <StyledTableCell className="tableNormal" component="th" scope="row">{dato.titulo}</StyledTableCell>
            <StyledTableCell className="tableNormal" component="th" scope="row">{dato.nombreAutor}</StyledTableCell>
            <StyledTableCell className="tableNormal" component="th" scope="row">Modificado hace {Math.floor(Math.random() * 10)} horas</StyledTableCell>
            <StyledTableCell className="tableBold" component="th" scope="row">{dato.fechaVencimiento}</StyledTableCell>
        </StyledTableRow>)
}

export const Anuncios = () => {
    const classes = useStyles();
    const [anuncios, setAnuncios] = useState([])
    let history = useHistory()

    const fetchAllAnuncios = async (textoBusqueda) => {
        const anunciosEncontrados = await anuncioService.getAllAnuncios(textoBusqueda)
        setAnuncios(anunciosEncontrados)
    }

    const newAnuncio = () => {
        history.push("/newAnuncio")
    }

    useEffect(() => {
        fetchAllAnuncios("")
    }, [])

    return (
        <div className={classes.root} >
            <Typography component="h2" variant="h5" className={classes.tittle}>
                Anuncios
            </Typography>
            <div className={classes.contenedorBusqueda}>
                <Busqueda holder="Buscá por fecha, título o autor" busqueda={fetchAllAnuncios} />
                <div>
                    <span className={classes.cantidadObject} > {anuncios.length} anuncios </span>
                    <StyledButtonPrimary onClick={newAnuncio}>Agregar anuncio</StyledButtonPrimary>
                </div>
            </div>
            <Tabla datos={anuncios} headers={headers} ColumnasCustom={ColumnasCustom} heightEnd={90} defaultSort={"id"} defaultOrder={"desc"} />
        </div>

    )
}