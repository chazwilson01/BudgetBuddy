const compression = require('compression');
const helmet = require('helmet');

const optimizationMiddleware = (app) => {
    // Enable compression
    app.use(compression());

    // Set security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
                sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin']
            }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // Enable HTTP/2
    app.enable('trust proxy');

    // Cache control headers
    app.use((req, res, next) => {
        // Cache static assets for 1 year
        if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        
        // Add headers to support bfcache
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        next();
    });
};

module.exports = optimizationMiddleware; 