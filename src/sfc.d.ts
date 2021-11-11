declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}
declare module 'doric' {
    export function registerViewTreeObserver(observer:any):void
}
