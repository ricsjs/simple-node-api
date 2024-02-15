export function extractQueryParams(query) {
    if (typeof query !== 'string' || query.trim() === '') {
        return {};  // Retorna um objeto vazio se a query for inválida
    }

    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=');
        queryParams[key] = value;
        return queryParams;
    }, {});
}
