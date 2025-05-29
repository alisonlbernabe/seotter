# SEOtter 🦦 - Professional SEO Analysis Tool

A comprehensive SEO analysis tool that provides actionable insights for website optimization. Built with vanilla JavaScript and powered by Google PageSpeed Insights and OpenAI.

## ✨ Features

- **Real-time SEO Analysis** - Comprehensive website analysis in 10-30 seconds
- **Performance Metrics** - Core Web Vitals, loading speed, and optimization opportunities  
- **Technical SEO** - Meta tags, headers, images, internal linking analysis
- **AI-Powered Recommendations** - Smart suggestions powered by OpenAI GPT
- **Beautiful UI** - Modern, responsive design with animations
- **Free Tier** - 3 free analyses per day
- **Real Data** - Uses Google PageSpeed Insights API for accurate metrics

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/seotter
cd seotter
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Get your OpenAI API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Get your Google PageSpeed API key from: https://developers.google.com/speed/docs/insights/v5/get-started
GOOGLE_PAGESPEED_API_KEY=your-google-pagespeed-api-key-here
```

### 3. Install Dependencies (Optional)

```bash
npm install
```

### 4. Run Locally

```bash
# Using Vercel CLI (recommended)
npx vercel dev

# Or serve statically (limited functionality)
python -m http.server 3000
```

### 5. Open in Browser

Visit `http://localhost:3000` and start analyzing websites!

## 🔧 API Keys Setup

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add credits to your account ($5 minimum)
4. Copy the key to your `.env` file

### Google PageSpeed API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the PageSpeed Insights API
4. Create credentials (API Key)
5. Copy the key to your `.env` file

## 🛠️ Testing & Debugging

### Run Debug Tests

```bash
npm run debug
```

This will test:
- Environment variables
- API endpoints
- Performance metrics
- Error handling

### Manual Testing

1. Start development server: `vercel dev`
2. Open browser to `http://localhost:3000`  
3. Try analyzing `google.com` or `example.com`
4. Check browser console for errors

### Common Issues

**❌ "API key not configured"**
- Check your `.env` file exists
- Verify API keys are correct
- Restart development server

**❌ "Analysis failed" errors**
- Check API key quotas/billing
- Verify internet connection
- Try a different website URL

**❌ "CORS errors"**
- Use `vercel dev` instead of other servers
- Check `vercel.json` configuration

## 📁 File Structure

```
seotter/
├── api/
│   └── analyze.js          # Main API endpoint
├── .env.example            # Environment template  
├── .env                    # Your API keys (create this)
├── .gitignore             # Git ignore rules
├── auth.js                # Authentication (Supabase)
├── config.js              # App configuration
├── debug-api.js           # Debug utility
├── index.html             # Main application
├── package.json           # Dependencies
├── vercel.json            # Deployment config
└── README.md              # This file
```

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Add environment variables in Vercel dashboard

### Deploy to Netlify

1. Build command: `echo "Static site"`
2. Publish directory: `./`
3. Add environment variables in Netlify dashboard
4. Add serverless functions for `/api/analyze`

## 🔒 Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use environment variables for API keys
- ✅ Implement rate limiting in production
- ✅ Validate all user inputs
- ✅ Use HTTPS in production

## 📊 Performance Optimization

- **Caching**: Results cached for 1 hour
- **Rate Limiting**: 3 requests per day (free tier)
- **Timeout**: 30-second analysis timeout
- **Fallback Data**: Graceful degradation if APIs fail

## 🎨 Customization

### Modify Scoring Algorithm

Edit `calculateAdvancedSEOScore()` in `api/analyze.js`:

```javascript
const weights = {
    performance: 0.25,    // 25%
    technical: 0.25,      // 25% 
    content: 0.30,        // 30%
    social: 0.10,         // 10%
    security: 0.10        // 10%
};
```

### Add New Analysis Features

1. Create new extraction function in `api/analyze.js`
2. Add to parallel analysis array
3. Update scoring calculations
4. Add UI display in `index.html`

### Customize UI Theme

Edit CSS variables in `index.html`:

```css
:root {
    --water-blue: #06b6d4;
    --ocean-deep: #0891b2;
    --sea-foam: #67e8f9;
    /* Add your colors */
}
```

## 🐛 Troubleshooting

### Issue: High API Costs

**Solution**: Implement caching and rate limiting

```javascript
// Add to api/analyze.js
const cache = new Map();
const cacheKey = `analysis_${url}`;
if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
}
```

### Issue: Slow Analysis Times

**Solutions**:
- Reduce timeout values
- Implement progress callbacks
- Add result caching
- Use CDN for static assets

### Issue: CORS Problems

**Solution**: Use proper headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

## 📝 Development Workflow

1. **Local Development**
   ```bash
   vercel dev
   npm run debug
   ```

2. **Testing**
   ```bash
   # Test API endpoints
   curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"url":"https://google.com"}'
   ```

3. **Deployment**
   ```bash
   vercel --prod
   ```

## 📈 Roadmap

- [ ] User authentication with Supabase
- [ ] Analysis history and dashboard
- [ ] Bulk URL analysis
- [ ] Custom reporting
- [ ] Competitive analysis
- [ ] WordPress plugin
- [ ] API for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 💬 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/seotter/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/seotter/discussions)
- 📧 **Email**: support@seotter.com

## 🙏 Acknowledgments

- Google PageSpeed Insights API
- OpenAI GPT for AI recommendations  
- Vercel for hosting platform
- Inter & JetBrains Mono fonts

---

Made with 🦦 by [Your Name](https://github.com/yourusername)
