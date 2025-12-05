// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

// Try to load config file, fallback to hardcoded values
let config;
try {
  config = require('./config.js');
} catch (error) {
  console.log('Config file not found, using default settings');
  config = {
    email: {
      user: 'yashvardhanvats06@gmail.com',
      pass: 'umbkfbjhbrkywtpn'
    },
    server: {
      port: 5000
    }
  };
}

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (excluding index.html to avoid conflicts)
app.use(express.static(__dirname, {
  index: false
}));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

// Generate student offers based on game performance
function generateOffers(userData) {
  const offers = [];
  
  // Base offers for all students
  offers.push({
    title: "SAP Learning Hub Access",
    description: "Free 30-day access to SAP Learning Hub",
    discount: "100% off",
    code: "STUDENTHUB30"
  });
  
  offers.push({
    title: "Certification Discount",
    description: "25% off on SAP certification exams",
    discount: "25% off",
    code: "CERTSTUDENT25"
  });
  
  // XP-based offers
  if (userData.xp > 50) {
    offers.push({
      title: "Advanced Course Bundle",
      description: "Special discount on advanced courses",
      discount: "20% off",
      code: `XP${userData.xp}`
    });
  }
  
  // Achievement-based offers
  if (userData.achievements > 2) {
    offers.push({
      title: "Mentorship Session",
      description: "Free 1:1 mentorship session with industry expert",
      discount: "100% off",
      code: `ACHIEVE${userData.achievements}`
    });
  }
  
  // Streak-based offers
  if (userData.streak > 5) {
    offers.push({
      title: "Study Materials",
      description: "Free access to premium study materials",
      discount: "100% off",
      code: `STREAK${userData.streak}`
    });
  }
  
  return offers;
}

// API endpoint to submit user data
app.post('/api/submit', (req, res) => {
  const userData = req.body;
  
  try {
    // Generate offers based on student ID and game performance
    const offers = userData.studentId ? generateOffers(userData) : [];
    
    // Prepare email content
    let offerHtml = '<div style="margin: 20px 0;">';
    offers.forEach(offer => {
      offerHtml += `
        <div class="offer-card">
          <h4 style="margin: 0 0 10px 0; color: #4361ee;">${offer.title}</h4>
          <p style="margin: 5px 0;">${offer.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span class="badge">${offer.discount}</span>
            <span style="font-weight: bold; color: #333;">Code: ${offer.code}</span>
          </div>
        </div>
      `;
    });
    offerHtml += '</div>';
    
    const mailOptions = {
      from: 'Skill Sprint Pro <yashvardhanvats06@gmail.com>',
      to: userData.email,
      subject: 'Your Skill Sprint Pro Report and Special Offers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #4361ee, #3f37c9); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .offer-card { background: #f8f9fa; border-left: 4px solid #4361ee; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .stats { background: #e8f4f8; padding: 15px; border-radius: 10px; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; margin-top: 20px; }
            .badge { background: #4361ee; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 Skill Sprint Pro</h1>
            <p>Your Personalized Career Development Report</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userData.name}!</h2>
            <p>Thank you for completing your Skill Sprint Pro assessment! Here's your personalized career development report:</p>
            
            <div class="stats">
              <h3>📊 Your Profile Summary</h3>
              <p><strong>🎓 Course:</strong> ${userData.course || 'Not specified'}</p>
              <p><strong>💼 Desired Role:</strong> ${userData.jobRole || 'Not specified'}</p>
              <p><strong>🏆 Current Level:</strong> ${userData.xp ? Math.floor(userData.xp / 100) + 1 : 1}</p>
              <p><strong>⭐ XP Earned:</strong> ${userData.xp || 0}</p>
              <p><strong>🏅 Achievements:</strong> ${userData.achievements || 0}</p>
              <p><strong>🔥 Streak:</strong> ${userData.streak || 0} days</p>
            </div>
            
            <h3>🎁 Special Offers Just for You!</h3>
            ${offers.length > 0 ? offerHtml : '<p>No special offers available at this time, but keep checking back for new opportunities!</p>'}
            
            <h3>🚀 Next Steps</h3>
            <ul>
              <li>Complete your personalized learning roadmap</li>
              <li>Join our community forums for networking</li>
              <li>Schedule a mentorship session</li>
              <li>Track your progress with our gamified system</li>
            </ul>
            
            <h3>💡 Pro Tips</h3>
            <ul>
              <li>Set aside dedicated time each week for skill development</li>
              <li>Practice with real-world projects</li>
              <li>Network with professionals in your field</li>
              <li>Stay updated with industry trends</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Keep developing your skills and check back for new offers!</p>
            <p><strong>Best regards,</strong><br/>The Skill Sprint Pro Team</p>
            <p style="font-size: 12px; color: #666;">
              This email was sent to ${userData.email}<br/>
              If you have any questions, please contact us at support@skillsprintpro.com
            </p>
          </div>
        </body>
        </html>
      `
    };
    
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ 
          success: true, 
          message: 'Data submitted successfully! Check your email for offers.',
          offers: offers
        });
      }
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// AI Mentorship endpoint
app.post('/api/mentorship/chat', (req, res) => {
  const { message, userData, skillGaps, jobRole, chatHistory } = req.body;
  
  try {
    // Generate intelligent AI response based on user context
    const aiResponse = generateAIResponse(message, userData, skillGaps, jobRole, chatHistory);
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI response',
      error: error.message 
    });
  }
});

// AI Response Generation Function
function generateAIResponse(message, userData, skillGaps, jobRole, chatHistory) {
  const lowerMessage = message.toLowerCase();
  
  // Context-aware response generation
  const context = {
    jobRole: jobRole || 'professional',
    skillGaps: skillGaps || [],
    experience: userData?.experience || '0-1',
    course: userData?.course || 'Not specified',
    xp: userData?.xp || 0,
    achievements: userData?.achievements || 0
  };
  
  // Personalized greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return generateGreetingResponse(context);
  }
  
  // Skill gap related queries
  if (lowerMessage.includes('skill') || lowerMessage.includes('gap') || lowerMessage.includes('improve')) {
    return generateSkillGapResponse(context);
  }
  
  // Career advice queries
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('opportunity')) {
    return generateCareerAdviceResponse(context);
  }
  
  // Learning resources queries
  if (lowerMessage.includes('resource') || lowerMessage.includes('learn') || lowerMessage.includes('course') || lowerMessage.includes('study')) {
    return generateLearningResourceResponse(context);
  }
  
  // SAP specific queries
  if (lowerMessage.includes('sap') || lowerMessage.includes('certification')) {
    return generateSAPResponse(context);
  }
  
  // Project advice queries
  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('build')) {
    return generateProjectAdviceResponse(context);
  }
  
  // Interview preparation queries
  if (lowerMessage.includes('interview') || lowerMessage.includes('prepare') || lowerMessage.includes('question')) {
    return generateInterviewResponse(context);
  }
  
  // Networking queries
  if (lowerMessage.includes('network') || lowerMessage.includes('connect') || lowerMessage.includes('community')) {
    return generateNetworkingResponse(context);
  }
  
  // General career development
  if (lowerMessage.includes('roadmap') || lowerMessage.includes('plan') || lowerMessage.includes('timeline')) {
    return generateRoadmapResponse(context);
  }
  
  // Thank you responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return generateThankYouResponse(context);
  }
  
  // Default intelligent response
  return generateDefaultResponse(context, message);
}

// Response generation functions
function generateGreetingResponse(context) {
  const greetings = [
    `Hello! I'm your AI career mentor. I can see you're interested in ${context.jobRole} and have ${context.experience} years of experience. How can I help you today?`,
    `Hi there! Welcome to your personalized career coaching session. Based on your profile as a ${context.jobRole} with ${context.experience} experience, I'm here to guide your professional development. What would you like to discuss?`,
    `Greetings! I'm excited to help you advance your career in ${context.jobRole}. I notice you've earned ${context.xp} XP and ${context.achievements} achievements - great progress! What's on your mind today?`
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function generateSkillGapResponse(context) {
  if (context.skillGaps.length === 0) {
    return `Great news! Based on your assessment, your foundational knowledge in ${context.jobRole} appears strong. I recommend focusing on advanced topics and practical application. Consider working on real-world projects to showcase your skills.`;
  }
  
  const skillAdvice = context.skillGaps.map(skill => {
    const advice = getSkillSpecificAdvice(skill, context.jobRole);
    return `• **${skill}**: ${advice}`;
  }).join('\n');
  
  return `Based on your assessment, here are your key areas for improvement:\n\n${skillAdvice}\n\nI recommend prioritizing these skills based on your career goals. Would you like specific resources for any of these areas?`;
}

function generateCareerAdviceResponse(context) {
  const careerAdvice = {
    'Software Developer': `For ${context.jobRole}, focus on building a strong portfolio with diverse projects. Consider contributing to open source, participating in hackathons, and staying updated with the latest technologies.`,
    'SAP Consultant': `As a ${context.jobRole}, prioritize gaining hands-on experience with SAP systems. Consider pursuing SAP certifications, joining SAP Community Network, and building expertise in specific modules.`,
    'SAP Developer': `For ${context.jobRole}, master both ABAP and modern SAP technologies. Focus on SAP Cloud Platform, Fiori development, and understanding business processes.`,
    'Data Scientist': `As a ${context.jobRole}, build strong foundations in statistics, programming, and domain knowledge. Work on real data projects and develop your storytelling skills.`,
    'Lawyer': `For ${context.jobRole}, focus on developing strong research, writing, and advocacy skills. Consider specializing in emerging areas like technology law or intellectual property.`
  };
  
  return careerAdvice[context.jobRole] || `For ${context.jobRole}, focus on building relevant experience, networking with professionals in your field, and continuously updating your skills. Consider internships, certifications, and mentorship opportunities.`;
}

function generateLearningResourceResponse(context) {
  const resources = {
    'Software Developer': `**Recommended Resources for ${context.jobRole}:**\n• **Online Platforms**: LeetCode, HackerRank, Coursera, Udemy\n• **SAP Specific**: SAP Learning Hub, openSAP, SAP Community\n• **Projects**: Build full-stack applications, contribute to open source\n• **Books**: "Clean Code" by Robert Martin, "Design Patterns" by Gang of Four`,
    'SAP Consultant': `**Learning Resources for ${context.jobRole}:**\n• **SAP Official**: SAP Learning Hub, SAP Community Network\n• **Courses**: openSAP, SAP Training courses\n• **Practice**: SAP Sandbox environments, real-world scenarios\n• **Certifications**: SAP Certified Application Associate`,
    'SAP Developer': `**Resources for ${context.jobRole}:**\n• **SAP Development**: ABAP documentation, SAP UI5 tutorials\n• **Cloud**: SAP Cloud Platform, SAP BTP\n• **Practice**: SAP trial systems, development projects\n• **Community**: SAP Developer Center, Stack Overflow`
  };
  
  return resources[context.jobRole] || `**General Learning Resources:**\n• **Online Courses**: Coursera, Udemy, edX\n• **Practice Platforms**: Industry-specific challenges and projects\n• **Books**: Latest publications in your field\n• **Communities**: LinkedIn groups, Reddit communities, professional associations`;
}

function generateSAPResponse(context) {
  const sapAdvice = `**SAP Career Development:**\n\n**Certifications to Consider:**\n• SAP Certified Application Associate\n• SAP Certified Development Associate\n• SAP S/4HANA specific certifications\n\n**Learning Path:**\n1. Start with SAP fundamentals\n2. Choose your specialization (Development/Consulting)\n3. Gain hands-on experience\n4. Pursue relevant certifications\n5. Build a network in the SAP community\n\n**Resources:**\n• SAP Learning Hub (free for students)\n• openSAP courses\n• SAP Community Network\n• SAP Developer Center`;
  
  return sapAdvice;
}

function generateProjectAdviceResponse(context) {
  const projectIdeas = {
    'Software Developer': `**Project Ideas for ${context.jobRole}:**\n• Full-stack web application with modern tech stack\n• Mobile app with cross-platform development\n• API development with comprehensive documentation\n• Open source contribution to popular projects\n• Data visualization dashboard\n• E-commerce platform with payment integration`,
    'SAP Developer': `**SAP Project Ideas:**\n• Custom Fiori application for business processes\n• ABAP program for data analysis and reporting\n• Integration project connecting SAP with external systems\n• SAP HANA database optimization project\n• SAP Cloud Platform application\n• SAP UI5 dashboard for business metrics`,
    'Data Scientist': `**Data Science Projects:**\n• Predictive analytics model for business insights\n• Data visualization dashboard\n• Machine learning model for classification/prediction\n• Natural language processing application\n• Recommendation system\n• Time series analysis project`
  };
  
  return projectIdeas[context.jobRole] || `**General Project Ideas:**\n• Industry-specific application solving real problems\n• Portfolio website showcasing your skills\n• Data analysis project with insights\n• Automation tool for repetitive tasks\n• Integration project connecting multiple systems\n• Research project in your field of interest`;
}

function generateInterviewResponse(context) {
  const interviewTips = `**Interview Preparation for ${context.jobRole}:**\n\n**Technical Preparation:**\n• Review core concepts and recent developments\n• Practice coding problems (if applicable)\n• Prepare portfolio of your best work\n• Research the company and role thoroughly\n\n**Common Questions:**\n• "Tell me about a challenging project you worked on"\n• "How do you stay updated with industry trends?"\n• "Describe a time you solved a complex problem"\n• "What are your career goals?"\n\n**Questions to Ask:**\n• "What does success look like in this role?"\n• "How does the team collaborate?"\n• "What learning opportunities are available?"\n• "What are the biggest challenges facing the team?"`;
  
  return interviewTips;
}

function generateNetworkingResponse(context) {
  const networkingAdvice = `**Networking Strategies for ${context.jobRole}:**\n\n**Online Platforms:**\n• LinkedIn - Connect with professionals in your field\n• GitHub - Showcase your code and projects\n• Professional forums and communities\n• Industry-specific Slack/Discord groups\n\n**Offline Opportunities:**\n• Attend industry conferences and meetups\n• Join professional associations\n• Participate in hackathons and competitions\n• Volunteer for industry events\n\n**SAP Community:**\n• SAP Community Network\n• Local SAP User Groups\n• SAP events and conferences\n• SAP Developer Center forums`;
  
  return networkingAdvice;
}

function generateRoadmapResponse(context) {
  const roadmap = `**Personalized Career Roadmap for ${context.jobRole}:**\n\n**Short-term (3-6 months):**\n• Focus on identified skill gaps\n• Complete relevant online courses\n• Build 2-3 portfolio projects\n• Start networking in your field\n\n**Medium-term (6-12 months):**\n• Gain practical experience through internships/projects\n• Pursue relevant certifications\n• Contribute to open source or community projects\n• Attend industry events and conferences\n\n**Long-term (1-2 years):**\n• Establish yourself as a subject matter expert\n• Build a strong professional network\n• Consider specialization in emerging areas\n• Mentor others and give back to the community`;
  
  return roadmap;
}

function generateThankYouResponse(context) {
  const thanks = [
    `You're very welcome! I'm here to support your career journey in ${context.jobRole}. Feel free to ask me anything about skill development, career planning, or industry insights.`,
    `My pleasure! Remember, your career development is a journey, and I'm here to guide you every step of the way. Keep pushing forward with your goals in ${context.jobRole}!`,
    `Happy to help! You're making great progress with ${context.xp} XP and ${context.achievements} achievements. Keep up the excellent work in your ${context.jobRole} career!`
  ];
  
  return thanks[Math.floor(Math.random() * thanks.length)];
}

function generateDefaultResponse(context, originalMessage) {
  return `I understand you're asking about "${originalMessage}" in the context of your ${context.jobRole} career. While I don't have a specific response for this query, I can help you with:\n\n• Skill development strategies\n• Career planning and roadmap\n• Learning resources and courses\n• Project ideas and portfolio building\n• Interview preparation\n• Networking opportunities\n• SAP-specific guidance\n\nWhat would you like to focus on?`;
}

function getSkillSpecificAdvice(skill, jobRole) {
  const skillAdvice = {
    'Data Structures & Algorithms': 'Practice on LeetCode and HackerRank. Focus on understanding time complexity and common patterns.',
    'ABAP': 'Start with SAP Learning Hub ABAP courses. Practice with SAP trial systems and build simple programs.',
    'SAP UI5': 'Learn SAPUI5 framework through openSAP courses. Build responsive Fiori applications.',
    'SAP HANA': 'Study in-memory computing concepts. Practice with SAP HANA trial and CDS views.',
    'Legal Research': 'Practice with legal databases, learn citation methods, and develop analytical skills.',
    'Oral Advocacy': 'Join moot court competitions, practice public speaking, and develop argumentation skills.',
    'SAP Modules': 'Choose a core module (FI, CO, MM, SD) and gain deep expertise through hands-on practice.',
    'Business Process': 'Study end-to-end business processes and understand how different SAP modules integrate.',
    'Integration': 'Learn middleware solutions like SAP PI/PO and understand system integration patterns.'
  };
  
  return skillAdvice[skill] || `Focus on practical application and hands-on projects. Consider online courses and real-world practice.`;
}

// School Student Assessment endpoint
app.post('/api/submit-school-assessment', (req, res) => {
  const { name, email, studentType, stream, score, recommendation, assessmentAnswers, questions } = req.body;
  
  try {
    // Generate personalized email content for school students
    const emailContent = generateSchoolAssessmentEmail(name, stream, score, recommendation, assessmentAnswers, questions);
    
    // Email configuration
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: `🎓 Your Skill Sprint Junior Assessment Results - ${stream} Stream`,
      html: emailContent
    };
    
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending school assessment email:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send email',
          error: error.message 
        });
      } else {
        console.log('School assessment email sent successfully:', info.messageId);
        res.json({ 
          success: true, 
          message: 'Assessment results sent to email successfully',
          messageId: info.messageId
        });
      }
    });
    
  } catch (error) {
    console.error('Error processing school assessment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process assessment',
      error: error.message 
    });
  }
});

// Generate school assessment email content
function generateSchoolAssessmentEmail(name, stream, score, recommendation, assessmentAnswers, questions) {
  const streamInfo = getStreamInformation(stream);
  const isRecommended = score >= 70;
  
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .score-section { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .recommendation { background: ${isRecommended ? '#d4edda' : '#fff3cd'}; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .stream-info { background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .career-fields { background: #f3e5f5; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; margin-top: 30px; }
        .score { font-size: 2.5em; font-weight: bold; color: ${isRecommended ? '#28a745' : '#dc3545'}; }
        .highlight { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎓 Skill Sprint Junior Assessment Results</h1>
        <p>Your personalized career guidance report</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name}!</h2>
        <p>Thank you for completing the Skill Sprint Junior assessment. Here are your detailed results and personalized recommendations.</p>
        
        <div class="score-section">
          <h3>📊 Your Assessment Score</h3>
          <div class="score">${score}%</div>
          <p><strong>Stream Assessed:</strong> ${stream}</p>
          <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="recommendation">
          <h3>💡 Our Recommendation</h3>
          ${isRecommended ? 
            `<p><strong>🎉 Congratulations!</strong> Your assessment shows strong potential in the ${stream} stream. We recommend pursuing this path!</p>
             <div class="highlight">
               <strong>Next Steps:</strong>
               <ul>
                 <li>Focus on strengthening your core subjects</li>
                 <li>Explore related career opportunities</li>
                 <li>Consider joining relevant clubs or activities</li>
                 <li>Start building a portfolio of your work</li>
               </ul>
             </div>` :
            `<p><strong>Consider exploring other options:</strong> While the ${stream} stream is interesting, your assessment suggests you might be better suited for other streams.</p>
             <div class="highlight">
               <strong>Recommended Alternatives:</strong>
               <ul>
                 <li>${getAlternativeStreams(stream).primary} - This might be a better fit</li>
                 <li>${getAlternativeStreams(stream).secondary} - Also worth exploring</li>
                 <li>Take time to research different career paths</li>
                 <li>Consider talking to career counselors</li>
               </ul>
             </div>`
          }
        </div>
        
        <div class="stream-info">
          <h3>📚 About the ${stream} Stream</h3>
          <p>${streamInfo.description}</p>
          <p><strong>Key Subjects:</strong> ${streamInfo.subjects.join(', ')}</p>
        </div>
        
        <div class="career-fields">
          <h3>💼 Career Opportunities</h3>
          <p><strong>Potential Career Fields:</strong></p>
          <ul>
            ${streamInfo.careers.map(career => `<li>${career}</li>`).join('')}
          </ul>
        </div>
        
        <div class="highlight">
          <h3>🎯 Your Assessment Responses</h3>
          <p>Here's a summary of how you responded to the assessment questions:</p>
          ${generateAssessmentSummary(questions, assessmentAnswers)}
        </div>
        
        <div class="footer">
          <p><strong>Skill Sprint Junior</strong> - Empowering students to discover their potential</p>
          <p>For more career guidance, visit our platform or contact your school counselor.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return emailContent;
}

// Get stream information
function getStreamInformation(stream) {
  const streamData = {
    'Science': {
      description: 'The Science stream focuses on physics, chemistry, biology, and mathematics. It\'s perfect for students interested in research, medicine, engineering, and technology.',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
      careers: ['Medicine & Healthcare', 'Engineering', 'Research & Development', 'Technology & IT', 'Environmental Science', 'Pharmacy', 'Architecture', 'Data Science']
    },
    'Commerce': {
      description: 'The Commerce stream covers business, economics, accounting, and finance. It\'s ideal for students interested in business management, finance, and entrepreneurship.',
      subjects: ['Business Studies', 'Economics', 'Accounting', 'Mathematics'],
      careers: ['Business Management', 'Finance & Banking', 'Accounting & Auditing', 'Marketing & Sales', 'Entrepreneurship', 'Investment Banking', 'Consulting', 'Human Resources']
    },
    'Humanities': {
      description: 'The Humanities stream studies literature, history, geography, and social sciences. It\'s great for students interested in arts, law, media, and social work.',
      subjects: ['Literature', 'History', 'Geography', 'Political Science'],
      careers: ['Law & Legal Services', 'Media & Journalism', 'Education & Teaching', 'Social Work', 'Arts & Design', 'Public Relations', 'International Relations', 'Psychology']
    }
  };
  
  return streamData[stream] || streamData['Science'];
}

// Get alternative streams
function getAlternativeStreams(currentStream) {
  const alternatives = {
    'Science': { primary: 'Commerce', secondary: 'Humanities' },
    'Commerce': { primary: 'Humanities', secondary: 'Science' },
    'Humanities': { primary: 'Commerce', secondary: 'Science' }
  };
  
  return alternatives[currentStream] || { primary: 'Commerce', secondary: 'Humanities' };
}

// Generate assessment summary
function generateAssessmentSummary(questions, answers) {
  if (!questions || !answers) return '<p>Assessment data not available.</p>';
  
  let summary = '<ul>';
  questions.forEach((question, index) => {
    const answer = answers[index];
    const answerText = question.options[answer] || 'Not answered';
    summary += `<li><strong>Q${index + 1}:</strong> ${question.question}<br><em>Your response:</em> ${answerText}</li>`;
  });
  summary += '</ul>';
  
  return summary;
}

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'skill sprint.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Skill Sprint Pro Server running on port ${PORT}`);
  console.log(`📧 Email configured for: ${config.email.user}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api/test`);
});