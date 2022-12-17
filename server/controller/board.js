import asyncHandler from 'express-async-handler'
import Board from '../model/board.js'
import Section from '../model/section.js'
import Task from '../model/task.js'

const createBoard = asyncHandler(async (req, res) => {
    try {
        const boardCount = Board.find({}).count()
        const board = await Board.create({
            user: req.user._id,
            position: boardCount > 0 ? boardCount : 0
        })

        res.status(201).json({
            data: board,
            message: 'Create board successfully',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error,
            success: false
        })
    }
})

const getAllBoard = asyncHandler(async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user._id }).sort('-position')

        res.status(201).json({
            data: boards,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error,
            success: false
        })
    }
})

const updatePositionBoard = asyncHandler(async (req, res) => {
    try {
        const { boards } = req.body
        for (const key in boards.reverse()) {
            const board = boards[key];
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
        }
        res.status(200).json({ success: true })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const getOneBoard = asyncHandler(async (req, res) => {
    try {
        const { boardId } = req.params

        const board = await Board.findOne({ user: req.user._id, _id: boardId })
        if (!boardId) return res.status(404).json('Board not found')
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
            section._doc.tasks = tasks
        }
        board._doc.sections = sections

        res.status(200).json({
            data: board,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const updateBoard = asyncHandler(async (req, res) => {

    try {
        const { boardId } = req.params
        const { title, description, favorite } = req.body
        if (title === '') req.body.title = 'Untitled'
        if (description === '') req.body.description = 'Add description here'
        const currentBoard = await Board.findById(boardId)
        if (!currentBoard) return res.status(404).json('Board not found')

        if (favorite !== undefined && currentBoard.favorite !== favorite) {
            const favorites = await Board.find({
                user: currentBoard.user,
                favorite: true,
                _id: { $ne: boardId }
            }).sort('favoritePosition')
            if (favorite) {
                req.body.favoritePosition = favorites.length > 0 ? favorites.length : 0
            } else {
                for (const key in favorites) {
                    const element = favorites[key]
                    await Board.findByIdAndUpdate(
                        element.id,
                        { $set: { favoritePosition: key } }
                    )
                }
            }
        }

        const board = await Board.findByIdAndUpdate(
            boardId,
            { $set: req.body }
        )
        res.status(200).json({
            board: board,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const getFavouriteBoard = asyncHandler(async (req, res) => {
    try {
        const favourites = await Board.find({
            user: req.user._id,
            favorite: true
        }).sort('-favoritePosition')
        res.status(200).json({
            data: favourites,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const updateFavouritePosition = asyncHandler(async (req, res) => {
    try {
        const { boards } = req.body
        for(const key in boards.reverse()) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { favoritePosition: key } }
            )
        }

        res.status(200).json({success: true})
    } catch (error) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const deleteBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params
    try{
        const sections = await Section.find({ board: boardId })
        for(const section of sections) {
            await Task.deleteMany({ section: section.id })
        }
        await Section.deleteMany({ board: boardId })

        const currentBoard = await Board.findById(boardId)

        if(currentBoard.favorite){
            const favorites = await Board.find({
                user: currentBoard.user,
                favorite: true,
                _id: { $ne: boardId }
            }).sort('favoritePosition')

            for(const key in favorites){
                const element = favorites[key]
                await Board.findByIdAndUpdate(
                    element.id,
                    { $set: { favoritePosition: key }}
                )
            }
        }

        await Board.deleteOne({ _id: boardId })

        const boards = await Board.find().sort('position')
        for (const key in boards) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
        }

        res.status(200).json({success: true})
    }catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

export {
    createBoard,
    getAllBoard,
    updateBoard,
    updateFavouritePosition,
    updatePositionBoard,
    deleteBoard,
    getFavouriteBoard,
    getOneBoard,
}