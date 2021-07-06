import axios from 'axios'
import { Reclamo } from '../domain/reclamo'
import { REST_SERVER_URL } from './configuration'
import { usuarioService } from './usuarioService';

class ReclamoService {

    reclamoAJson(reclamoJSON) {
        return Reclamo.fromJson(reclamoJSON)
    }

    async getAll(busqueda) {
        const listaJSON = await axios.get(`${REST_SERVER_URL}/reclamos/?palabraBuscada=${busqueda}`)
        return listaJSON.data
    }

    async getById(id) {
        const reclamo = await axios.get(`${REST_SERVER_URL}/reclamo/${id}`)
        return Reclamo.fromJson(reclamo.data)
    }

    async create(anuncio){
        const idAutor = usuarioService.usuarioLogueado.id
        await axios.post((`${REST_SERVER_URL}/anuncios/crear/${idAutor}`), anuncio.toJSON())
    }

    async update(anuncio){
        const idAutor = usuarioService.usuarioLogueado.id
        await axios.put(`${REST_SERVER_URL}/anuncios/modificar/${idAutor}`, anuncio.toJSON())
    }

    async delete(id){
        await axios.put(`${REST_SERVER_URL}/anuncios/eliminar/${id}`)
    }

}

export const reclamoService = new ReclamoService()