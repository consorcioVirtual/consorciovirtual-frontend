import React, { useEffect, useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import { Tabla, StyledTableRow, StyledTableCell } from '../../components/Tabla';
import { Busqueda } from '../../components/Busqueda'
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { anuncioService } from '../../services/anuncioService';
import { StyledButtonPrimary } from '../../components/Buttons'
import { SnackbarComponent } from '../../components/Snackbar'
import useSnack from '../../hooks/UseSnack';
import { RootBox, SearchBox } from '../../components/Contenedores';
import { fechaYaPaso, soloFecha } from '../../utils/formats';
import { SearchWithoutResults } from '../../components/SearchWithoutResults';

const useStyles = makeStyles({
    cantidadObject: {
        fontWeight: 300,
        marginRight: 10
    },
    past:{
        background: "green"
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

    const anuncioVencido = (fecha) =>{
        return fechaYaPaso(fecha)
    }

    return (
        <StyledTableRow key={dato.id} onClick={() => getAnuncio(dato.id)} className="pointer" style={anuncioVencido(dato.fechaVencimiento)? {background: "#F5F5F5", boxShadow: "0px 1px 2px rgb(0 0 0 / 10%)"} : {}}>
            <StyledTableCell component="th" scope="row">
                <div className="contenedorColumna">
                    <span>{soloFecha(dato.fechaCreacion)}</span>
                </div>
            </StyledTableCell>
            <StyledTableCell className="tableNormal" component="th" scope="row">{dato.titulo}</StyledTableCell>
            <StyledTableCell className="tableNormal" component="th" scope="row">{dato.nombreAutor}</StyledTableCell>
            <StyledTableCell className="tableNormal" component="th" scope="row">{dato.ultimaModificacion}</StyledTableCell>
            <StyledTableCell className="tableBold" component="th" scope="row">{soloFecha(dato.fechaVencimiento)}</StyledTableCell>
        </StyledTableRow>)
}

export const Anuncios = () => {
    const classes = useStyles();
    const [anuncios, setAnuncios] = useState([])
    const { openSnackbar, setOpenSnackbar, mensajeSnack, usarSnack } = useSnack();
    const [textoBusqueda, setTextoBusqueda] = useState('')
    let history = useHistory()
    let location = useLocation()

    const newAnuncio = () => {
        history.push("/newAnuncio")
    }

    useEffect(() => {
        const fetchAllAnuncios = async (textoBusqueda) => {
            const anunciosEncontrados = await anuncioService.getAllAnuncios(textoBusqueda)
            setAnuncios(anunciosEncontrados)
        }

        fetchAllAnuncios(textoBusqueda)
    }, [textoBusqueda])

    useEffect( () =>{

        const fetchSnack = () => {
          if(location.state !== undefined){
            usarSnack(location.state.mensajeChild, false)
          }
        }
        fetchSnack()
      },[location.state])

    return (
        <RootBox>
            <Typography component="h2" variant="h5" className="tittle">
                Anuncios
            </Typography>
            <SearchBox>
                <Busqueda holder="Buscá por fecha, título o autor" busqueda={setTextoBusqueda} />
                <div>
                    <span className={classes.cantidadObject} > {anuncios.length} anuncios </span>
                    <StyledButtonPrimary onClick={newAnuncio}>Agregar anuncio</StyledButtonPrimary>
                </div>
            </SearchBox>
            {anuncios.length > 0 &&
            <Tabla datos={anuncios} headers={headers} ColumnasCustom={ColumnasCustom} heightEnd={90} defaultSort={"fecha"} defaultOrder={"desc"} />
            }
            { anuncios.length === 0 &&
                <SearchWithoutResults/>
            }
            <SnackbarComponent snackColor={"#00A650"} openSnackbar={openSnackbar} mensajeSnack={mensajeSnack} handleCloseSnack={() => setOpenSnackbar(false)} />

        </RootBox>


    )
}
