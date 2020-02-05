
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 : content loaded');
    const app = new ThreeApp();
    app.render();
});

