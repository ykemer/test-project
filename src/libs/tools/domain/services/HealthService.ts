type HealthService = {
  checkDatabase(): Promise<boolean>;
};

export type {HealthService};
