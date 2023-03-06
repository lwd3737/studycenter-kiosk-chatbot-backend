export interface IUseCase<IRequestDTO, IResult> {
  execute(request?: IRequestDTO): Promise<IResult> | IResult;
}
