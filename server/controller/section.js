import Section from "../model/section.js";
import Task from "../model/task.js";
import asyncHandler from 'express-async-handler'

const createSection = asyncHandler(async (req, res) => {
    try {
        const { boardId } = req.params
        const section = await Section.create({ board: boardId})
        section._doc.tasks = []
        res.status(201).json({
            data: section,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const updateSection = asyncHandler(async (req, res) => {
    try {
        const { sectionId } = req.params
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { $set: req.body }
        )
        section._doc.tasks = []
        res.status(200).json({
            data: section,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const deleteSection = asyncHandler(async (req, res) => {
    try {
        const { sectionId } = req.params
        await Task.deleteMany({ section: sectionId })
        await Section.deleteOne({ _id: sectionId })
        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

export { 
    createSection,
    updateSection,
    deleteSection
}