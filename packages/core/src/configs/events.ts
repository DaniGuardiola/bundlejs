export const EVENT_NAME_PREFIX = "bundlejs";
export function EventName<T extends string>(name: T) {
  return `${EVENT_NAME_PREFIX}.${name}` as const;
}

export const INIT_START = EventName("init.start");
export const INIT_COMPLETE = EventName("init.complete");
export const INIT_ERROR = EventName("init.error");
export const INIT_LOADING = EventName("init.loading");

export const LOGGER_LOG = EventName("logger.log");
export const LOGGER_ERROR = EventName("logger.error");
export const LOGGER_WARN = EventName("logger.warn");
export const LOGGER_INFO = EventName("logger.info");

export const BUILD_ERROR = EventName("build.error");
export const TRANSFORM_ERROR = EventName("transform.error");

export interface IEVENT_MAP {
  [INIT_START]: void,
  [INIT_COMPLETE]: void,
  [INIT_ERROR]: Error,
  [INIT_LOADING]: any,

  [LOGGER_LOG]: any,
  [LOGGER_ERROR]: Error,
  [LOGGER_WARN]: any,
  [LOGGER_INFO]: any,

  [BUILD_ERROR]: Error,
  [TRANSFORM_ERROR]: Error,
}

export const EVENT_TARGET = new EventTarget();

export class CustomEvent<T = any> extends Event {
  readonly detail: T;
  constructor(type: string, options?: CustomEventInit<T>) {
    super(type, options)
    this.detail = Object(options).detail
  }
}

/**
 * Registers an event listener in the global scope, which will be called synchronously whenever the event type is dispatched.
 */
export function addEventListener<K extends keyof IEVENT_MAP>(
  type: K,
  listener: (this: Window, ev: CustomEvent<IEVENT_MAP[K]>) => any | EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  return EVENT_TARGET.addEventListener(type, listener, options)
}

/**
 * Registers an event listener in the global scope, which will be called synchronously whenever the event type is dispatched.
 */
export function removeEventListener<K extends keyof IEVENT_MAP>(
  type: K,
  listener: (this: Window, ev: CustomEvent<IEVENT_MAP[K]>) => any | EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  return EVENT_TARGET.removeEventListener(type, listener, options)
}

/**
 * Dispatches an event in the global scope, synchronously invoking any registered event listeners for this event in the appropriate order. 
 * Returns false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault(). 
 * Otherwise it returns true.
 */
export function dispatchEvent<K extends keyof IEVENT_MAP, A extends IEVENT_MAP[K] = any>(
  event: K | (string & {}) | CustomEvent<IEVENT_MAP[K]>, 
  args?: A
) {
  return EVENT_TARGET.dispatchEvent(
    typeof event === "string" ? 
      new CustomEvent(event, { detail: args }) : 
      event
  );
}

addEventListener(INIT_START, (e) => console.log(e.detail));
addEventListener(INIT_COMPLETE, (e) => console.info(e.detail));
addEventListener(INIT_ERROR, (e) => console.error(e.detail));
addEventListener(LOGGER_LOG, (e) => console.log(e.detail));
addEventListener(LOGGER_ERROR, (e) => console.error(e.detail));
addEventListener(LOGGER_WARN, (e) => console.warn(e.detail));
addEventListener(LOGGER_INFO, (e) => console.info(e.detail));
addEventListener(BUILD_ERROR, (e) => console.error(e.detail));