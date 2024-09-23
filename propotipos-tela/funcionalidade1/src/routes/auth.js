// src/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// POST /register - Registrar novo usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, culturalInterests } = req.body;

        // Validações básicas
        if (!name || !email || !password || !culturalInterests.length) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se o e-mail já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já registrado.' });
        }

        // Criptografar senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar novo usuário
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            culturalInterests
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});

module.exports = router;
