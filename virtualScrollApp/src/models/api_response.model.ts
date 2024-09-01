export interface Api_Response {
    page_number: number,
    page_size: number
    data: Array<any>,
    success: boolean,
    message: string,
    genre: string,
    total?: number
}
