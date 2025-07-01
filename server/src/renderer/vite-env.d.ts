/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}