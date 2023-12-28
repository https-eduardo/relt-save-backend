import { Category } from '@prisma/client';

export interface ChargeByCategoryFetch {
  value: number;
  transaction: {
    categories: Category[];
  };
}

export interface ChargeByCategoryResult {
  name: string;
  color?: string;
  value: number;
}
