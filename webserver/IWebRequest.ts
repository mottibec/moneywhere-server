interface IRequest {
    params: any;
    body: any;
    user?: any;
}

interface IResponse {
    json(item: any): any;
    status(resultCode: number): any;
    send(item: any): any;
}

export { IRequest, IResponse };