# Touch Guides

Touch Guides is an open-source property guidebook platform that helps property owners create and manage digital guidebooks for their properties. Whether you're managing vacation rentals, Airbnbs, or any other type of property, Touch Guides makes it easy to create comprehensive guides for your guests.

## Features

- 📱 Modern, responsive interface
- 🏠 Multiple property management
- 📖 Digital guidebooks with sections for:
  - Check-in/check-out instructions
  - House rules
  - WiFi & electronics
  - Local recommendations
  - Transportation info
  - And more!
- 🗺️ Interactive maps
- 👥 User authentication with Clerk
- 📱 Grid and list views for property management
- ✨ Beautiful, intuitive UI with animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Maps**: Leaflet with OpenStreetMap
- **Forms**: React Hook Form
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Clerk account for authentication
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/touch-guides.git
   cd touch-guides
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   MONGODB_URI=your_mongodb_uri
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting PR

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Join our community discussions
- Check out the documentation

## Acknowledgments

- Thanks to all contributors who have helped shape Touch Guides
- Built with ❤️ using Next.js and React
- Special thanks to the open source community
