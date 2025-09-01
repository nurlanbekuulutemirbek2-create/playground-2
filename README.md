# Modern Animated Website with Clerk Authentication

A beautiful, modern website built with Next.js 15, featuring seamless authentication with Clerk, stunning animations with Framer Motion, and a responsive design.

## 🚀 Features

- **Modern Authentication**: Secure user authentication with Clerk
- **Beautiful Animations**: Smooth, performant animations using Framer Motion
- **Responsive Design**: Mobile-first design that works on all devices
- **Protected Routes**: Secure dashboard accessible only to authenticated users
- **Modern UI/UX**: Clean, professional interface with gradient designs
- **TypeScript**: Full TypeScript support for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playground_2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Clerk credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Clerk Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env.local` file

### Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
```

## 📁 Project Structure

```
playground_2/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── sign-in/           # Sign-in page
│   ├── sign-up/           # Sign-up page
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading component
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── middleware.ts          # Clerk middleware
├── .env.local            # Environment variables
└── package.json
```

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful gradient color schemes
- **Smooth Animations**: Page transitions and hover effects
- **Glass Morphism**: Modern glass-like UI elements
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Interactive Elements**: Hover states and micro-interactions

## 🔐 Authentication Flow

1. **Public Routes**: Homepage, sign-in, and sign-up pages
2. **Protected Routes**: Dashboard and other authenticated pages
3. **Middleware**: Automatic redirection for unauthenticated users
4. **User Management**: Profile information and settings

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🎯 Key Components

### Homepage (`app/page.tsx`)
- Hero section with animated text
- Feature showcase
- Statistics display
- Call-to-action sections

### Dashboard (`app/dashboard/page.tsx`)
- User profile management
- Analytics overview
- Settings configuration
- Recent activity feed

### Authentication Pages
- Custom styled Clerk components
- Responsive design
- Smooth transitions

## 🎨 Customization

### Colors
The app uses a blue-purple gradient theme. You can customize colors in:
- `app/globals.css` for CSS variables
- Tailwind config for utility classes
- Component files for specific styling

### Animations
Framer Motion animations can be customized in:
- Component files for specific animations
- `app/globals.css` for CSS animations
- Layout components for page transitions

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the [Clerk documentation](https://clerk.com/docs)
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Open an issue in the repository

## 🎉 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Framer Motion](https://framer.com/motion) for animations
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons
- [Next.js](https://nextjs.org) for the framework
