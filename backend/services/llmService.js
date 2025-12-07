const Groq = require('groq-sdk');

// Initialize Groq client
let groq = null;

function initializeGroq() {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    return true;
  }
  return false;
}

// In-memory cache for performance
const planCache = new Map();
const CACHE_TTL = 3600000; // 1 hour
const MAX_CACHE_SIZE = 100;

/**
 * Generate plan using Groq API (ultra-fast!) with fallback to mock
 */
async function generatePlan(goalText) {
  // Check cache first
  const cacheKey = goalText.toLowerCase().trim();
  const cached = planCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('✅ Cache hit - returning cached plan');
    return cached.plan;
  }

  // Try Groq first (super fast!)
  if (initializeGroq()) {
    try {
      const plan = await generateWithGroq(goalText);
      cachePlan(cacheKey, plan);
      return plan;
    } catch (error) {
      console.error('❌ Groq error:', error.message);
      console.log('🔄 Falling back to enhanced mock');
    }
  } else {
    console.log('⚠️ Groq API key not configured, using enhanced mock');
  }

  // Fallback to enhanced mock
  return generateEnhancedMock(goalText);
}

/**
 * Generate plan using Groq API (Lightning Fast!)
 * Uses Llama 3.3 70B Versatile - extremely fast and high quality
 */
async function generateWithGroq(goalText) {
  console.log('⚡ Calling Groq API (Llama 3.3 70B Versatile)...');

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',  // Latest Llama 3.3 - Fast and powerful!
    messages: [
      {
        role: 'system',
        content: `You are an expert task planning assistant. Generate detailed, actionable task plans in JSON format.

Return ONLY valid JSON (no markdown, no code blocks, no explanations):
{
  "tasks": [
    {
      "title": "📋 Clear title with emoji",
      "description": "Detailed 2-3 sentence description with specific actions",
      "order": 1,
      "dependsOn": null,
      "estimatedDays": 3
    }
  ]
}

Requirements:
- Generate 8-10 tasks total
- Use relevant emojis in titles (📋🎨🚀💻🔍📊🧪🎯💾⚙️)
- Write detailed descriptions (2-3 sentences explaining what to do)
- Set logical dependencies (null for independent tasks, number for dependent)
- Provide realistic time estimates (1-30 days)
- Use sequential order (1, 2, 3, 4...)
- Be professional and actionable
- Focus on practical, implementable steps`
      },
      {
        role: 'user',
        content: `Create a detailed task plan for this goal: "${goalText}"

Analyze the goal and generate 8-10 specific, actionable tasks with:
- Clear titles with relevant emojis
- Detailed descriptions (2-3 sentences each)
- Logical task dependencies
- Realistic time estimates in days
- Professional formatting

Return ONLY the JSON object with the tasks array. No other text.`
      }
    ],
    temperature: 0.7,
    max_tokens: 2500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0].message.content;
  const plan = JSON.parse(content);

  // Validate structure
  if (!plan.tasks || !Array.isArray(plan.tasks) || plan.tasks.length === 0) {
    throw new Error('Invalid plan structure from Groq');
  }

  // Validate and normalize each task
  plan.tasks.forEach((task, index) => {
    if (!task.title || !task.description || task.order === undefined) {
      throw new Error(`Invalid task structure at index ${index}`);
    }
    task.order = parseInt(task.order);
    task.estimatedDays = parseInt(task.estimatedDays) || 1;
    task.dependsOn = task.dependsOn ? parseInt(task.dependsOn) : null;
  });

  console.log(`✅ Generated ${plan.tasks.length} tasks with Groq (Lightning fast!)`);
  return plan;
}

/**
 * Cache management
 */
function cachePlan(key, plan) {
  if (planCache.size >= MAX_CACHE_SIZE) {
    const firstKey = planCache.keys().next().value;
    planCache.delete(firstKey);
  }
  planCache.set(key, { plan, timestamp: Date.now() });
}

/**
 * Enhanced mock generator (fallback)
 */
function generateEnhancedMock(goalText) {
  const lower = goalText.toLowerCase();
  
  if (lower.includes('app') || lower.includes('software') || lower.includes('application')) {
    return { tasks: [
      { title: '📋 Define Requirements and Scope', description: 'Document all features, user stories, and technical requirements. Create detailed specification including target audience, core functionality, and success metrics. Define MVP features vs nice-to-have features.', order: 1, dependsOn: null, estimatedDays: 3 },
      { title: '🎨 Design UI/UX and User Flows', description: 'Create wireframes and mockups for all screens. Design user flows, navigation patterns, and choose design system with colors and typography.', order: 2, dependsOn: 1, estimatedDays: 5 },
      { title: '🏗️ Setup Development Environment', description: 'Choose tech stack, setup version control with Git, configure CI/CD pipeline, and create development/staging/production environments.', order: 3, dependsOn: 2, estimatedDays: 2 },
      { title: '💾 Design and Implement Database', description: 'Design database schema with entities and relationships. Setup database, create migrations, seed data, and implement data models with validation.', order: 4, dependsOn: 3, estimatedDays: 4 },
      { title: '⚙️ Build Backend API', description: 'Develop RESTful API endpoints for all features. Implement authentication, authorization, input validation, error handling, and API documentation.', order: 5, dependsOn: 4, estimatedDays: 10 },
      { title: '🎯 Develop Frontend Components', description: 'Build reusable UI components based on designs. Implement state management, create responsive layouts, and add animations for better UX.', order: 6, dependsOn: 5, estimatedDays: 12 },
      { title: '🔗 Integrate Frontend with Backend', description: 'Connect frontend to API endpoints. Implement data fetching, caching strategies, loading states, and comprehensive error handling.', order: 7, dependsOn: 6, estimatedDays: 5 },
      { title: '🧪 Testing and Quality Assurance', description: 'Write unit tests for critical functions. Perform integration testing, conduct user acceptance testing, fix bugs, and optimize performance across devices.', order: 8, dependsOn: 7, estimatedDays: 6 },
      { title: '🚀 Deployment and Launch', description: 'Deploy to production environment. Setup domain, SSL certificates, configure CDN, implement monitoring, and create backup/disaster recovery plan.', order: 9, dependsOn: 8, estimatedDays: 3 },
      { title: '📊 Post-Launch Monitoring', description: 'Monitor user analytics and feedback. Track KPIs, fix critical bugs immediately, plan improvements based on user feedback, and maintain regular updates.', order: 10, dependsOn: 9, estimatedDays: 7 }
    ]};
  }
  
  if (lower.includes('learn') || lower.includes('study') || lower.includes('course')) {
    return { tasks: [
      { title: '🎯 Define Learning Objectives', description: 'Clearly outline what you want to learn and why. Set specific measurable goals, identify current skill level and knowledge gaps, define success criteria.', order: 1, dependsOn: null, estimatedDays: 1 },
      { title: '📚 Research and Gather Resources', description: 'Find high-quality courses, tutorials, and documentation. Identify books, videos, online platforms, join relevant communities, create curated learning list.', order: 2, dependsOn: 1, estimatedDays: 2 },
      { title: '📅 Create Study Schedule', description: 'Allocate specific time blocks for learning each day. Break down topics into manageable chunks, set weekly milestones, balance theory with practice.', order: 3, dependsOn: 2, estimatedDays: 1 },
      { title: '📖 Study Fundamentals', description: 'Start with basics and build strong foundation. Take detailed notes, watch tutorials, read documentation, complete exercises and quizzes.', order: 4, dependsOn: 3, estimatedDays: 10 },
      { title: '💻 Build Practice Projects', description: 'Apply concepts through hands-on coding projects. Start simple then increase complexity, follow tutorials first then build independently, push to GitHub.', order: 5, dependsOn: 4, estimatedDays: 14 },
      { title: '🤝 Engage with Community', description: 'Join study groups or find accountability partners. Ask questions on Stack Overflow/Discord, share progress, help others to reinforce learning.', order: 6, dependsOn: null, estimatedDays: 3 },
      { title: '🔄 Review and Reinforce', description: 'Regularly review notes and key concepts. Use spaced repetition for retention, redo challenging exercises, create flashcards, teach concepts to others.', order: 7, dependsOn: 5, estimatedDays: 5 },
      { title: '🎓 Complete Capstone Project', description: 'Build comprehensive project showcasing all skills. Get feedback from experienced developers, update resume and portfolio, prepare for interviews.', order: 8, dependsOn: 7, estimatedDays: 7 }
    ]};
  }
  
  if (lower.includes('business') || lower.includes('startup') || lower.includes('company')) {
    return { tasks: [
      { title: '💡 Validate Business Idea', description: 'Research market demand and target audience. Analyze competitors, identify gaps, conduct customer surveys, define unique value proposition, assess market size.', order: 1, dependsOn: null, estimatedDays: 5 },
      { title: '📊 Create Business Plan', description: 'Write executive summary and company description. Define business model, revenue streams, create financial projections, outline marketing strategy.', order: 2, dependsOn: 1, estimatedDays: 7 },
      { title: '🏢 Legal Setup and Registration', description: 'Choose business structure (LLC/Corp). Register business name, get EIN, open business bank account, obtain licenses, setup accounting system.', order: 3, dependsOn: 2, estimatedDays: 4 },
      { title: '💰 Secure Funding', description: 'Calculate startup costs and runway. Explore funding options (bootstrapping/loans/investors), prepare pitch deck, apply for loans/grants, setup financial tracking.', order: 4, dependsOn: 3, estimatedDays: 10 },
      { title: '🎨 Build Brand Identity', description: 'Design logo and visual identity. Create brand guidelines, develop website and social media presence, create marketing materials, establish positioning.', order: 5, dependsOn: 4, estimatedDays: 6 },
      { title: '🛠️ Develop Product or Service', description: 'Build MVP (Minimum Viable Product). Test with beta users, gather feedback, iterate based on input, ensure quality and reliability.', order: 6, dependsOn: 5, estimatedDays: 20 },
      { title: '📣 Launch Marketing Campaign', description: 'Develop go-to-market strategy. Create content marketing plan, setup email marketing, run paid advertising campaigns, build partnerships.', order: 7, dependsOn: 6, estimatedDays: 8 },
      { title: '🚀 Official Launch', description: 'Announce launch to target audience. Host launch event/webinar, offer special promotions for early customers, monitor metrics, provide excellent support.', order: 8, dependsOn: 7, estimatedDays: 3 },
      { title: '📈 Scale and Grow', description: 'Analyze metrics and KPIs regularly. Optimize operations and processes, hire team members as needed, expand product line, explore new markets.', order: 9, dependsOn: 8, estimatedDays: 30 }
    ]};
  }
  
  // Generic plan for any other goal
  return { tasks: [
    { title: '🎯 Define Clear Objectives', description: 'Break down goal into specific measurable outcomes. Identify what success looks like, set realistic timeline and milestones, consider resources and constraints.', order: 1, dependsOn: null, estimatedDays: 2 },
    { title: '🔍 Research and Planning', description: 'Gather information and best practices. Learn from others who achieved similar goals, identify potential challenges and solutions, create detailed action plan.', order: 2, dependsOn: 1, estimatedDays: 3 },
    { title: '📋 Break Into Smaller Tasks', description: 'Divide goal into manageable chunks. Create weekly and daily action items, prioritize by importance and urgency, set deadlines with buffer time.', order: 3, dependsOn: 2, estimatedDays: 2 },
    { title: '🚀 Take Initial Action', description: 'Start with easiest or most critical task. Build momentum with quick wins, overcome initial resistance and procrastination, establish routine and habits.', order: 4, dependsOn: 3, estimatedDays: 5 },
    { title: '💪 Build Consistency', description: 'Work on goal regularly (daily or weekly). Create accountability system, remove distractions and obstacles, stay motivated with rewards and support.', order: 5, dependsOn: 4, estimatedDays: 14 },
    { title: '📊 Monitor and Adjust', description: 'Track progress against milestones. Measure results and outcomes, identify what works and what doesn\'t, adjust strategy based on feedback and data.', order: 6, dependsOn: 5, estimatedDays: 7 },
    { title: '🔄 Overcome Obstacles', description: 'Identify and address challenges proactively. Seek help or advice when stuck, learn from setbacks and failures, stay flexible and adapt approach as needed.', order: 7, dependsOn: 6, estimatedDays: 5 },
    { title: '🎯 Final Push and Completion', description: 'Focus on remaining tasks with increased effort. Handle final details and polish, verify all objectives are met, document lessons learned for future reference.', order: 8, dependsOn: 7, estimatedDays: 7 },
    { title: '🎉 Celebrate and Reflect', description: 'Acknowledge your achievement and hard work. Reflect on journey and personal growth, share success with others, set new goals to maintain momentum.', order: 9, dependsOn: 8, estimatedDays: 2 }
  ]};
}

module.exports = { generatePlan };
