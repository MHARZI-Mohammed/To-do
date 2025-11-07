# TypeScript Todo List Application

A modern, feature-rich todo list application built with TypeScript and styled with Tailwind CSS.

## Features

- ✅ Create, Read, Update, and Delete todos
- 📝 Add detailed descriptions to todos
- 🎯 Set priority levels (Low, Medium, High)
- 🔍 Filter todos by priority and status
- ✨ Clean and responsive user interface
- 💾 Local storage persistence
- 📱 Mobile-friendly design

## Technologies Used

- TypeScript
- Tailwind CSS
- HTML5
- LocalStorage API
- lite-server (for development)

## Prerequisites

Before running this project, make sure you have:
- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MHARZI-Mohammed/To-do.git
cd To-do
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Build the TypeScript files:
```bash
npm run build
```

2. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`

## Project Structure

```
To-do/
├── src/
│   ├── index.ts      # Main application logic
│   ├── models.ts     # Todo interface and class definitions
│   └── styles.css    # Tailwind CSS imports
├── public/
│   └── index.html    # Public HTML file
├── dist/            # Compiled JavaScript files
├── package.json
├── tsconfig.json    # TypeScript configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Features in Detail

### Todo Management
- Create new todos with title and optional description
- Set priority levels for better task organization
- Mark todos as completed/uncompleted
- Edit existing todos
- Delete unwanted todos
- Clear all completed todos at once

### Filtering System
- Filter by priority (All, Low, Medium, High)
- Filter by status (All, Active, Completed)

### Data Persistence
- All todos are automatically saved to local storage
- Todos persist between browser sessions

## Development

To work on this project:

1. Run the TypeScript compiler in watch mode:
```bash
npm run watch
```

2. In a separate terminal, start the development server:
```bash
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Mohammed MHARZI

---

Feel free to contribute to this project by submitting issues or pull requests!