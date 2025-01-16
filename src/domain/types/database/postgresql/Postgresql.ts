export type PostgresqlConfig = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl: {
    rejectUnauthorized: boolean;
    ca: string;
  };
};

export type QueryOptions = {
  name: string;
  text: string;
  values?: Array<string | boolean | undefined>;
};
