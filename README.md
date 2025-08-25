# Newtown School AI Assistant

A modern, iMessage-style chatbot interface designed specifically for Newtown School. This application provides students, parents, and visitors with an intuitive way to get information about the school through an AI-powered assistant.

## Features

### 🎨 Modern UI/UX
- **iMessage-inspired interface** with chat bubbles and smooth animations
- **Responsive design** that works perfectly on desktop and mobile
- **School branding** with Newtown School colors and logo
- **Typing indicators** and message timestamps for a realistic chat experience
- **Smooth animations** for message entry and interactions

### 🤖 AI-Powered Assistant
- **School-specific knowledge** about admissions, schedules, events, and programs
- **Real-time messaging** with OpenAI's Assistant API
- **Quick action buttons** for common questions
- **Contextual conversations** that remember previous messages

### 🏫 School-Focused Features
- **Welcome message** with common question shortcuts
- **School branding** throughout the interface
- **Accessibility features** with proper ARIA labels and keyboard navigation
- **Error handling** with graceful fallbacks

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom components
- **Backend**: FastAPI with Python
- **AI**: OpenAI Assistant API
- **Icons**: React Icons (Heroicons)
- **Fonts**: Inter font family

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- OpenAI API key
- OpenAI Assistant ID

### Installation

1. **Clone and install dependencies**:
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install React dependencies
cd app
npm install
```

2. **Configure OpenAI**:
   - Update `main.py` with your OpenAI API key and Assistant ID:
   ```python
   client = AsyncOpenAI(
       api_key="your-openai-api-key-here",
   )
   assistant_id = "your-assistant-id-here"
   ```

3. **Start the application**:
```bash
# Terminal 1: Start the FastAPI backend
python main.py

# Terminal 2: Start the React frontend
cd app
npm start
```

4. **Access the application**:
   - Open http://localhost:3000 in your browser
   - The backend API runs on http://localhost:8000

## Configuration

### OpenAI Assistant Setup
Create an OpenAI Assistant with knowledge about Newtown School:

1. Go to the OpenAI Platform
2. Create a new Assistant
3. Configure it with school-specific information:
   - School hours and schedules
   - Admissions requirements and process
   - Academic programs and curriculum
   - School events and calendar
   - Contact information
   - School policies and procedures
   - Extracurricular activities
   - Faculty information

### Customization

#### School Branding
Update the school colors in `app/src/index.css`:
```css
:root {
  --newtown-primary: #2563eb;    /* Primary school color */
  --newtown-secondary: #1e40af;  /* Secondary color */
  --newtown-accent: #3b82f6;     /* Accent color */
  --newtown-light: #dbeafe;      /* Light variant */
  --newtown-dark: #1e3a8a;       /* Dark variant */
}
```

#### Welcome Message
Customize the welcome message and quick actions in `app/src/components/WelcomeMessage.jsx`:
```javascript
const quickActions = [
    "School hours and schedule",
    "Admissions information",
    "Upcoming events",
    // Add your school-specific quick actions
];
```

#### School Information
Update school details in `app/src/components/ChatHeader.jsx`:
```javascript
<h1>Your School Name</h1>
<p>Your custom tagline</p>
```

## Project Structure

```
├── app/                          # React frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ChatHeader.jsx    # School-branded header
│   │   │   ├── ChatInput.jsx     # Message input with auto-resize
│   │   │   ├── ChatMessage.jsx   # Message bubbles
│   │   │   ├── TypingIndicator.jsx # Typing animation
│   │   │   ├── WelcomeMessage.jsx # Welcome screen
│   │   │   └── StatusIndicator.jsx # Status messages
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API services
│   │   ├── App.js                # Main application
│   │   └── index.css             # Global styles
├── main.py                       # FastAPI backend
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## API Endpoints

- `POST /api/new` - Create new conversation thread
- `GET /api/threads/{thread_id}` - Get thread messages
- `POST /api/threads/{thread_id}` - Send message to thread
- `GET /api/threads/{thread_id}/runs/{run_id}` - Get run status
- `POST /api/threads/{thread_id}/runs/{run_id}/tool` - Submit tool outputs

## Deployment

### Frontend (React)
```bash
cd app
npm run build
# Deploy the build/ folder to your hosting service
```

### Backend (FastAPI)
```bash
# Using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000

# Or deploy to your preferred Python hosting service
```

## Customization Guide

### Adding New Quick Actions
1. Edit `app/src/components/WelcomeMessage.jsx`
2. Add new items to the `quickActions` array
3. The assistant will automatically handle these as regular messages

### Styling Changes
- **Colors**: Update CSS variables in `app/src/index.css`
- **Layout**: Modify component styles in `app/src/App.css`
- **Components**: Edit individual component files in `app/src/components/`

### Adding New Features
1. **New message types**: Extend the message handling in `ChatMessage.jsx`
2. **Custom tools**: Add tool handling in `useRunRequiredActionsProcessing.js`
3. **New UI elements**: Create new components in the `components/` folder

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For technical support or questions about customization, please refer to the documentation or create an issue in the repository.

---

**Newtown School AI Assistant** - Making school information accessible through conversational AI.