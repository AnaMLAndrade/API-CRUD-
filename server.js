const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
console.log("MongoDB URI:", process.env.MONGO_URI);  // Verificar saída da URI

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conectando ao MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas', err));

const livroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    paginas: Number,
    publicado: Date
});

const Livro = mongoose.model('Livro', livroSchema);

// Create
app.post('/livros', async (req, res) => {
    const novoLivro = new Livro(req.body);
    try {
        const livroSalvo = await novoLivro.save();
        res.status(201).send(livroSalvo);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.status(200).send(livros);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read by ID
app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);
        if (!livro) {
            res.status(404).send('Livro não encontrado');
        }
        res.status(200).send(livro);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update
app.put('/livros/:id', async (req, res) => {
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!livroAtualizado) {
            res.status(404).send('Livro não encontrado');
        }
        res.status(200).send(livroAtualizado);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete
app.delete('/livros/:id', async (req, res) => {
    try {
        const livroDeletado = await Livro.findByIdAndDelete(req.params.id);
        if (!livroDeletado) {
            res.status(404).send('Livro não encontrado');
        }
        res.status(200).send('Livro deletado com sucesso');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
