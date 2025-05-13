export const checkEmpty = (args) => {
    if ({ ...args } == "" || { ...args } == null) {
        return true;
    }
}