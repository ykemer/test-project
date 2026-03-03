type HealthServiceInterface = {
  checkDatabase(): Promise<boolean>;
  checkCache(): Promise<boolean>;
};

export type {HealthServiceInterface};
