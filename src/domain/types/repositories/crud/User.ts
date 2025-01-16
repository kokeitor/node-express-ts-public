export interface ICrudRepository<T, R, S> {
  find(): Promise<S[]>;
  findById(id: string): Promise<S | undefined>;
  findByEmail(email: string): Promise<S | undefined>;
  findByPhone(phone: string): Promise<S | undefined>;
  create(data: T): Promise<S>;
  update(id: string, data: R): Promise<S>;
  delete(id: string): Promise<S>;
}
