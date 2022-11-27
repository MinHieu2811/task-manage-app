export interface BoardModel {
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
    userName: string
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
    userEmail: string
    position: number
    favoritePosition: number
    _id: string
}