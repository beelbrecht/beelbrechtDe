
// Laden einzelner Assets
import '../.htaccess';
import '../favicon.ico';
import '../robots.txt';
require.context('../assets', true, /\.*$/)

// Laden von SCSS
import '../scss/app.scss';

// Laden von Javascript
import './main.js';
