# Online Diagnostic Lab System

Patient test report management system with digital workflows for healthcare diagnostics.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, Vite |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MySQL |
| **API** | REST |
| **Build** | Vite, npm |

## Project Structure

```
online-diagnostic-lab-system/
├── src/
│   ├── components/         # React components
│   ├── services/           # API services
│   ├── types.ts            # TypeScript types
│   ├── constants.tsx       # Application constants
│   └── App.tsx             # Root component
├── schema.sql              # Database schema
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── README.md
```

## Features

- **Patient Management**: Register and manage patient records
- **Test Catalog**: Define available diagnostic tests with pricing
- **Report Generation**: Digital test report creation and management
- **Results Entry**: Lab technician interface for entering results
- **Report Retrieval**: Patient portal for viewing/downloading reports
- **REST API**: Structured endpoints for all operations

## Database Schema

The `schema.sql` file contains the complete MySQL schema including:
- `patients` table — patient demographics and contact info
- `tests` table — test catalog with categories and pricing
- `test_orders` table — ordered tests linked to patients
- `test_results` table — results with values, units, reference ranges
- `users` table — lab staff authentication

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm

### Installation

```bash
# Clone repository
git clone https://github.com/abhxxy45/online-diagnostic-lab-system.git
cd online-diagnostic-lab-system

# Install dependencies
npm install

# Setup database
mysql -u root -p < schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

### Environment Variables

Create `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=diagnostic_lab
PORT=3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patients | List all patients |
| POST | /api/patients | Register new patient |
| GET | /api/tests | List available tests |
| POST | /api/orders | Create test order |
| PUT | /api/results/:id | Enter test results |
| GET | /api/reports/:patientId | Get patient reports |

## Development

```bash
# Frontend dev server
npm run dev

# Build for production
npm run build
```

## Screenshots

*To be added*

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Repository**: https://github.com/abhxxy45/online-diagnostic-lab-system