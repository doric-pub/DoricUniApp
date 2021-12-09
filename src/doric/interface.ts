class Interface {
  private static _instance: Interface

  private constructor () {
    // ...
  }

  public static get Instance () {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this())
  }

  // #region createSelectorQuery
  private _createSelectorQuery: Function

  public get createSelectorQuery (): Function {
    return this._createSelectorQuery
  }

  public set createSelectorQuery (value: Function) {
    this._createSelectorQuery = value
  }
  // #endregion

  // #region showToast
  private _showToast: Function

  public get showToast (): Function {
    return this._showToast
  }

  public set showToast (value: Function) {
    this._showToast = value
  }
  // #endregion

  // #region showModal
  private _showModal: Function

  public get showModal (): Function {
    return this._showModal
  }

  public set showModal (value: Function) {
    this._showModal = value
  }
  // #endregion

  // #region setStorage
  private _setStorage: Function

  public get setStorage (): Function {
    return this._setStorage
  }

  public set setStorage (value: Function) {
    this._setStorage = value
  }
  // #endregion

  // #region getStorage
  private _getStorage: Function

  public get getStorage (): Function {
    return this._getStorage
  }

  public set getStorage (value: Function) {
    this._getStorage = value
  }
  // #endregion

  // #region removeStorage
  private _removeStorage: Function

  public get removeStorage (): Function {
    return this._removeStorage
  }

  public set removeStorage (value: Function) {
    this._removeStorage = value
  }
  // #endregion

  // #region getStorageInfo
  private _getStorageInfo: Function

  public get getStorageInfo (): Function {
    return this._getStorageInfo
  }

  public set getStorageInfo (value: Function) {
    this._getStorageInfo = value
  }
  // #endregion

  // #region removeStorageSync
  private _removeStorageSync: Function

  public get removeStorageSync (): Function {
    return this._removeStorageSync
  }

  public set removeStorageSync (value: Function) {
    this._removeStorageSync = value
  }
  // #endregion

  // #region request
  private _request: Function

  public get request (): Function {
    return this._request
  }

  public set request (value: Function) {
    this._request = value
  }
  // #endregion

  // #region createAnimation
  private _createAnimation: Function

  public get createAnimation (): Function {
    return this._createAnimation
  }

  public set createAnimation (value: Function) {
    this._createAnimation = value
  }
  // #endregion
}

export const doricInterface = Interface.Instance
