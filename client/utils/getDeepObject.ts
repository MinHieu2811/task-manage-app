export const getValue = (object: any, path: any[], defaultValue: any) => {
    try {
        if(!(object instanceof Array)) {
            let myValue = object
            for(let key of path) {
                if(!(key in path)){ 
                    return defaultValue
                } else {
                    myValue = myValue[key]
                }
            }
            return myValue
        }
    } catch(err) {
        console.log(err);
        return defaultValue
    }
}