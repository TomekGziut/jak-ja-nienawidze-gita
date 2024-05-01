require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors());

app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err))

const TaskModel = mongoose.model('Task', new mongoose.Schema({
    title: String,
    description: String,
    dueDate: String,
    priority: String,
    done: { type: Boolean, default: false }
}), 'zadania')

app.use(express.json())

app.get('/todos', async (req, res) => {
    try {
        res.json(await TaskModel.find({}))
        console.log(await TaskModel.find({}))
    } catch (error) {
        console.error('Error fetching tasks:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.get('/todos/:id', async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id)
        if (!task) return res.status(404).json({ error: 'Task not found' })
        res.json(task)
    } catch (error) {
        console.error('Error fetching task by ID:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/todos', async (req, res) => {
    try {
        res.status(201).json(await TaskModel.create(req.body))
    } catch (error) {
        console.error('Error creating task:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' })
        res.json(updatedTask)
    } catch (error) {
        console.error('Error updating task by ID:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.params.id)
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' })
        res.json({ message: 'Task deleted successfully' })
    } catch (error) {
        console.error('Error deleting task by ID:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.put('/todos/:id/done', async (req, res) => {
    try {
        const { done } = req.body
        const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, { done }, { new: true })
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' })
        res.json(updatedTask)
    } catch (error) {
        console.error('Error updating task done status by ID:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


