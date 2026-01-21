export const formatNumberWithCommas = (number) => {
    if (number)
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return '0';
};

export const getUniqueList = (array) => {
    const uniqueClientIds = new Set();
    const uniqueArray = array.filter(obj => {
        if (!uniqueClientIds.has(obj.clientid)) {
            uniqueClientIds.add(obj.clientid);
            return true;
        }
        return false;
    });
    return uniqueArray;
}