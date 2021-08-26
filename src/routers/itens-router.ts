import express from 'express'
import Item from '../models/item'
import itensRepository from '../repositories/itens-repository'

const itensRouter = express.Router()

itensRouter.post('/', (req, res) => {
    const item: Item = req.body
    itensRepository.criar(item, (id) => {
        if (id) {
            res.status(201).location(`/itens/${id}`).send()
        } else {
            res.status(400).send()
        }
    })
})

itensRouter.get('/', (req, res) => {
    console.log('oi');
    itensRepository.lerTodos((itens) => res.json(itens))
})

itensRouter.get('/:id', (req, res) => {
    const id: number = +req.params.id
    itensRepository.ler(id, (item) => {
        if (item) {
            res.json(item)
        } else {
            res.status(404).send()
        }
    })
})

itensRouter.put('/:id', (req, res) => {
    const id: number = +req.params.id
    itensRepository.atualizar(id, req.body, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

itensRouter.delete('/:id', (req, res) => {
    const id: number = +req.params.id
    itensRepository.apagar(id, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
export default itensRouter