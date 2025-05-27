export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Get real PageSpeed data
    const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const performanceScore = data.lighthouseResult?.categories?.performance?.score * 100 || 70;
    
    // Scrape basic page data
    const pageResponse = await fetch(url);
    const html = await pageResponse.text();
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]+)['"][^>]*>/i);
    
    const title = titleMatch ? titleMatch[1].trim() : '';
    const metaDesc = descMatch ? descMatch[1].trim() : '';
    
    // Generate SEOtter analysis
    const titleScore = title.length >= 50 && title.length <= 60 ? 95 : 
                      title.length > 0 ? 70 : 20;
    const metaScore = metaDesc.length >= 140 && metaDesc.length <= 160 ? 95 : 
                     metaDesc.length > 0 ? 70 : 20;
    
    const overallScore = Math.round((titleScore + metaScore + performanceScore) / 3);
    
    const analysis = {
      score: overallScore,
      url: url,
      domain: new URL(url).hostname,
      checks: [
        {
          title: 'Title Tag Optimization',
          status: titleScore > 80 ? 'pass' : titleScore > 60 ? 'warning' : 'fail',
          priority: titleScore > 60 ? 'low' : 'high',
          currentValue: title.length,
          expectedValue: '50-60',
          unit: 'characters',
          description: titleScore > 80 ? 
            `Pawsome! 🦦 Your ${title.length}-character title is perfectly sized!` :
            `Your title needs some SEOtter love! Currently ${title.length} characters.`,
          recommendation: {
            title: "SEOtter's Title Tips",
            text: titleScore > 80 ? 
              "Your title tag is otter-perfect! Keep it up!" :
              "Make your title 50-60 characters with your main keyword first!",
            steps: [
              "Write a catchy 50-60 character title",
              "Put your most important keyword first", 
              "Make it compelling with power words",
              "Test how it looks in search results"
            ]
          }
        },
        {
          title: 'Page Speed & Performance',
          status: performanceScore > 80 ? 'pass' : performanceScore > 60 ? 'warning' : 'fail',
          priority: performanceScore > 60 ? 'low' : 'high',
          currentValue: Math.round(performanceScore),
          expectedValue: '90+',
          unit: 'performance score',
          description: performanceScore > 80 ?
            `Swift like an otter! 🏊‍♀️ Your ${Math.round(performanceScore)} score is great!` :
            `Your site could swim faster! Score: ${Math.round(performanceScore)}`,
          recommendation: {
            title: "SEOtter's Speed Tips",
            text: performanceScore > 80 ?
              "Your site loads fast as an otter dive!" :
              "Let's speed up your site for better rankings!",
            steps: [
              "Compress all images using TinyPNG",
              "Choose faster web hosting",
              "Remove unnecessary plugins",
              "Enable caching on your server"
            ]
          }
        }
      ],
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze website' });
  }
}
