const getPagingData = (data, page, limit, offset) => {

    const { count: totalItems, rows: rows } = data;
    const currentPage = page ? page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems: totalItems, totalPages, currentPage : parseInt(currentPage), limit: parseInt(limit), offset, rows, };
}

const getPagination = (page = 0, size) => {

    const limit = size ? size : 10;
    const offset = page > 0 ? (page - 1) * limit : 0;

    return { limit, offset };
}

module.exports = {
    getPagingData,
    getPagination
}