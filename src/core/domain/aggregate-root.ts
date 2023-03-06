import { AnyObject } from 'src/shared/types';
import { Entity } from './entity';

export abstract class AggregateRoot<T extends AnyObject> extends Entity<T> {}
