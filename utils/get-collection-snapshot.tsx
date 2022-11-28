import { db } from "config/firebase"
import { collection, getDocs } from "firebase/firestore"

export const getCollectionDoc = async (colName: string) => {
    const resFromFirebase = await getDocs(collection(db, colName))
    return resFromFirebase
}