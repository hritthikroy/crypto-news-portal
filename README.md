# Crypto News Portal

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/crypto-news-portal)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

A clean, minimal cryptocurrency news website that aggregates content from RSS feeds and provides a streamlined reading experience.

## Features

- Aggregates cryptocurrency news from multiple RSS feeds
- Single page view for full article content
- Related posts functionality
- View counters for articles
- Ad integration with skip functionality
- Responsive design
- Dynamic sitemap generation
- Fullscreen viewing option
- Clickable thumbnails that open in article viewer

## Deployment

### Vercel Deployment

1. Fork or clone this repository
2. Go to [Vercel](https://vercel.com/)
3. Connect with your GitHub account
4. Import your project repository
5. Configure the project (no additional configuration needed)
6. Deploy

Or deploy using the button below:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/crypto-news-portal)

### Heroku Deployment

1. Create a new app on [Heroku](https://heroku.com)
2. Link your GitHub repository
3. Configure buildpack as `nodejs`
4. Deploy the branch

Or deploy using the button below:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Manual Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crypto-news-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Visit `http://localhost:3000` (or the port specified in your environment)

### Environment Variables

If running in production, create a `.env` file with:
```
PORT=3000
NODE_ENV=production
```

## Technologies Used

- Node.js
- Express.js
- RSS Parser
- Cheerio (for HTML parsing)
- Axios (for HTTP requests)
- HTML5/CSS3/JavaScript

## Project Structure

```
crypto-news-portal/
├── server.js              # Main server file
├── index.html             # Homepage
├── post.html              # Single post page
├── css/
│   └── style.css          # Stylesheet
├── js/
│   ├── rss-feed.js        # RSS feed functionality 
│   └── post.js            # Post page functionality
├── images/                # Image assets
├── ads/                   # Ad-related assets
├── .env.example           # Environment variables example
├── Procfile               # Heroku deployment configuration
├── vercel.json            # Vercel deployment configuration
├── package.json           # Dependencies
├── README.md              # This file
└── sitemap.xml            # Dynamic sitemap endpoint
```

## API Endpoints

- `/` - Main homepage
- `/api/news` - Get latest news
- `/api/article?url=<url>` - Get specific article details
- `/api/proxy-content?url=<url>` - Proxy content to avoid CORS issues
- `/api/related-posts?url=<url>[&category=<category>]` - Get related posts
- `/api/view-count?url=<url>` - Get article view count
- `/sitemap.xml` - Dynamic sitemap
- `/post.html?url=<url>` - Single post view

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues, please open an issue in the GitHub repository.