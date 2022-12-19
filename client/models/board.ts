export interface BoardModel {
    _id: string
    description: string
    position: number
    favoritePosition: number
    favorite?: boolean
    icon?: string
    title: string
    userId: string
}

export interface SectionModel {
    boardId: string
    title: string
}

export interface TaskModel {
    sectionId: string
    title: string
    content: string
    position: number
}
export interface BoardData {
    data: BoardModel[]
    success?: string
}

export interface SectionData {
    sectionData: SectionModel[]
    sectionId: string
}

export interface TaskData {
    taskData: TaskModel
    taskId: string
}