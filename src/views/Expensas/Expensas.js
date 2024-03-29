import React, { useEffect, useState, useContext } from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import { Tabla, StyledTableRow, StyledTableCell } from '../../components/Tabla';
import { expensaService } from '../../services/expensaService';
import { Busqueda } from '../../components/Busqueda'
import { StyledButtonPrimary, StyledButtonSecondary } from '../../components/Buttons'
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { formatDate, numeroConPuntos } from '../../utils/formats';
import { SnackbarComponent } from '../../components/Snackbar';
import useSnack from '../../hooks/UseSnack';
import { RootBox, SearchBox } from '../../components/Contenedores';
import { SearchWithoutResults } from '../../components/SearchWithoutResults';
import { UserContext } from '../../hooks/UserContext';
import { useMediaQuery } from './../../hooks/UseMediaQuery';


const useStyles = makeStyles ({
    botonAnular:{
      marginLeft: 8
    },
    contenedorBotones:{
      display: "flex",
      flexWrap: "nowrap",
      alignItems:"center"
    }
  });

const getHeaders = (mobileSize, tabletSize, webSize) => {
  let headers

  if (webSize) {
    headers = [
      {id: "periodo", label:"Periodo"},
      {id: "departamento", label:"Departamento"},
      {id: "montoAPagar", label:"Monto a pagar"},
      {id: "estado", label:"Estado"},
    ]
  } else if (!mobileSize && tabletSize) {
    headers = [
      {id: "periodo", label:"Periodo"},
      {id: "departamento", label:"Departamento"},
      {id: "montoAPagar", label:"Monto a pagar"},
    ]
  } else {
    headers = [
      {id: "periodo", label:"Periodo"},
      {id: "departamento", label:"Departamento"},
    ]
  }
  return headers
}

const ColumnasCustom = (dato, mobileSize, tabletSize, webSize) => {
  let history= useHistory()

  const getExpensa = (id) =>{
    history.push(`/expensa/${id}`)
  }

  const getCells = () => {
    if (mobileSize) {
      return (
        <StyledTableRow key={dato.id} className="pointer animate__animated animate__fadeIn" onClick={() => getExpensa(dato.id)}>
        <StyledTableCell className="tableNormal" component="th" scope="row">{formatDate(dato.periodo)}</StyledTableCell>
        <StyledTableCell className="tableNormal" component="th" scope="row">{dato.departamento}</StyledTableCell>
      </StyledTableRow>
      )
    } else if (tabletSize) {
      return (
        <StyledTableRow key={dato.id} className="pointer animate__animated animate__fadeIn" onClick={() => getExpensa(dato.id)}>
        <StyledTableCell className="tableNormal" component="th" scope="row">{formatDate(dato.periodo)}</StyledTableCell>
        <StyledTableCell className="tableNormal" component="th" scope="row">{dato.departamento}</StyledTableCell>
        <StyledTableCell className="tableNormal" component="th" scope="row">$ {numeroConPuntos(dato.montoAPagar)}</StyledTableCell> 
      </StyledTableRow>
      )
    } else if (webSize) {
      return (
        <StyledTableRow key={dato.id} className="pointer animate__animated animate__fadeIn" onClick={() => getExpensa(dato.id)}>
        <StyledTableCell className="tableNormal" component="th" scope="row">{formatDate(dato.periodo)}</StyledTableCell>
        <StyledTableCell className="tableNormal" component="th" scope="row">{dato.departamento}</StyledTableCell>
        <StyledTableCell className="tableNormal" component="th" scope="row">$ {numeroConPuntos(dato.montoAPagar)}</StyledTableCell> 
        <StyledTableCell className="tableBold"  component="th" scope="row">{dato.estado}</StyledTableCell>
      </StyledTableRow>
      )
    }
  }

  return (getCells())
}

export const Expensas = () =>{
    const location = useLocation();
    const classes = useStyles();
    const [expensas, setExpensas] = useState([])
    const { openSnackbar, setOpenSnackbar, mensajeSnack, usarSnack } = useSnack();
    const [textoBusqueda, setTextoBusqueda] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useContext(UserContext)
    let mobileSize = useMediaQuery('(max-width: 400px)')
    let tabletSize = useMediaQuery('(max-width: 768px)')
    let webSize = useMediaQuery('(min-width: 769px)')

    let history = useHistory()

    const newExpensa = () =>{
      history.push("/crearexpensa")
    }

    const anularExpensa = () =>{
      history.push("/anularexpensa")
    }

    useEffect( ()  =>  {
      const fetchAll = async (textoBusqueda) =>{
        const expensasEncontradas = await expensaService.getBySearch(textoBusqueda)
        setExpensas(expensasEncontradas)
        setIsLoading(false)
      }

        fetchAll(textoBusqueda)
    },[textoBusqueda])

    useEffect( () =>{

      const fetchSnack = () => {
        if(location.state !== undefined){
          usarSnack(location.state.mensajeChild, false)
          history.replace()
        }
      }
      fetchSnack()
    },[location.state])

    return (
        <RootBox>
           <Typography component="h2" variant="h5" className="tittle">
             Expensas
           </Typography>
           <SearchBox> 
              <Busqueda holder="Buscá por departamento o monto" busqueda={setTextoBusqueda} />
              <div className={classes.contenedorBotones}>
               <span className="cantidadObject" > {expensas.length} expensas </span>
               
              {user?.esAdmin() && <StyledButtonPrimary onClick={newExpensa} >Calcular expensas</StyledButtonPrimary>}
              {user?.esAdmin() && <StyledButtonSecondary className={classes.botonAnular} onClick={anularExpensa}>Anular expensas</StyledButtonSecondary>}
               
              </div>
           </SearchBox>
           {expensas.length > 0 &&
            <Tabla datos={expensas} headers={getHeaders(mobileSize, tabletSize, webSize)} ColumnasCustom={ColumnasCustom} heightEnd={90} defaultSort={"periodo"} defaultOrder={"desc"}/>
           }
          { expensas.length === 0 && !isLoading &&
                <SearchWithoutResults resultado="expensas"/>
          }

            <SnackbarComponent snackColor={"#00A650"} openSnackbar={openSnackbar} mensajeSnack={mensajeSnack} handleCloseSnack={() => setOpenSnackbar(false)}/>
         </RootBox>

        
    )
}
export default withRouter(Expensas)