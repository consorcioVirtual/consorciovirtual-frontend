import React, { useEffect, useState } from 'react'
import { makeStyles, Typography, Snackbar } from '@material-ui/core';
import { Tabla, StyledTableRow, StyledTableCell } from '../../components/Tabla';
import { usuarioService } from '../../services/usuarioService';
import { Busqueda } from '../../components/Busqueda'
import { StyledButtonPrimary } from '../../components/Buttons'
import { useHistory, useLocation } from 'react-router-dom';
import { StyledSnackbarGreen } from '../../components/Snackbar'


const useStyles = makeStyles ({
    root: {
      display: 'flex',
      marginLeft: 300,
      marginTop: 30,
      marginRight: 50,
      flexDirection: "column"
    },
    tittle:{
        textAlign: "left",
    },
    contenedorBusqueda:{
      display: "flex",
      justifyContent: "space-between",
      marginTop: 20
    },
    cantidadObject:{
      fontWeight: 300,
      marginRight: 10
    },
    departamento:{
      display:"flex"
    }

  });

const headers = ["Nombre y apellido", "E-mail", "DNI", "Actividad", "Tipo de Cuenta"]


const ColumnasCustom = (dato) => {
let history= useHistory()

const getUser = (id) =>{
  history.push(`/usuario/${id}`)
}

return (
<StyledTableRow key={dato.id} onClick={() => getUser(dato.id)} className="pointer">
  <StyledTableCell  component="th" scope="row">
    <div className="contenedorColumna">
      <span className="tableBold">{dato.nombre +" "+ dato.apellido}</span>
      <span >2° A</span>
    </div>
  </StyledTableCell>
  <StyledTableCell className="tableNormal" component="th" scope="row">{dato.correo}</StyledTableCell>
  <StyledTableCell className="tableNormal" component="th" scope="row">{dato.dni}</StyledTableCell>
  <StyledTableCell className="tableNormal" component="th" scope="row">Modificado hace {Math.floor(Math.random() * 10)} horas</StyledTableCell>
  <StyledTableCell className="tableBold" component="th" scope="row">Propietario</StyledTableCell>
</StyledTableRow>
)
}



export const Usuarios = () =>{
    const location = useLocation();
    let history = useHistory()  
    const classes = useStyles();
    const [usuarios, setUsuarios] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState('')


    const fetchAllUsers = async (textoBusqueda) =>{
      const usuariosEncontrados = await usuarioService.getAllUsers(textoBusqueda)
      setUsuarios(usuariosEncontrados)
    }

    const newUser = () =>{
      history.push("/newuser")
    }
    
    const fetchSnack = () => {
      location.state === undefined? setOpenSnackbar(false) : setOpenSnackbar(location.state.openChildSnack)
    }

    useEffect( ()  =>  {
      fetchAllUsers("")
      fetchSnack()
    },[])

    return (
        <div className={classes.root} >
           <Typography component="h2" variant="h5" className={classes.tittle}>
             Usuarios 
           </Typography>
           <div className={classes.contenedorBusqueda}> 
              <Busqueda holder="Buscá por nombre, apellido, DNI, e-mail o tipo de cuenta" busqueda={fetchAllUsers} />
              <div>
               <span className={classes.cantidadObject} > {usuarios.length} usuarios </span>
              <StyledButtonPrimary onClick={newUser} >Agregar usuario</StyledButtonPrimary>
              </div>
           </div>
            <Tabla datos={usuarios} headers={headers} ColumnasCustom={ColumnasCustom} heightEnd={112.7}/>
            
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
                key={'bottomcenter'}
                autoHideDuration={2000}
                >
              <StyledSnackbarGreen
              message="Usuario creado correctamente."
              />
              </Snackbar> 
         </div>
        
    )
}