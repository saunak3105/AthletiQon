# AthletiQon - Train, Test, Triumph

## Overview

AthletiQon is an AI-powered mobile fitness platform designed to democratize sports talent assessment across India and beyond. The platform enables athletes from remote regions to undergo standardized fitness evaluations using mobile-first technology with on-device AI analysis. Built for the Smart India Hackathon 2025, the system provides real-time pose estimation, cheat detection, and merit-based talent identification through an accessible, low-cost solution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a **dual frontend approach**:
- **Primary Frontend**: Next.js 15 with React 18, TypeScript, and Tailwind CSS for the web dashboard
- **Mobile Frontend**: Flutter framework (planned) for cross-platform mobile apps
- **UI Framework**: Radix UI components with shadcn/ui for consistent design system
- **State Management**: React hooks and context for local state management
- **Real-time Communication**: Socket.IO client for WebSocket connections to backend

### Backend Architecture
**Node.js Express Server** with the following components:
- **Pose Detection Service**: TensorFlow.js-node for AI-powered pose estimation and analysis
- **WebSocket Server**: Socket.IO for real-time pose analysis during fitness tests
- **RESTful API**: Express routes for fitness test management and pose analysis
- **File Processing**: Multer for handling image/video uploads with Sharp and Jimp for image processing

### AI/ML Integration
**On-Device AI Analysis**:
- **Pose Estimation**: TensorFlow Lite integration (MoveNet/MediaPipe BlazePose planned)
- **Real-time Analysis**: Live pose detection with form validation and rep counting
- **Cheat Detection**: Video analysis for tampered content and unnatural motion patterns
- **Performance Metrics**: Automated scoring based on form accuracy and completion rates

### Authentication & Data Flow
**Simplified Authentication**:
- Mock authentication system for development
- Form-based login/signup with client-side validation
- Session management through browser storage
- Google OAuth integration prepared but not implemented

### Real-time Features
**WebSocket Communication**:
- Live video frame processing for pose detection
- Real-time feedback delivery during fitness tests
- Session management for continuous test monitoring
- Performance metrics streaming

### External Services Integration
**AI Enhancement Services**:
- Google AI (Gemini) integration for fitness insights and personalized recommendations
- Genkit framework for AI workflow management
- Fitness prompt generation and metrics analysis flows

## External Dependencies

### Core Technologies
- **Next.js 15**: React-based web framework for frontend
- **TensorFlow.js**: Machine learning library for pose detection
- **Socket.IO**: Real-time bidirectional communication
- **Express.js**: Backend web framework

### AI/ML Services
- **Google AI (Gemini 2.5 Flash)**: Advanced AI model for fitness analysis
- **Genkit**: AI application framework for workflow management
- **TensorFlow Lite**: Lightweight ML framework for mobile deployment

### UI/UX Libraries
- **Radix UI**: Headless component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component for onboarding

### Development Tools
- **TypeScript**: Type-safe JavaScript development
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation
- **Sharp/Jimp**: Image processing libraries

### Planned Integrations
- **Firebase**: Database and authentication services (configured but not implemented)
- **Mobile Camera APIs**: For Flutter mobile app camera integration
- **Cloud Storage**: For video/image asset management
- **Analytics Services**: For user behavior tracking and performance metrics