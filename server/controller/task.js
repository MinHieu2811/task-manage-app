import Task from '../model/task.js'
import Section from '../model/section.js'
import asyncHandler from 'express-async-handler'

const createTask = asyncHandler(async (req, res) => {
    const {sectionId } = req.body
    try {
        const section = await Section.findById(sectionId)
        const taskCount = await Task.find({ section: sectionId }).count()
        const task = await Task.create({
            section: sectionId,
            position: taskCount > 0 ? taskCount : 0
        })

        task._doc.section = section
        res.status(201).json({
            data: task,
            success: true
        })
    } catch(err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const updateTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params
    try {
        const task = await Task.findByIdAndUpdate(
            taskId,
            {$set: req.body}
        )
        res.status(200).json({
            data: task,
            success: true
        })
    } catch(err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    try{
        const currentTask = await Task.findById(taskId)
        await Task.deleteOne({ _id: taskId })
        const tasks = await Task.find({section: currentTask.section}).sort('position')
        for (const key in tasks) {
            await Task.findByIdAndUpdate(
                tasks[key].id,
                { $set: {position: key}}
            )
        }

        res.status(200).json({
            success: true
        })
    }catch(err) {
        res.status(500).json({
            message: err,
            success: false
        })
    }
})

const updatePositionTask = asyncHandler(async (req, res) => {
    const {resourceList, destinationList, resourceSectionId, destinationSectionId } = req.body
    const resourceListReverse = resourceList.reverse()
    const destinationListReverse = destinationList.reverse()
    try{
        if(resourceSectionId !== destinationSectionId){
            for (const key in resourceListReverse) {
                await Task.findByIdAndUpdate(
                    resourceListReverse[key].id,
                    { $set: {
                        section: resourceSectionId,
                        position: key
                    }}
                )
            }
        }
        for (const key in destinationListReverse) {
            await Task.findByIdAndUpdate(
                destinationListReverse[key].id,
                { $set: {
                    section: destinationSectionId,
                    position: key
                }}
            )
        }
        res.status(200).json({
            success: true
        })
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
})

export {
    createTask,
    updatePositionTask,
    updateTask,
    deleteTask
}