interface IRequest {
    params: any;
    body: any;

}

interface IResponse {
    status(resultCode: number): void;
    send(item: any): void;
}

export { IRequest, IResponse };