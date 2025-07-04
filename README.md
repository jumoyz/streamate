# StreaMate

StreaMate is a mobile web app designed to streamline the management of streaming service subscriptions for both customers and admins. It centralizes profiles, payments, and user accounts, making it ideal for streaming resale businesses.

## Features

- **Centralized Subscription Management:** Manage Netflix, Prime Video, Disney+, and Spotify accounts in one place.
- **AI-Powered Recommendations:** Get personalized streaming suggestions.
- **Renewal Notifications:** Receive alerts for upcoming subscription renewals.
- **Secure Payments:** Multiple payment options with secure processing.
- **Admin Dashboard:** Tools for managing users, subscriptions, and profitability.
- **Progressive Web App:** Installable and works offline.

## Folder Structure

```
strea-mate/
├── icons/           # App icons
├── images/          # App images
├── scripts/         # App JavaScript api.js, auth.js, admin.js, and user.js
├── api.php          # Backend API logic
├── app.css          # Main stylesheet
├── app.js           # Main JavaScript logic
├── config.php       # Configuration settings
├── index.html       # App entry point
├── .env             # Variables environment
├── manifest.json    # PWA manifest
├── sw.js            # Service worker for offline support
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites

- PHP 7.4+ (for backend)
- A web server (Apache, Nginx, or PHP built-in server)
- Node.js (optional, for advanced development)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/streamate.git
   cd strea-mate
   ```

2. **Configure the backend:**
   - Edit `config.php` with your database and API credentials.

3. **Run the app:**
   - Using PHP built-in server:
     ```sh
     php -S localhost:8000
     ```
   - Open `http://localhost:8000` in your browser.

### PWA Installation

- Visit the app in your browser and use the "Add to Home Screen" feature to install as a mobile app.

## Security

- Ensure sensitive data in `config.php` is protected.
- Use HTTPS in production.
- Regularly update dependencies.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch and open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For support or inquiries, please contact [your-email@example.com].