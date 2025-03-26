type HealthService = {
  checkDatabase(): Promise<boolean>;
  checkCache(): Promise<boolean>;
};

export type {HealthService};
