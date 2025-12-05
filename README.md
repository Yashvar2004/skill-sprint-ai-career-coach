# Skill Sprint Pro - Gamified Career Development Platform

A comprehensive career development platform with SAP integration, gamified learning, and AI-powered mentorship.

## Features

- 🎮 **Gamified Learning**: XP system, achievements, and progress tracking
- 📊 **SAP Integration**: SAP-specific learning paths and certifications
- 🤖 **AI Mentorship**: Interactive chat-based career guidance
- 📧 **Email Reports**: Personalized career reports sent via email
- 🎯 **Skill Assessment**: Interactive quizzes to identify skill gaps
- 🗺️ **Personalized Roadmaps**: Custom learning paths based on career goals
- 🧩 **Memory Games**: SAP-themed challenges for skill development
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** (comes with Node.js)

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure email settings** (optional):
   - Copy `config.example.js` to `config.js`
   - Update with your Gmail credentials for email functionality

### Running the Application

#### Option 1: Using the startup script (Windows)
```bash
start.bat
```

#### Option 2: Manual startup
1. **Start the backend server**:
   ```bash
   node server.js
   ```

2. **Open your browser** and go to:
   ```
   http://localhost:5000
   ```

## How It Works

### Frontend 
- **Gamified Interface**: Player stats, XP system, achievements
- **Multi-step Form**: Personal info → Career goals → Assessment → Roadmap → Mentorship
- **Interactive Elements**: Memory games, progress tracking, dark mode
- **Real-time Updates**: Live XP tracking and achievement notifications

### Backend (server.js)
- **Express Server**: RESTful API endpoints
- **Email Integration**: Sends personalized reports via Nodemailer
- **Offer Generation**: Creates student-specific offers based on performance
- **Static File Serving**: Serves the frontend directly

### Key Integration Points

1. **Data Submission**: Frontend sends user data to `/api/submit`
2. **Email Reports**: Backend generates and sends personalized emails
3. **Offer System**: Backend creates offers based on XP, achievements, and streak
4. **Real-time Communication**: Frontend polls backend for status updates

## API Endpoints

- `GET /` - Serves the main application
- `GET /api/test` - Health check endpoint
- `POST /api/submit` - Submit user data and generate offers

## Game Features

### XP System
- **Profile Setup**: +25 XP
- **Career Path Selection**: +20 XP
- **Assessment Completion**: +30 XP
- **Mentorship Start**: +15 XP
- **Daily Challenge**: +50 XP

### Achievements
- **First Steps**: Complete profile setup
- **Skill Assessor**: Complete skills assessment
- **Memory Master**: Complete SAP memory challenge

### Daily Challenges
- **Memory Puzzle**: Match SAP-related symbols
- **Time-based**: 60-second challenge window
- **Scoring**: Points based on matches and speed

## Customization

### Adding New Job Roles
1. Add role data to `jobData` object in `index.html`
2. Include skills, quiz questions, and roadmap logic
3. Update the job role dropdown

### Modifying Offers
1. Edit the `generateOffers` function in `server.js`
2. Add new offer types based on different criteria
3. Update email templates as needed

### Styling Changes
- Modify CSS variables in the `:root` selector
- Update color schemes and animations
- Add new game elements

## Troubleshooting

### Common Issues

1. **Server won't start**:
   - Check if port 5000 is available
   - Ensure Node.js is installed
   - Run `npm install` to install dependencies

2. **Email not sending**:
   - Verify Gmail credentials in config
   - Check if "Less secure app access" is enabled
   - Use app-specific passwords for 2FA accounts

3. **Frontend not loading**:
   - Ensure server is running on port 5000
   - Check browser console for errors
   - Try accessing `http://localhost:5000` directly

### Offline Mode
The application works offline for most features. Email functionality requires the backend server.

## File Structure

```
├── index.html          # Main frontend application
├── server.js           # Backend Express server
├── config.example.js   # Example configuration file
├── package.json        # Node.js dependencies
├── start.bat          # Windows startup script
└── README.md          # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer
- **Styling**: Bootstrap 5, Font Awesome
- **Charts**: Chart.js
- **PDF**: jsPDF

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**Skill Sprint Pro** - Empowering students with gamified career development and SAP integration! 🚀 
