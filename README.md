# 10X CRM - Customer Relationship Management System

## About
10X CRM is a comprehensive client management system designed for sales managers to track and manage customer relationships, deals, and communications. Built with vanilla JavaScript, it provides an intuitive interface for managing client data, tracking deal statuses, and maintaining interaction history.

## Features
- **Authentication**: User registration and login with session management
- **Dashboard**: Real-time statistics, live clock, pipeline overview, and recent clients
- **Client Management**: Full CRUD operations (Create, Read, Update, Delete) with DummyJSON API integration
- **Advanced Filtering**: Search by name/company, filter by status (Lead/Contacted/Won/Lost), and sorting options
- **Client Details**: Modal views with notes history and follow-up reminders
- **Profile Management**: Edit profile, change password, and reset CRM data
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Bonus Features Implemented
- Edit Client functionality (PUT requests)
- Password strength indicator
- Session management with "Remember Me" option
- Kanban-style pipeline view
- CSV export capability
- Keyboard shortcuts
- Call timer in client details modal

## Tech Stack
- **HTML5** - Semantic markup
- **CSS3/SCSS** - Styling with CSS variables and mixins
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript
- **LocalStorage** - Client-side data persistence
- **DummyJSON API** - RESTful API for client data
- **Vercel** - Deployment and hosting

## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/Gocha-Pinturia/10X-CRM-Exam-PRD.git

2. Open index.html in your browser or use a local server:

## Live Demo
[https://10-x-crm-exam-prd.vercel.app/](https://10-x-crm-exam-prd.vercel.app/)

## Test Account
You can use the following credentials or create your own account:
- Email: demo@test.com
- Password: demo1234
Or simply register a new account on the Sign Up page.

## File Structure
10X-CRM-Exam-PRD/
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── clients.js
│   ├── dashboard.js
│   ├── data.js
│   ├── guard.js
│   ├── layout.js
│   ├── login.js
│   ├── profile.js
│   ├── responsive.js
│   ├── storage.js
│   └── ui.js
├── scss/
│   ├── _base.scss
│   ├── _clients.scss
│   ├── _components.scss
│   ├── _variables.scss
│   └── style.scss
├── index.html (Login)
├── signup.html
├── dashboard.html
├── clients.html
├── profile.html
├── README.md
├── ai-log.md
├── glossary.md
└── research-note.md

## LocalStorage Keys
- crm_users - Array of registered users
- crm_session - Current session data
- crm_clients - Array of client objects
- crm_theme - Theme preference ("dark" or "light")

## Credits
- Primary AI Assistant: Qwen (Alibaba Cloud) - Main development assistance, code architecture, and implementation
- Secondary AI Assistant: Gemini (Google) - Additional debugging and feature suggestions
- API: DummyJSON - Free test API for client data
- Developer: Gocha Pinturia

## License
- This project is created as an exam project for 10X JavaScript module.

🛠️ Developer: Gocha Pinturia
📅 Date: July 2026
🚀 Exam Project: 10X CRM System