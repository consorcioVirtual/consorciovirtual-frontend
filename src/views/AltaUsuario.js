import React, { useEffect, useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import { StyledButtonPrimary, StyledButtonSecondary } from '../components/Buttons'
import { useHistory, useParams } from 'react-router-dom';
import { Link, Avatar, TextField, MenuItem, Divider, Box } from '@material-ui/core';
import { usuarioService } from "../services/usuarioService";
import { Historial } from '../components/Historial'
import { Chevron } from '../assets/icons';
import { Usuario } from '../domain/usuario';
import update from 'immutability-helper';

const useStyles = makeStyles ({
    root: {
      display: 'flex',
      marginLeft: 300,
      flexDirection: "row",
      height: "100%",
    },
    tittle:{
        textAlign: "left",
    },
    contenedorForm:{
        paddingTop:30,
        display:"flex",
        width: "100%",
        flexDirection: "column",
        paddingRight: 50
    },
    buttonLog:{
        paddingTop:30,
        display:"flex",
        backgroundColor: "white",
        height: "100%",
        width: "600px",
        flexDirection: "column"
    },
    link:{
        color: "#159D74",
        textAlign:"left",
        marginBottom: 20,
        cursor: "pointer",
    },
    form:{
        display:"flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 30,
        
    },
    inputs:{
        backgroundColor: "white",
        textAlign: "left"
    },
    contenedorInput:{
        display: "flex",
        flexDirection: "column",
        flex: "50%",
        maxWidth: 400,
        marginBottom: 50,
    },
    contenedorInputDerecha:{
        display: "flex",
        flexDirection: "column",
        flex: "50%",
        maxWidth: 400,
        marginBottom: 50,
    },
    span:{
        textAlign:"left",
        marginLeft: 10,
        marginBottom: 6
    },
    botones:{
        display: "flex",
        marginTop: 10,
    },
    contenedorBotones:{
        display: "flex",
        flexDirection: "column",
        margin: "10px 50px"
    },
    divider: {
        marginTop: 40
      },
    inputsDisabled:{
        textAlign: "left",
        marginLeft: 10
    },
    spanDisabled:{
        textAlign:"left",
        marginLeft: 10,
        marginBottom: 6,
        color: "grey"
    },
    botonesDisabled:{
        background: "rgba(0, 0, 0 ,10%)",
    },
    chevron:{
        fontSize: "12px",
        marginRight: 8
    }
  });

const tiposDeUsuario = [
    {
      value: 'Propietario',
      label: 'Propietario',
    },
    {
      value: 'Inquilino',
      label: 'Inquilino',
    },
    {
      value: 'Administrador de Consorcio',
      label: 'Administrador de Consorcio',
    },
    {
    value: 'Administrador de Aplicacion',
    label: 'Administrador de Aplicacion',
    }
  ]

export const AltaUsuario = ({edicion, creacion}) =>{
    const classes = useStyles();
    const [usuario, setUsuario] = useState('')
    const [tipoUsuario, setTipoUsuario] = useState()
    const [campoEditado, setCampoEditado] = useState(false)
    let history = useHistory()
    const params = useParams()

    const fetchUsuario = async () =>{
        try{
            let unUsuario
            if(creacion){
                unUsuario = new Usuario()
            } else{
                unUsuario = await usuarioService.getUser(params.id)
            }
            setUsuario(unUsuario) 
            }
        catch{

        }
    }

    const actualizarValor = (event) => {
        
        const newState = update(usuario, {
            [event.target.id]: { $set: event.target.value}
        })
        setUsuario(newState)
        setCampoEditado(true)
    }

    const backToUsers = () =>{
        history.push("/usuarios")
    }

    const handleChangeType = (event) => {
        setTipoUsuario(event.target.value);
      };
    
    useEffect( ()  =>  {
        fetchUsuario()
    },[])

    const crearUsuario = async () => {
        try{
            if(validarUsuario()){
                await usuarioService.createUser(usuario)

            }else{
               
            }
        } catch (error) {

        }
    }

    const validarUsuario = () =>{
        return true
    }


    return (
        
        <div className={classes.root} >
            <div className={classes.contenedorForm}>
                <Link className={classes.link} onClick={backToUsers}>
                    <Chevron className={classes.chevron}/>
                    Volver a usuarios
                </Link>
                { creacion &&
                    <Typography component="h2" variant="h5" className={classes.tittle}>
                        Nuevo usuario
                     </Typography>
                }
                
                { !creacion && edicion &&
                    <Typography component="h2" variant="h5" className={classes.tittle}>
                    Modificar usuario
                    </Typography>
                }
        
                <form className={classes.form} noValidate autoComplete="off">
                    <div className={classes.contenedorInput}>
                        <span className={classes.span}>Nombre</span>
                        <TextField className={classes.inputs} id="nombre" value={usuario.nombre || ''} onChange={(event) => actualizarValor(event)} name="nombre" variant="outlined" />
                    </div>

                    <div className={classes.contenedorInputDerecha}>
                        <span className={classes.span} >Apellido</span>
                        <TextField className={classes.inputs} id="apellido" value={usuario.apellido || ''} onChange={(event) => actualizarValor(event)} name="apellido" variant="outlined" />
                    </div>

                    <div className={classes.contenedorInput}>
                        <span className={classes.span}>DNI</span>
                        <TextField className={classes.inputs} id="dni" value={usuario.dni || ''} onChange={(event) => actualizarValor(event)} name="dni"  variant="outlined" />
                    </div>

                    <div className={classes.contenedorInputDerecha}>
                        <span className={classes.span}>E-mail</span>
                        <TextField className={classes.inputs} id="correo" value={usuario.correo || ''} onChange={(event) => actualizarValor(event)} name="correo"  variant="outlined" />
                    </div>

                    <div className={classes.contenedorInput}>
                        <span className={classes.span}>Fecha de nacimiento</span>
                        <TextField className={classes.inputs} id="fechaNacimiento" value={usuario.fechaNacimiento || ''} onChange={(event) => actualizarValor(event)} name="fechaNacimiento" type="date" variant="outlined" />
                    </div>

                    <div className={classes.contenedorInputDerecha}>
                        <span className={classes.span}>Tipo de usuario</span>
                        <TextField className={classes.inputs} id="tipoUsuario" select onChange={handleChangeType} value={tipoUsuario || ''} variant="outlined" >
                                {tiposDeUsuario.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    
                    { edicion && !creacion &&
                    <div className={classes.contenedorInput}>
                        <span className={classes.spanDisabled}>Piso</span>
                        <span className={classes.inputsDisabled}>2</span>
                    </div>
                    }
                    
                    { edicion && !creacion &&
                    <div className={classes.contenedorInputDerecha}>
                        <span className={classes.spanDisabled}>Departamento</span>
                        <span className={classes.inputsDisabled}>B</span>
                    </div>
                    }
                </form> 
                      
            </div>

            <div className={classes.buttonLog}>
                { creacion &&
                <div className={classes.contenedorBotones}>
                    <StyledButtonPrimary className={classes.botones} onClick={() => crearUsuario() } >Crear usuario</StyledButtonPrimary>
                    <StyledButtonSecondary className={classes.botones} onClick={ backToUsers }>Cancelar</StyledButtonSecondary>
                </div>
                }
                { edicion && !creacion &&
                <div className={classes.contenedorBotones}>
                    {campoEditado &&
                        <StyledButtonPrimary className={classes.botones}>Guardar cambios</StyledButtonPrimary>
                    }   
                    {!campoEditado &&
                        <StyledButtonPrimary className={classes.botonesDisabled} disabled>Guardar cambios</StyledButtonPrimary>
                    }
                    <StyledButtonSecondary className={classes.botones} onClick={ backToUsers }>Eliminar usuario</StyledButtonSecondary>
                </div>
                }
                <Divider className={classes.divider} />
                
                { edicion && !creacion &&
                    <Historial usuariosHistorial={usuarioService.usuariosPrueba}/>
                }

            </div>
         </div>

    )
}
 

