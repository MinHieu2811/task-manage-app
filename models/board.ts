export interface BoardModel {
    _id: string
    description: string,
    favorite?: boolean,
    favoritePosition: number,
    icon?: string,
    position: number,
    title: string,
    userId: string,
    sections: SectionModel[]
}

export interface SectionModel {
    boardId: string
    description?: string
    userId: string
    title: string
    position: number
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
    position: number
    favoritePosition: number
    _id: string
}
export interface BoardData {
    boardData: BoardModel
    boardId: string
}

export interface SectionData extends SectionModel {
    sectionId: string
}

export interface TaskData extends TaskModel {
    taskId: string
}