export interface IUseCase<IInputDTO, IResult> {
  execute(input?: IInputDTO): Promise<IResult> | IResult;
}
