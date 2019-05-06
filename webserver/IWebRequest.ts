interface IRequest {
    params: any;
    body: any;

}

interface IResponse {
    json(item: any): void;
    status(resultCode: number): void;
    send(item: any): void;
}

export { IRequest, IResponse };