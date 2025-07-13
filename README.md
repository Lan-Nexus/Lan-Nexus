<div align="center">
  <img src="client/resources/logo.png" alt="Lan Nexus Logo" width="200"/>
</div>

# Lan Nexus

A cross-platform LAN game launcher that allows you to play games with your friends over a local network. This application consists of both a desktop client (Electron app) and a web server for game management.

## Overview

Lan Nexus is designed to facilitate LAN gaming by providing:
- **Game Management**: Add, organize, and manage games from various sources (archives, Steam)
- **Network Discovery**: Automatic server discovery on the local network
- **Game Key Management**: Handle game keys for multiplayer sessions
- **Script Automation**: Custom install, uninstall, and play scripts for games
- **Web Interface**: Server-side web interface for game administration
- **Auto-Updates**: Automatic client updates via GitHub releases

## Architecture

### Client Application
- **Technology**: Electron + Vue 3 + TypeScript + Tailwind CSS
- **Features**: 
  - Cross-platform desktop application (Windows, macOS, Linux)
  - Game library management and launching
  - Network server discovery
  - Auto-update functionality
  - Game installation from archives

### Server Application
- **Technology**: Node.js + Express + Vue 3 + TypeScript + MySQL
- **Features**:
  - RESTful API for game management
  - Web-based admin interface
  - Steam integration (SteamGridDB, Steam Web API)
  - Game key management system
  - Database-driven game storage

## Prerequisites

### Client
- Node.js 18 or higher
- npm or yarn

### Server
- Node.js 18 or higher
- MySQL 8.0 or higher
- Steam API Key (optional, for Steam integration)
- SteamGridDB API Key (optional, for game artwork)

## Installation & Setup

### Environment Variables

Create a `.env` file in the server directory with the following:

```env
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/mydatabase

# Steam Integration (Optional)
STEAM_API_KEY=your_steam_api_key_here
STEAM_GRID_ID_KEY=your_steamgriddb_api_key_here

# Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
AUTH_TIME=24

# Server Configuration
PORT=3000
PROTOCOL=http
```

### Quick Start with Docker

1. **Clone the repository**:
   ```bash
   git clone https://github.com/samdems/Lan-Launcher.git
   cd Lan-Nexus
   ```

2. **Start the server with Docker**:
   ```bash
   cd server
   docker-compose up -d
   ```

3. **Run database migrations**:
   ```bash
   npm run migrate
   ```

### Manual Installation

#### Server Setup

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Set up MySQL database**:
   - Create a MySQL database
   - Update `DATABASE_URL` in your `.env` file

3. **Run database migrations**:
   ```bash
   npm run generate
   npm run migrate
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

#### Client Setup

1. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Development mode**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   # Windows
   npm run build:win
   
   # macOS
   npm run build:mac
   
   # Linux
   npm run build:linux
   ```

## Usage

### Server Management

1. **Access the web interface**: Navigate to `http://localhost:3000`
2. **Login**: Use the admin credentials from your `.env` file
3. **Add games**: 
   - Upload game archives
   - Import from Steam
   - Search SteamGridDB for game metadata

### Client Usage

1. **Server Discovery**: The client automatically discovers servers on the local network
2. **Game Library**: Browse and manage your game collection
3. **Game Installation**: Install games from server archives
4. **Game Launching**: Launch games with custom scripts and parameters

### Game Types

#### Archive Games
- Upload ZIP/archive files containing game files
- Custom install/uninstall/play scripts
- Support for game keys and multiplayer coordination

#### Steam Games
- Import games from Steam library
- Automatic metadata and artwork fetching
- Direct Steam protocol launching

## API Reference

### Games API
- `GET /api/games` - List all games
- `POST /api/games` - Create a new game
- `GET /api/games/:id` - Get game details
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Game Keys API
- `GET /api/games/:gameId/keys` - List game keys
- `POST /api/games/:gameId/keys/reserve` - Reserve a game key
- `POST /api/games/:gameId/keys/:keyId/release` - Release a game key

### Search API
- `POST /api/search` - Search SteamGridDB for games
- `GET /api/search/:gameId` - Get game details from SteamGridDB

## Development

### Project Structure

```
Lan-Nexus/
├── client/                 # Electron client application
│   ├── src/
│   │   ├── main/          # Electron main process
│   │   ├── preload/       # Preload scripts
│   │   └── renderer/      # Vue.js frontend
│   ├── games/             # Game files storage
│   └── resources/         # Application resources
├── server/                # Node.js server application
│   ├── src/
│   │   ├── server/        # Express server code
│   │   └── renderer/      # Vue.js admin interface
│   └── views/             # EJS templates
└── runUtils/              # Utility scripts
```

### Development Commands

#### Client
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

#### Server
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run migrate      # Run database migrations
npm run generate     # Generate database schema
```

## Scripts and Automation

### Game Scripts

Games support three types of custom scripts:

1. **Install Script**: Executed when installing a game
2. **Uninstall Script**: Executed when uninstalling a game  
3. **Play Script**: Executed when launching a game

#### Available Variables
- `GAME_KEY`: Reserved game key (if applicable)
- `GAME_ID`: Unique game identifier
- `GAME_NAME`: Game display name
- `GAME_EXECUTABLE`: Path to game executable

#### Example Play Script
```javascript
// Launch the game executable
await run(GAME_EXECUTABLE);

// Custom launch with parameters
await run(GAME_EXECUTABLE, ['-windowed', '-nosound']);
```

## Network Protocol

The application uses a custom UDP discovery protocol on port 50000 for automatic server detection:

- **Discovery Request**: `lanlauncher://get_ip`
- **Server Response**: JSON with protocol and port information

## Auto-Updates

The client application supports automatic updates via GitHub releases:

1. **Versioning**: Use semantic versioning (e.g., v1.0.0)
2. **Release Creation**: Tag releases trigger automatic builds
3. **Distribution**: Built executables are automatically uploaded to GitHub releases
4. **Client Updates**: Users receive automatic update notifications

### Creating a Release

```bash
git tag v1.0.1
git push origin v1.0.1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and support:
1. Check the [GitHub Issues](https://github.com/samdems/Lan-Launcher/issues)
2. Create a new issue with detailed information
3. Include logs and system information when reporting bugs

## External APIs

- **Steam Web API**: For Steam game integration
- **SteamGridDB API**: For game artwork and metadata

Get your API keys:
- [Steam API Key](https://steamcommunity.com/dev/apikey)
- [SteamGridDB API Key](https://www.steamgriddb.com/profile/preferences/api)