'use strict';
import Module from 'module';

const CURRENT_URL = import.meta.url;
const builtins = Module.builtinModules;

export async function resolve(specifier, parentModuleURL, defaultResolver) {
    if (builtins.includes(specifier)) {
        return defaultResolver(specifier, parentModuleURL);
    }
    if (parentModuleURL && parentModuleURL !== CURRENT_URL) {
        const res = defaultResolver(specifier, parentModuleURL);
        res.url += '_'; // We need uniques URLs over the whole project
        res.format = 'dynamic';
        return res;
    }
    return defaultResolver(specifier, parentModuleURL);
}

export async function dynamicInstantiate(url) {
    const mod = await import(url.slice(0, -1)); // remove trailling '_'
    const exports = Object.keys(mod);
    exports.push('TEST_MOCK');
    return {
        exports,
        execute: (exports) => {
            const Mock = new Map();
            exports.TEST_MOCK.set(Mock);
            for (const key in mod) {
                const handler = {};
                Mock.set(key, handler);
                exports[key].set(new Proxy(mod[key], handler));
            }
        }
    };
}
