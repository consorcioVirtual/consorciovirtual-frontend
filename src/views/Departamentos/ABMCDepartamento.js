import React, { useContext, useEffect, useState } from 'react'
import { InputAdornment, makeStyles, Select, Typography } from '@material-ui/core';
import { StyledButtonPrimary, StyledButtonSecondary } from '../../components/Buttons'
import { useHistory, useParams, Prompt } from 'react-router-dom';
import { Link, TextField, MenuItem, Divider, Box } from '@material-ui/core';
import { departamentoService } from "../../services/departamentoService";
import { Historial } from '../../components/Historial'
import { SnackbarComponent } from '../../components/Snackbar'
import { ModalComponent } from '../../components/Modal'
import { Chevron } from '../../assets/icons';
import { Departamento } from '../../domain/departamento';
import update from 'immutability-helper';
import { usuarioService } from '../../services/usuarioService';
import useSnack from '../../hooks/UseSnack';
import { ButtonBox, FormBox, LeftInputBox, RightFormBox, RightInputBox, RootBoxABM } from '../../components/Contenedores';
import { handleOnlyNumbers, handleOnlyNumbersDot } from '../../utils/formats';
import { UserContext } from '../../hooks/UserContext';
import { Usuario } from '../../domain/usuario';

const useStyles = makeStyles({
    link: {
        color: "#159D74",
        textAlign: "left",
        marginBottom: 20,
        cursor: "pointer",
        width: "fit-content"
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
        marginTop: 30,
    },
    inputs: {
        backgroundColor: "white",
        textAlign: "left"
    },
    botones: {
        display: "flex",
        marginTop: 10,
    },
    divider: {
        marginTop: 40
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
    inputInquilino: {
        backgroundColor: "white",
        textAlign: "left"
    },
     select: {
        "&:focus": {
          backgroundColor: "white"
        }
      }

});

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export const ABMCDepartamento = ({ edicion, creacion }) => {
    const classes = useStyles();
    const [departamento, setDepartamento] = useState('')
    const [campoEditado, setCampoEditado] = useState(false)
    const [cambiosGuardados, setCambiosGuardados] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const { openSnackbar, setOpenSnackbar, mensajeSnack, usarSnack, snackColor } = useSnack();
    const [modalStyle] = useState(getModalStyle);
    const [usuarios, setUsuarios] = useState([])
    const [inquilinos, setInquilinos] = useState([])
    const [propietarioId, setPropietarioId] = useState(null)
    const [inquilinoId, setInquilinoId] = useState(null)
    const [errors, setErrors] = useState({})
    const { user } = useContext(UserContext) 

    let history = useHistory()
    const params = useParams()

    useEffect(() => {
        const fetchDepartamento = async () => {
            try {
                let unDepartamento
                if (creacion) {
                    unDepartamento = new Departamento()
                } else {
                    unDepartamento = await departamentoService.getById(params.id)
                    setPropietarioId(unDepartamento.propietario.id)
                    if (unDepartamento.inquilino) {
                        setInquilinoId(unDepartamento.inquilino.id)
                    }
                }
                setDepartamento(unDepartamento)

            }
            catch (error) {
                usarSnack(error.response.data, true)
            }
        }

        fetchDepartamento()
        fetchAllUsers('')
        fetchAllInquilinos()
    }, [params.id, creacion])


    const fetchAllUsers = async (textoBusqueda) => {
        const usuariosEncontrados = await usuarioService.getBySearch(textoBusqueda)
        setUsuarios(usuariosEncontrados)
    }

    const fetchAllInquilinos = async () => {
        const usuariosEncontrados = await usuarioService.getInquilinos()
        setInquilinos(usuariosEncontrados)
        console.log(usuariosEncontrados)
    }

    const actualizarValor = (event) => {
        const newState = update(departamento, {
            [event.target.id]: { $set: event.target.value }
        })
        setDepartamento(newState)
        setCampoEditado(true)
    }

    const backToUsers = () => {
        history.push("/departamentos")
    }

    const popupModalDelete = () => {
        setOpenModalDelete(true)
    }

    const crearDepartamento = async () => {
        try {

            if (validarDepartamento()) {
                await departamentoService.create(departamento, propietarioId)
                setCampoEditado(false)
                history.push("/departamentos", { openChildSnack: true, mensajeChild: "Departamento creado correctamente." })
            } else {
                usarSnack("Campos obligatorios faltantes.", true)
            }
        } catch (error) {
            usarSnack(error.response.data, true)
        }
    }

    const modificarDepartamento = async () => {
        try {
            if (validarDepartamento()) {
                await departamentoService.update(departamento, propietarioId, inquilinoId)
                setCambiosGuardados(true)
                setCampoEditado(false)
                usarSnack("Departamento modificado correctamente", false)
            } else {
                usarSnack("Campos obligatorios faltantes.", true)
            }
        } catch (error) {
            usarSnack(error.response.data, true)
        }
        setCambiosGuardados(false)
    }

    const eliminarDepartamento = async () => {
        try {
            await departamentoService.delete(departamento.id)
            history.push("/departamentos", { openChildSnack: true, mensajeChild: "Departamento eliminado correctamente." })
        } catch (error) {
            usarSnack(error.response.data, true)
        }
    }

    const validarDepartamento = () => {
        setErrors(null)
        if (!departamento.nroDepartamento) {
            setErrors(prev => ({ ...prev, nroDepartamento: "Campo obligatorio" }))
        }

        if (!departamento.piso) {
            setErrors(prev => ({ ...prev, piso: "Campo obligatorio" }))
        }

        if (!departamento.metrosCuadrados) {
            setErrors(prev => ({ ...prev, metrosCuadrados: "Campo obligatorio" }))
        }

        if (!propietarioId) {
            setErrors(prev => ({ ...prev, propietario: "Campo obligatorio" }))
        }

        if (!departamento.porcentajeExpensa) {
            setErrors(prev => ({ ...prev, porcentajeExpensa: "Campo obligatorio" }))
        }

        if (departamento.porcentajeExpensa && !validarPorcentaje()) {
            setErrors(prev => ({ ...prev, porcentajeExpensa: "El porcentaje debe ser mayor a 0 y menor que 100%." }))
        }


        return departamento.nroDepartamento && departamento.piso && departamento.metrosCuadrados && propietarioId && departamento.porcentajeExpensa && validarPorcentaje()
    }

    const validarPorcentaje = () =>{
        return departamento.porcentajeExpensa < 100 && departamento.porcentajeExpensa > 0
    }

    const changePropietario = (event) => {
        setPropietarioId(event.target.value)
        setCampoEditado(true)
    }

    const changeInquilino = (event) => {
        setInquilinoId(event.target.value)
        setCampoEditado(true)
    }

    const enterKey = (e) =>{
        if (e.key === "Enter") {
            edicion? modificarDepartamento() : crearDepartamento()
        }
    }

    const findUser = (idABuscar) =>{
        let usuario = Usuario.fromJson(usuarios.find(usuario => usuario.id === idABuscar))
        if(usuario.id){
            return usuario.nombre + " " + usuario.apellido
        }
        return "Sin inquilino"
    }

    const bodyModalDelete = (

        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">¿Estás seguro que querés eliminar este departamento?</h2>
            <p id="simple-modal-description">Esta acción no se puede deshacer.</p>
            <Box display="flex" flexDirection="row" mt={4}>
                <StyledButtonPrimary onClick={eliminarDepartamento}>Eliminar departamento</StyledButtonPrimary>
                <Link className={classes.linkModal} onClick={() => setOpenModalDelete(false)}>
                    Cancelar
                </Link>
            </Box>
        </div>
    )

    return (
        <RootBoxABM>
            <Prompt when={campoEditado} message={"Hay modificaciones sin guardar. ¿Desea salir de todas formas?"} />
                <FormBox>
                    <Link className={classes.link} onClick={backToUsers}>
                        <Chevron className={classes.chevron} />
                        Volver a departamentos
                    </Link>
                    {creacion &&
                        <Typography component="h2" variant="h5" className="tittle">
                            Nuevo departamento
                        </Typography>
                    }

                    {!creacion && edicion &&
                        <Typography component="h2" variant="h5" className="tittle">
                           {user?.esAdminGeneral()? "Modificar departamento" : "Departamento"} 
                        </Typography>
                    }

                    <form className={classes.form} noValidate autoComplete="off">

                        <LeftInputBox>
                            <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"}>Piso</span>
                            
                            
                            {user?.esAdminGeneral() 
                            ?<TextField 
                            className={classes.inputs} 
                            id="piso" 
                            type="text"
                            value={departamento.piso || ''} 
                            onChange={(event) => actualizarValor(event)} 
                            name="piso" 
                            variant="outlined" 
                            error={Boolean(errors?.piso)}
                            helperText={errors?.piso}
                            inputProps={{ maxLength: 2 }}
                            onInput={ handleOnlyNumbers }
                            onKeyDown={(e) => { enterKey(e) }}
                            />
                            :<span className="spanNormal">{departamento.piso || ''}</span>
                        } 
                        </LeftInputBox>


                        <RightInputBox>
                            <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"}>Numero - Letra Departamento</span>
                            
                            {user?.esAdminGeneral() 
                            ?<TextField 
                            className={classes.inputs} 
                            id="nroDepartamento" 
                            value={departamento.nroDepartamento || ''} 
                            onChange={(event) => actualizarValor(event)} 
                            name="nroDepartamento" 
                            variant="outlined" 
                            error={Boolean(errors?.nroDepartamento)}
                            helperText={errors?.nroDepartamento}
                            inputProps={{ maxLength: 3 }}
                            onKeyDown={(e) => { enterKey(e) }}
                            />
                            :<span className="spanNormal">{departamento.nroDepartamento || ''}</span>
                        } 
                        </RightInputBox>

                        <LeftInputBox>
                            <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"} >Torre</span>
                            
                            {user?.esAdminGeneral() 
                            ?<TextField 
                            className={classes.inputs} 
                            id="torre" 
                            value={departamento.torre || '-'} 
                            onChange={(event) => actualizarValor(event)} 
                            name="torre" 
                            variant="outlined" 
                            inputProps={{ maxLength: 3 }}
                            onKeyDown={(e) => { enterKey(e) }}
                            />
                            :<span className="spanNormal">{departamento.torre || ''}</span>
                        } 
                        </LeftInputBox>

                        <RightInputBox>
                            <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"}>Superficie</span>
                            
                            {user?.esAdminGeneral() 
                            ?<TextField 
                            className={classes.inputs} 
                            id="metrosCuadrados" 
                            value={departamento.metrosCuadrados || ''} 
                            onChange={(event) => actualizarValor(event)} 
                            name="metrosCuadrados" 
                            variant="outlined" 
                            type="text" 
                            error={Boolean(errors?.metrosCuadrados)}
                            helperText={errors?.metrosCuadrados}
                            inputProps={{ maxLength: 4 }}
                            onInput={ handleOnlyNumbersDot }
                            onKeyDown={(e) => { enterKey(e) }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">m2</InputAdornment>,
                            }}
                            />
                            :<span className="spanNormal">{departamento.metrosCuadrados || ''}</span>
                        } 
                        </RightInputBox>

                        {usuarios && departamento &&
                            <LeftInputBox>
                                <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"}>Propietario</span>
                                {departamento && user?.esAdminGeneral() 
                                    ?<Select 
                                    className={classes.inputs} 
                                    id="propietario"
                                    select 
                                    value={propietarioId || ''} 
                                    onChange={changePropietario} 
                                    name="propietario" 
                                    variant="outlined" 
                                    error={Boolean(errors?.propietario)}
                                    helperText={errors?.propietario}
                                    inputProps={{classes: { select: classes.select }}}
                                    onKeyDown={(e) => { enterKey(e) }}
                                    >
                                        {usuarios.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.id}.  {option.nombre} {option.apellido}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    :<span className="spanNormal">{ findUser(propietarioId) || ''}</span>
                                } 
                                    
                            </LeftInputBox>
                        }

                        <RightInputBox>
                            <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"}>Porcentaje de expensas</span>
                            
                            {user?.esAdminGeneral() 
                            ?<TextField 
                            className={classes.inputs} 
                            id="porcentajeExpensa" 
                            onChange={(event) => actualizarValor(event)} 
                            value={departamento.porcentajeExpensa || ''} 
                            name="porcentajeExpensa" 
                            variant="outlined" 
                            type="text" 
                            error={Boolean(errors?.porcentajeExpensa)}
                            helperText={errors?.porcentajeExpensa}
                            inputProps={{ maxLength: 5 }}
                            onInput={ handleOnlyNumbersDot }
                            onKeyDown={(e) => { enterKey(e) }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            />
                            :<span className="spanNormal">{departamento.porcentajeExpensa || ''}</span>
                        } 
                        </RightInputBox>


                        {inquilinos && departamento && edicion && !creacion &&
                            <LeftInputBox>
                                <span className={user?.esAdminGeneral()? "spanTitle" : "spanTitleGrey"}>Inquilino</span>

                                {departamento && user?.esAdminGeneral()?
                                <Select 
                                className={classes.inputInquilino} 
                                id="inquilino" 
                                select 
                                value={inquilinoId || ''} 
                                onChange={changeInquilino} 
                                name="inquilino" 
                                variant="outlined" 
                                error={Boolean(errors?.inquilinoId)}
                                helperText={errors?.inquilinoId}
                                inputProps={{classes: { select: classes.select }}}
                                onKeyDown={(e) => { enterKey(e) }}
                                >
                                    <MenuItem key={0} value={null}>
                                        Sin Inquilino
                                    </MenuItem>
                                    {inquilinos && inquilinos.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.id}. {option.nombre} {option.apellido}
                                        </MenuItem>
                                    ))}
                                </Select>
                                :<span className="spanNormal">{findUser(inquilinoId) || ''}</span>
                                
                            }
                            </LeftInputBox>}

                    </form>

                </FormBox>

                <RightFormBox>
                    {creacion && user?.esAdmin() &&
                        <ButtonBox>
                            <StyledButtonPrimary className={classes.botones} onClick={() => crearDepartamento()} >Crear departamento</StyledButtonPrimary>
                            <StyledButtonSecondary className={classes.botones} onClick={backToUsers}>Cancelar</StyledButtonSecondary>
                        </ButtonBox>
                    }
                    {edicion && !creacion && propietarioId && user?.esAdmin() &&
                        <ButtonBox>
                            {campoEditado &&
                                <StyledButtonPrimary className={classes.botones} onClick={modificarDepartamento}>Guardar cambios</StyledButtonPrimary>
                            }
                            {!campoEditado &&
                                <StyledButtonPrimary className={classes.botonesDisabled} disabled>Guardar cambios</StyledButtonPrimary>
                            }
                            <StyledButtonSecondary className={classes.botones} onClick={popupModalDelete}>Eliminar Departamento</StyledButtonSecondary>
                        </ButtonBox>
                    }
                    { user?.esAdmin() && <Divider className={classes.divider} />}

                    {edicion && !creacion &&
                        <Historial tipo="DEPARTAMENTO" id={params.id} update={cambiosGuardados} />
                    }

                </RightFormBox>

                <SnackbarComponent snackColor={snackColor} openSnackbar={openSnackbar} mensajeSnack={mensajeSnack} handleCloseSnack={() => setOpenSnackbar(false)} />

                <ModalComponent openModal={openModalDelete} bodyModal={bodyModalDelete} handleCloseModal={() => setOpenModalDelete(false)} />

        </RootBoxABM>

    )
}


