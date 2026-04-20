import EventEmitter from 'events';

class AttractionEventEmitter extends EventEmitter { }
export const attractionEvents = new AttractionEventEmitter();

export const REVIEW_CREATED = 'REVIEW_CREATED';
