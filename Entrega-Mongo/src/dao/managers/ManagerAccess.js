import fs from 'fs';
import __dirname from '../../utils.js';

export default class ManagerAcces {
    
    async crearRegistro(metodo){

        const fecha = new Date().toLocaleDateString;
        const hora = new Date().toLocaleTimeString;

        const message = `\nFecha: ${fecha} - Hora: ${hora} - Metodo: ${metodo}`

        await fs.promises.appendFile(__dirname + '/dao/managers/log.txt', `Fecha: ${fecha} - Hora: ${hora} - Metodo: ${metodo}\n`, (err)=>{
            return err;
        })
    }
}