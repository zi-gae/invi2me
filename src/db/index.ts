import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as identity from './schema/identity';
import * as events from './schema/events';
import * as content from './schema/content';
import * as themes from './schema/themes';
import * as guests from './schema/guests';
import * as rsvp from './schema/rsvp';
import * as seating from './schema/seating';
import * as checkin from './schema/checkin';
import * as messaging from './schema/messaging';
import * as payments from './schema/payments';
import * as analytics from './schema/analytics';

export const schema = {
  ...identity,
  ...events,
  ...content,
  ...themes,
  ...guests,
  ...rsvp,
  ...seating,
  ...checkin,
  ...messaging,
  ...payments,
  ...analytics,
};

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

export type Database = typeof db;
