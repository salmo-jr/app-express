import express from 'express'
import path from 'path'
import fs from 'fs'
import mv from 'mv'
import formidable from 'formidable'
import Item from '../models/item'
import itensRepository from '../repositories/itens-repository'
import IncomingForm from 'formidable/Formidable'

const uploadRouter = express.Router()
const dir = path.resolve('upload')

async function upload(req: any, diretory: string): Promise<string> {
    const dirExists = fs.existsSync(diretory);
    let id: number = +req.params.id;
    const form: IncomingForm = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
        form.parse(req, function (err: any, fields: formidable.Fields, files: formidable.Files) {
            const file = files.anexo as formidable.File;
            const oldpath: string = file.path;

            const nome = "ID-" + id + "-" + file.name;
            var newpath = path.join(diretory, nome);

            mv(oldpath, newpath, { mkdirp: !dirExists }, function (err: unknown) {
                // done. it first created all the necessary directories, and then
                // tried fs.rename, then falls back to using ncp to copy the dir
                // to dest and then rimraf to remove the source dir
            });

            resolve(nome);
        });
    });
}

uploadRouter.post("/item/:id", async (req, res, next) => {
    try {
        const directory = path.join(dir, "item");
        const arq = await upload(req, directory);
        const id: number = +req.params.id;
        let fullPath: string;
        
        itensRepository.ler(id, item => {
            if (item) {
                fullPath = path.join("/upload/item/", arq);
                item.urlImagem = fullPath;
                itensRepository.atualizar(id, item, (notFound) => {
                    if (notFound) {
                        if(fs.existsSync(path.join(dir, `item\\${arq}`)))
                            fs.unlinkSync(`${dir}\\item\\${arq}`)
                        res.status(404).send()
                    } else {
                        res.status(204).send()
                    }
                });
            }
            else
            {
                if(fs.existsSync(path.join(dir, `item\\${arq}`)))
                    fs.unlinkSync(`${dir}\\item\\${arq}`)
                res.status(404).send()
            }
        })
    } catch (error) {
        next(error);
    }
});
export default uploadRouter