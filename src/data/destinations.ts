import { seedDestinations } from './dbSeed';
import type { SeedDestination } from './dbSeed';

export type Destination = SeedDestination;
export const destinations = seedDestinations;

