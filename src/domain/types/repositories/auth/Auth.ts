export interface IAuthRepository<T, R, S> {
  register(data: T): Promise<S>;
  login(data: R): Promise<S>;
  verify(id: string): Promise<S>;
  findById(id: string): Promise<S | undefined>;
}
