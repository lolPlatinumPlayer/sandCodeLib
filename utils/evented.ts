/* 
本文件来源：
- mapbox的evented.js的全部内容
- mapbox的util.js中的extend方法
*/

function _addEventListener(type: any, listener: any, listenerList: any) {
  const listenerExists = listenerList[type] && listenerList[type].indexOf(listener) !== -1;
  if (!listenerExists) {
    listenerList[type] = listenerList[type] || [];
    listenerList[type].push(listener);
  }
}

function _removeEventListener(type: any, listener: any, listenerList: any) {
  if (listenerList && listenerList[type]) {
    const index = listenerList[type].indexOf(listener);
    if (index !== -1) {
      listenerList[type].splice(index, 1);
    }
  }
}

export class Event {
  type;

  constructor(type: any, data = {}) {
    extend(this, data);
    this.type = type;
  }
}

export class ErrorEvent extends Event {
  error: any;

  constructor(error: any, data = {}) {
    super('error', extend({ error }, data));
  }
}

/**
 * `Evented`类由其他类继承以让继承的类获得事件功能
 *
 * @class Evented
 */
export class Evented {
  _listeners: any;
  _oneTimeListeners: any;
  _eventedParent: any;
  _eventedParentData: any;

  /**
   * 将侦听器添加到指定的事件类型
   *
   * @param {string} type 事件类型
   * @param {Function} listener 事件触发时调用的函数。形参中固定有`target`和`type`属性，除此外不同事件可能会有些不同的其他属性
   * @returns {Object} 返回自身以允许链式调用
   */
  // fire时传入的对象会加上target和type后传给回调
  on(type: any, listener: any) {
    this._listeners = this._listeners || {};
    _addEventListener(type, listener, this._listeners);

    return this;
  }

  /**
   * 删除之前添加的侦听器
   *
   * @param {string} type 侦听器的事件类型
   * @param {Function} listener 侦听器函数
   * @returns {Object} 返回自身以允许链式调用
   */
  off(type: any, listener: any) {
    _removeEventListener(type, listener, this._listeners);
    _removeEventListener(type, listener, this._oneTimeListeners);

    return this;
  }

  /**
   * 将只调用一次的侦听器添加到指定的事件类型。
   *
   * 注册侦听器后第一次触发事件时将调用侦听器。
   *
   * @param {string} type 事件类型
   * @param {Function} [listener] 首次触发事件时要调用的函数。
   *   如果未提供，则返回一个 Promise，该 Promise 将在首次触发事件时 reslove。
   * @returns {Object} Returns `this` | Promise.
   */
  once(type: any, listener: any): object {
    if (!listener) {
      return new Promise((resolve) => this.once(type, resolve));
    }

    this._oneTimeListeners = this._oneTimeListeners || {};
    _addEventListener(type, listener, this._oneTimeListeners);

    return this;
  }

  fire(event: any, properties: any) {
    // Compatibility with (type: string, properties: Object) signature from previous versions.
    // See https://github.com/mapbox/mapbox-gl-js/issues/6522,
    //     https://github.com/mapbox/mapbox-gl-draw/issues/766
    if (typeof event === 'string') {
      event = new Event(event, properties || {});
    }

    const type = event.type;

    if (this.listens(type)) {
      event.target = this;

      // make sure adding or removing listeners inside other listeners won't cause an infinite loop
      const listeners =
        this._listeners && this._listeners[type] ? this._listeners[type].slice() : [];

      for (const listener of listeners) {
        listener.call(this, event);
      }

      const oneTimeListeners =
        this._oneTimeListeners && this._oneTimeListeners[type]
          ? this._oneTimeListeners[type].slice()
          : [];
      for (const listener of oneTimeListeners) {
        _removeEventListener(type, listener, this._oneTimeListeners);
        listener.call(this, event);
      }

      const parent = this._eventedParent;
      if (parent) {
        extend(
          event,
          typeof this._eventedParentData === 'function'
            ? this._eventedParentData()
            : this._eventedParentData
        );
        parent.fire(event);
      }

      // To ensure that no error events are dropped, print them to the
      // console if they have no listeners.
    } else if (event instanceof ErrorEvent) {
      console.error(event.error);
    }

    return this;
  }

  /**
   * Returns true if this instance of Evented or any forwarded instances of Evented have a listener for the specified type.
   *
   * @param {string} type The event type.
   * @returns {boolean} Returns `true` if there is at least one registered listener for specified event type, `false` otherwise.
   * @private
   */
  listens(type: any) {
    return !!(
      (this._listeners && this._listeners[type] && this._listeners[type].length > 0) ||
      (this._oneTimeListeners &&
        this._oneTimeListeners[type] &&
        this._oneTimeListeners[type].length > 0) ||
      (this._eventedParent && this._eventedParent.listens(type))
    );
  }

  /**
   * Bubble all events fired by this instance of Evented to this parent instance of Evented.
   *
   * @returns {Object} `this`
   * @private
   */
  setEventedParent(parent: any, data?: any) {
    this._eventedParent = parent;
    this._eventedParentData = data;

    return this;
  }
}

/**
 * Given a destination object and optionally many source objects,
 * copy all properties from the source objects into the destination.
 * The last source object given overrides properties from previous
 * source objects.
 *
 * @param dest destination object
 * @param sources sources from which properties are pulled
 * @private
 */
function extend(dest: any, ...sources: any) {
  for (const src of sources) {
    for (const k in src) {
      dest[k] = src[k];
    }
  }
  return dest;
}
