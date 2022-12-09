export interface BoardModel {
    _id: string
    description: string,
    favorite?: boolean,
    icon?: string,
    title: string,
    userId: string,
    sections: SectionModel[]
}

export interface SectionModel {
    boardId: string
    description?: string
    userId: string
    title: string
    status: string
    tasks: []
}

export interface TaskModel {
    boardId: string
    sectionId: string
    title: string
    description: string
    icon: string,
    userId: string
    _id: string
}
export interface BoardData {
    boardData: BoardModel
    boardId: string
}

export interface SectionData {
    sectionData: SectionModel
    sectionId: string
}

export interface TaskData {
    taskData: TaskModel
    taskId: string
}