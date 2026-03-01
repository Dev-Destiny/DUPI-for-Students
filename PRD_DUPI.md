# DUPI - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 8, 2026  
**Project Lead:** Adesina Sodiq  
**Development Environment:** Antigravity IDE  

---

## Executive Summary

DUPI is an AI-powered educational platform designed to centralize and optimize the personal study experience for students. The platform leverages Retrieval-Augmented Generation (RAG) to create interactive, contextual tests from user-provided materials, fostering active learning and knowledge retention. The MVP focuses on delivering a chat-based interface for test generation and a flashcard system, with plans to expand into a comprehensive study ecosystem.

---

## Vision & Mission

**Vision:** To become the singular, intelligent study companion that adapts to each student's learning needs and materials.

**Mission:** Empower students globally—particularly those with limited access to quality educational resources—by democratizing AI-driven personalized learning tools.

---

## Product Overview

### Core Value Proposition
- **Contextual Intelligence:** Generate tests and study materials directly from user-uploaded documents using RAG
- **Interactive Learning:** Transform passive reading into active engagement through AI-generated assessments
- **Shareability:** Enable collaborative learning by allowing test distribution to non-users
- **Centralization:** Consolidate study tools (tests, flashcards, notes) into one platform

### Target Audience
- **Primary:** High school and university students preparing for exams
- **Secondary:** Self-learners, competitive exam candidates, and study groups
- **Geographic Focus:** Initial focus on West African students; global expansion thereafter

---

## Product Scope

### Phase 1: MVP (Minimum Viable Product)

#### 1.1 Core Features

**Feature 1: AI Chat Dashboard**
- **Description:** Conversational interface for generating contextual tests
- **User Flow:**
  1. User uploads document (PDF, DOCX, TXT) or pastes text
  2. User specifies topic scope or lets AI auto-detect
  3. AI generates interactive multiple-choice, true/false, or short-answer questions
  4. User takes test with instant feedback
  5. Results dashboard with performance analytics
- **Technical Requirements:**
  - Document parsing (pdf-parse, mammoth for DOCX)
  - Text chunking and embedding generation
  - Vector similarity search via ChromaDB
  - LLM integration (Claude API, GPT-4, or Gemini)
  - Real-time streaming responses
  - Response caching for frequently accessed content

**Feature 2: Test Sharing**
- **Description:** Shareable links for tests (accessible by non-authenticated users)
- **User Flow:**
  1. User generates test
  2. User clicks "Share" to generate public link
  3. Link contains read-only test instance
  4. Non-users can attempt test without account creation
  5. Results optionally shared back to creator
- **Technical Requirements:**
  - UUID-based shareable links
  - Public route handling without authentication
  - Optional result aggregation for creator
  - Link expiration settings (optional)

**Feature 3: Flashcards**
- **Description:** AI-generated flashcards from uploaded materials
- **User Flow:**
  1. User uploads document or selects previously processed content
  2. AI extracts key concepts and generates Q&A pairs
  3. User reviews and edits flashcards
  4. Spaced repetition system tracks review schedule
- **Technical Requirements:**
  - Concept extraction algorithm
  - Spaced repetition logic (SM-2 algorithm or Leitner system)
  - Swipe/card flip UI (Swiper.js integration)
  - Progress tracking and analytics

#### 1.2 Non-Functional Requirements

**Performance:**
- Page load time < 2 seconds
- Test generation time < 10 seconds for 5,000-word documents
- Support for documents up to 50MB
- Optimistic UI updates for better perceived performance

**Security:**
- JWT-based authentication with refresh tokens
- HTTPS only (enforce SSL/TLS)
- Document encryption at rest (AES-256)
- Rate limiting on API endpoints (100 req/min per user)
- Input sanitization and XSS protection
- CORS configuration for frontend-backend communication
- SQL injection prevention (parameterized queries)

**Scalability:**
- Support 1,000 concurrent users in MVP
- Horizontal scaling capability for backend services
- Database connection pooling
- CDN integration for static assets

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Responsive design (mobile-first approach)

---

## Technology Stack

### Frontend
| Component | Technology | Justification |
|-----------|-----------|---------------|
| Framework | React.js 18+ | Component reusability, ecosystem maturity, concurrent features |
| Type Safety | TypeScript 5+ | Catch errors at compile-time, improved developer experience |
| Styling | Tailwind CSS 3+ | Rapid UI development, consistent design system |
| Component Library | shadcn/ui | Accessible, customizable primitives built on Radix UI |
| State Management | Zustand | Lightweight, minimal boilerplate, TypeScript-first |
| Animations | Framer Motion | Declarative animations, gesture support |
| Routing | React Router v6 | Standard routing solution, nested routes support |
| Form Handling | React Hook Form + Zod | Type-safe validation, performance optimization |
| HTTP Client | Axios | Interceptors for auth, request/response transformation |

### Design System & Aesthetics
- **Fonts**: 
  - Significant Headers: **Lora** (replaces Instrument Serif for better legibility while maintaining academic styling).
  - Body Text & Minor Headers: **Space Grotesk** (techy, modern vibe).
- **Core Colors**: 
  - Off-White Background: `#F9F7F4` (`bg-background-light`) serves as the base for the web app and onboarding.
  - Soft Orange Backgrounds: `#FFF0E6` (used for standard buttons and subtle highlights).
  - Brand Orange: `#FF6F20` (`bg-brand-orange`) for vibrant accents and primary actions.
  - Brand Violet: Deep Purple `#62109F` (`bg-brand-violet`) for structural backgrounds and CTAs.
- **UI Element Highlights**: 
  - Buttons have perfectly rounded pill shapes.
  - Interactive "Hero" and "CTA" buttons use an intricate SVG dashed-line border configuration (`animate-dash-flow`) where the dashes flow smoothly around the pill shape on hover.
  - Use of `framer-motion` for micro-interactions throughout (fade-ins, scale-on-tap).

### Backend
| Component | Technology | Justification |
|-----------|-----------|---------------|
| Runtime | Node.js 20+ (Express) | JavaScript full-stack consistency, async I/O performance |
| API Framework | Express.js | Minimal, flexible, extensive middleware ecosystem |
| Vector Database | ChromaDB | Open-source, Python/JS support, optimized for embeddings |
| Relational Database | PostgreSQL 15+ | ACID compliance, robust querying, pgvector extension |
| ORM | Prisma | Type-safe database client, migration management |
| Authentication | JWT + bcrypt | Stateless auth, industry standard |
| File Storage | AWS S3 / Cloudflare R2 | Scalable object storage for user documents |
| Validation | Zod | Shared validation schemas with frontend |
| Task Queue | Bull (Redis-based) | Background job processing for document parsing |

### AI/ML Infrastructure
| Component | Technology | Justification |
|-----------|-----------|---------------|
| LLM Provider | Anthropic Claude API / OpenAI GPT-4 | High-quality reasoning, large context window |
| Embedding Model | OpenAI text-embedding-3-small | Cost-effective, strong retrieval performance |
| RAG Framework | LangChain.js | Abstraction for LLM orchestration, modular architecture |
| Prompt Management | Custom prompt templates | Version control for prompts, A/B testing capability |

### DevOps & Infrastructure
| Component | Technology | Justification |
|-----------|-----------|---------------|
| Version Control | Git + GitHub | Collaboration, CI/CD integration |
| Package Manager | pnpm | Fast, disk-space efficient, strict dependency resolution |
| CI/CD | GitHub Actions | Native integration, free tier for private repos |
| Hosting (Frontend) | Vercel / Netlify | Serverless, global CDN, preview deployments |
| Hosting (Backend) | Railway / Render / Fly.io | Managed Node.js hosting, database integration |
| Caching | Redis | Session storage, API response caching |
| Monitoring | Sentry (errors), Plausible (analytics) | Privacy-focused, actionable insights |
| Logging | Winston + CloudWatch | Structured logging, centralized log management |
| Testing | Vitest (unit), Playwright (E2E) | Fast, modern testing frameworks |

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React App (TypeScript + Tailwind + shadcn/ui)      │   │
│  │  - Chat Interface    - Flashcard Viewer             │   │
│  │  - Test Generator    - Results Dashboard            │   │
│  │  - Document Manager  - Settings                     │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / REST API
┌───────────────────────────▼─────────────────────────────────┐
│                      API GATEWAY LAYER                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Express.js Server                                   │   │
│  │  - Authentication Middleware (JWT)                   │   │
│  │  - Rate Limiting (express-rate-limit)               │   │
│  │  - Request Validation (Zod)                          │   │
│  │  - CORS Configuration                                │   │
│  │  - Error Handling Middleware                         │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
      ┌─────────▼──────────┐   ┌───────▼────────────┐
      │  Service Layer     │   │  AI/RAG Pipeline   │
      │  ┌──────────────┐  │   │  ┌──────────────┐  │
      │  │ Auth Service │  │   │  │ Document     │  │
      │  │ User Service │  │   │  │ Processor    │  │
      │  │ Test Service │  │   │  │ (Bull Queue) │  │
      │  │ Card Service │  │   │  │              │  │
      │  │ Doc Service  │  │   │  │ Embedding    │  │
      │  └──────────────┘  │   │  │ Generator    │  │
      └─────────┬──────────┘   │  │              │  │
                │              │  │ Vector       │  │
      ┌─────────▼──────────┐   │  │ Search       │  │
      │  PostgreSQL        │   │  │ (ChromaDB)   │  │
      │  (via Prisma)      │   │  │              │  │
      │  ┌──────────────┐  │   │  │ LLM Client   │  │
      │  │ Users        │  │   │  │ (LangChain)  │  │
      │  │ Tests        │  │   │  └──────────────┘  │
      │  │ Flashcards   │  │   └───────┬────────────┘
      │  │ Documents    │  │           │
      │  │ Attempts     │  │   ┌───────▼────────────┐
      │  │ Sessions     │  │   │  ChromaDB          │
      │  └──────────────┘  │   │  (Vector Store)    │
      └────────────────────┘   │  - Embeddings      │
      ┌────────────────────┐   │  - Metadata        │
      │  Redis Cache       │   └────────────────────┘
      │  - Sessions        │   ┌────────────────────┐
      │  - API responses   │   │  Cloud Storage     │
      │  - Rate limits     │   │  (S3/R2)           │
      └────────────────────┘   │  - PDF files       │
                               │  - User uploads    │
                               └────────────────────┘
                               ┌────────────────────┐
                               │  LLM API           │
                               │  (Claude/GPT-4)    │
                               └────────────────────┘
```

### Data Flow: Test Generation

1. **User uploads document** → Frontend sends file to `/api/documents/upload`
2. **Backend validates file** → Check file type, size, virus scan
3. **Store in cloud** → Upload to S3/R2, get URL
4. **Queue processing** → Add job to Bull queue for async processing
5. **Extract text** → Worker processes document, extracts text
6. **Generate embeddings** → Chunk text, send to embedding API
7. **Store vectors** → Save embeddings in ChromaDB with metadata
8. **Update database** → Mark document as processed in PostgreSQL
9. **User requests test** → Frontend sends topic + difficulty to `/api/tests/generate`
10. **RAG retrieval** → Query ChromaDB for relevant chunks
11. **LLM generation** → Send context + prompt to LLM API via LangChain
12. **Parse response** → Extract questions, validate format
13. **Store test** → Save generated questions to PostgreSQL
14. **Stream to frontend** → Send questions incrementally via Server-Sent Events

---

## Database Schema (PostgreSQL)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  profile_image_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size_bytes BIGINT,
  processed BOOLEAN DEFAULT FALSE,
  processing_error TEXT,
  chroma_collection_id VARCHAR(255),
  chunk_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_processed ON documents(processed);
```

### Tests Table
```sql
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  topic VARCHAR(255),
  difficulty VARCHAR(50) DEFAULT 'medium',
  questions JSONB NOT NULL, -- Array of question objects
  share_token VARCHAR(255) UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tests_user_id ON tests(user_id);
CREATE INDEX idx_tests_share_token ON tests(share_token);
CREATE INDEX idx_tests_document_id ON tests(document_id);
```

### Test Attempts Table
```sql
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(255), -- For anonymous users
  answers JSONB NOT NULL,
  score DECIMAL(5,2),
  time_spent_seconds INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attempts_test_id ON test_attempts(test_id);
CREATE INDEX idx_attempts_user_id ON test_attempts(user_id);
```

### Flashcards Table
```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  tags TEXT[],
  next_review TIMESTAMP,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review);
```

### Flashcard Reviews Table
```sql
CREATE TABLE flashcard_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL, -- 0-5 (SM-2 algorithm)
  reviewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_flashcard_id ON flashcard_reviews(flashcard_id);
```

---

## API Endpoints (MVP)

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user, return JWT + refresh token
- `POST /api/auth/logout` - Invalidate refresh token
- `POST /api/auth/refresh` - Get new access token using refresh token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Documents
- `POST /api/documents/upload` - Upload and queue document for processing
- `GET /api/documents` - List user's documents (paginated)
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document and associated data
- `GET /api/documents/:id/status` - Check processing status

### Tests
- `POST /api/tests/generate` - Generate test from document/topic
- `GET /api/tests` - List user's tests (paginated, filterable)
- `GET /api/tests/:id` - Get test details
- `PUT /api/tests/:id` - Update test metadata
- `DELETE /api/tests/:id` - Delete test
- `POST /api/tests/:id/attempt` - Submit test answers
- `GET /api/tests/:id/attempts` - Get attempt history
- `GET /api/tests/shared/:token` - Get public test (no auth required)
- `POST /api/tests/:id/share` - Generate/regenerate share link
- `DELETE /api/tests/:id/share` - Revoke share link

### Flashcards
- `POST /api/flashcards/generate` - Generate flashcards from document
- `GET /api/flashcards` - Get user's flashcards (with due prioritization)
- `GET /api/flashcards/due` - Get cards due for review
- `POST /api/flashcards` - Create manual flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard
- `POST /api/flashcards/:id/review` - Record review, update spaced repetition
- `GET /api/flashcards/stats` - Get study statistics

### Analytics (Future)
- `GET /api/analytics/overview` - User performance dashboard
- `GET /api/analytics/progress` - Learning progress over time
- `GET /api/analytics/weak-areas` - Identify topics needing review

---

## User Stories

### Epic 1: Test Generation
**As a student**, I want to upload my lecture notes and generate practice tests, so I can assess my understanding without manually creating questions.

**Acceptance Criteria:**
- Upload PDF/DOCX files up to 50MB
- AI generates 5-20 questions based on document content
- Questions include multiple-choice, true/false, and short-answer formats
- Receive instant feedback on answers with explanations
- See score and time taken after completion

### Epic 2: Collaborative Learning
**As a study group leader**, I want to share tests with my peers, so we can practice together without everyone needing accounts.

**Acceptance Criteria:**
- Generate unique shareable link
- Link works in incognito/private browsing
- Track how many people attempted the test
- View aggregated results (average score, common wrong answers)
- Option to disable sharing or set expiration

### Epic 3: Spaced Repetition
**As a long-term learner**, I want flashcards that appear based on how well I remember them, so I can optimize review time.

**Acceptance Criteria:**
- Flashcards auto-generated from uploaded materials
- Due cards appear first in review queue
- "Easy/Good/Hard/Again" buttons adjust next review date using SM-2
- Progress tracked over time with streak counter
- Option to manually create and edit flashcards

### Epic 4: Document Management
**As a organized student**, I want to manage all my study materials in one place, so I can quickly access what I need.

**Acceptance Criteria:**
- View all uploaded documents in a grid/list
- Search documents by title or content
- See which documents have tests or flashcards associated
- Delete documents and all derivative content
- Track storage usage

---

## Development Phases

### Phase 1: MVP Foundation (Weeks 1-4)
**Deliverables:**
- Project setup (monorepo with pnpm workspaces)
- Database schema design and migrations
- Basic authentication (register, login, JWT)
- Document upload to cloud storage
- Simple React UI with shadcn/ui components

**Success Criteria:**
- User can register, login, and upload documents
- Documents stored securely in cloud
- Basic responsive UI functional

### Phase 2: Core RAG Implementation (Weeks 5-8)
**Deliverables:**
- Document processing pipeline (text extraction, chunking)
- ChromaDB integration and embedding generation
- LangChain setup for LLM orchestration
- Test generation API endpoint
- Basic test-taking interface

**Success Criteria:**
- Documents automatically processed after upload
- Users can generate tests from documents
- Tests display correctly with immediate feedback
- LLM generates coherent, relevant questions

### Phase 3: Flashcards & Sharing (Weeks 9-12)
**Deliverables:**
- Flashcard generation from documents
- SM-2 spaced repetition algorithm implementation
- Flashcard review UI with swipe gestures
- Test sharing functionality (public links)
- Anonymous test attempts

**Success Criteria:**
- Flashcards generated accurately from content
- Spaced repetition schedules cards appropriately
- Shared tests accessible without authentication
- Non-users can complete tests and see results

### Phase 4: Polish & Optimization (Weeks 13-16)
**Deliverables:**
- Performance optimization (caching, lazy loading)
- Comprehensive error handling
- User dashboard with analytics
- Email notifications (verification, password reset)
- Dark mode implementation
- Accessibility audit and fixes

**Success Criteria:**
- Page load times < 2s
- Zero critical bugs
- WCAG 2.1 AA compliance achieved
- Positive feedback from beta testers

### Phase 5: Beta Launch (Weeks 17-20)
**Deliverables:**
- Production deployment
- Monitoring and logging setup
- User feedback collection mechanism
- Documentation (user guides, API docs)
- Marketing landing page

**Success Criteria:**
- 100+ beta users onboarded
- < 1% error rate
- Average session duration > 10 minutes
- NPS score ≥ 40

---

## Technical Implementation Details

### RAG Implementation

**Document Processing Pipeline:**
1. **Validation:** Check file type (PDF, DOCX, TXT), size limit, malware scan
2. **Text Extraction:**
   - PDF: `pdf-parse` library
   - DOCX: `mammoth` library
   - TXT: Direct read with encoding detection
3. **Cleaning:** Remove headers/footers, normalize whitespace, fix encoding issues
4. **Chunking:** Recursive character text splitter (500 tokens, 50 overlap)
5. **Embedding:** OpenAI text-embedding-3-small (1536 dimensions)
6. **Storage:** ChromaDB collection per document with metadata

**Retrieval Strategy:**
- **Hybrid Search:** Combine vector similarity (cosine) with keyword matching (BM25)
- **Re-ranking:** Use cross-encoder for top-k refinement (optional, cost consideration)
- **Context Window:** Retrieve 4-6 most relevant chunks (≈2000 tokens total)
- **Metadata Filtering:** Filter by page number, section headers when available

### LLM Prompt Engineering

**Test Generation Prompt Template:**
```
You are an expert educator creating assessment questions from student materials.

## Context
The following text is extracted from the student's study materials on the topic: {topic}

{retrieved_chunks}

## Task
Generate {num_questions} {question_type} questions that test conceptual understanding, not memorization.

## Requirements
- Questions should be clear, unambiguous, and age-appropriate
- For multiple-choice: Provide 4 options (A-D) with exactly one correct answer
- Include brief explanations for correct answers
- Difficulty level: {difficulty} (easy/medium/hard)
- Ensure questions cover different aspects of the material

## Output Format
Return a JSON array with this structure:
[
  {
    "question": "string",
    "type": "multiple_choice" | "true_false" | "short_answer",
    "options": ["A", "B", "C", "D"] (if applicable),
    "correct_answer": "string",
    "explanation": "string"
  }
]
```

**Flashcard Generation Prompt Template:**
```
Extract key concepts from the following text and create flashcards.

## Text
{text_chunk}

## Requirements
- Identify the 5-10 most important concepts
- Create concise question-answer pairs
- Front: Clear, specific question
- Back: Comprehensive but concise answer (2-4 sentences)
- Avoid overly simple definitions; focus on application and understanding

## Output Format
Return JSON array:
[
  {
    "front": "string",
    "back": "string",
    "tags": ["concept_name"]
  }
]
```

### Spaced Repetition Algorithm (SM-2)

```typescript
interface FlashcardData {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

function calculateNextReview(
  quality: number, // 0-5 (0=complete blackout, 5=perfect response)
  currentData: FlashcardData
): FlashcardData {
  let { easeFactor, interval, repetitions } = currentData;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
  };
}
```

### Authentication Flow

**JWT Structure:**
```typescript
// Access Token (short-lived, 15 minutes)
interface AccessToken {
  userId: string;
  email: string;
  exp: number; // Expiration timestamp
}

// Refresh Token (long-lived, 7 days, stored in httpOnly cookie)
interface RefreshToken {
  userId: string;
  tokenId: string; // Unique ID for revocation
  exp: number;
}
```

**Security Measures:**
- Access tokens in memory (Zustand store), cleared on tab close
- Refresh tokens in httpOnly, secure, SameSite cookies
- Token rotation on refresh
- Logout invalidates refresh token in database
- Password hashing with bcrypt (salt rounds: 12)

### Error Handling Strategy

**Error Response Format:**
```typescript
interface ErrorResponse {
  error: {
    code: string; // Machine-readable error code
    message: string; // Human-readable message
    details?: any; // Additional context for debugging
    timestamp: string;
  };
}
```

**Error Categories:**
- `AUTH_*`: Authentication/authorization errors
- `VALIDATION_*`: Input validation failures
- `RESOURCE_*`: Resource not found/conflict
- `EXTERNAL_*`: Third-party API failures (LLM, storage)
- `RATE_LIMIT_*`: Rate limiting triggered
- `SERVER_*`: Internal server errors

### Caching Strategy

**Redis Cache Layers:**
1. **API Response Cache:** GET requests for tests, documents (TTL: 5 min)
2. **LLM Response Cache:** Hash of (prompt + context) → response (TTL: 24 hours)
3. **Session Store:** User sessions and JWT blacklist
4. **Rate Limiting:** Request counters per user/IP

---

## Security & Privacy

### Data Protection
- **Encryption at Rest:** AES-256 for stored documents
- **Encryption in Transit:** TLS 1.3 only
- **PII Handling:** Minimal collection, user can delete account + all data
- **GDPR Compliance:** Data export, deletion within 30 days

### Input Validation
- File upload: Magic number verification (not just extension)
- Size limits enforced at multiple layers (client, server, storage)
- SQL injection prevention via Prisma ORM
- XSS protection via DOMPurify on frontend
- CSRF tokens for state-changing operations

### Rate Limiting
- **Document Upload:** 10 per hour per user
- **Test Generation:** 20 per hour per user
- **Flashcard Generation:** 15 per hour per user
- **API Requests:** 100 per minute per user
- **Public Test Attempts:** 50 per hour per IP

---

## Performance Optimization

### Frontend
- **Code Splitting:** Route-based with React.lazy()
- **Image Optimization:** WebP format, lazy loading, responsive images
- **Bundle Size:** Target < 200KB gzipped for initial load
- **Caching:** Service worker for offline capability (future)
- **Memoization:** React.memo for expensive components

### Backend
- **Database:**
  - Indexed columns for common queries
  - Connection pooling (max: 20 connections)
  - Query optimization (avoid N+1, use joins appropriately)
  - Pagination for all list endpoints (default: 20 items)
- **API:**
  - Response compression (gzip/brotli)
  - CDN for static assets
  - HTTP/2 server push for critical resources
- **Background Jobs:**
  - Document processing in worker threads
  - Bulk operations queued (Bull)

---

## Testing Strategy

### Unit Tests
- **Backend:** Services, utilities, algorithms (>80% coverage)
- **Frontend:** Hooks, utilities, complex components (>70% coverage)
- **Tools:** Vitest, React Testing Library

### Integration Tests
- **API Endpoints:** All major flows (auth, CRUD, RAG pipeline)
- **Database:** Migrations, complex queries
- **Tools:** Supertest, test database instances

### E2E Tests
- **Critical Paths:**
  - User registration → upload document → generate test → take test
  - Generate flashcards → review with spaced repetition
  - Share test → anonymous attempt
- **Tools:** Playwright, CI integration

### Load Testing
- **Scenarios:** Concurrent users, document uploads, test generation
- **Tools:** k6, Artillery
- **Targets:** 1000 concurrent users, <2s response time (p95)

---

## Monitoring & Observability

### Metrics to Track
- **Performance:** API response times, page load times, database query times
- **Business:** Daily active users, tests generated, flashcards reviewed, share rate
- **Errors:** Error rate by endpoint, LLM API failures, document processing failures
- **Costs:** LLM API usage, storage costs, database costs

### Logging
- **Structured Logs:** JSON format with correlation IDs
- **Log Levels:** ERROR, WARN, INFO, DEBUG
- **Sensitive Data:** Redact passwords, tokens, PII in logs
- **Retention:** 30 days for general logs, 90 days for security logs

### Alerting
- **Critical:** Server down, database connection failures, high error rate (>5%)
- **Warning:** High response times (>5s), API budget approaching limit
- **Channels:** Email, Slack (future)

---

## Success Metrics

### MVP Launch (Month 3)
- 500 registered users
- 2,000 tests generated
- 10,000 flashcards created
- 70% test completion rate
- < 5% error rate in AI-generated questions
- Average session duration: 12 minutes

### Growth Phase (Month 6)
- 5,000 active users (30-day)
- 30% weekly retention rate
- 15% of tests shared publicly
- 50% of users return to review flashcards
- NPS score ≥ 40
- LLM cost per user < $0.50/month

### Product-Market Fit (Month 12)
- 25,000 active users
- 40% monthly retention
- 20% organic growth rate
- Average user generates 10+ tests/month
- 80% of users say DUPI is "very valuable" or "essential"

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| LLM API costs exceed budget | High | Medium | Implement aggressive caching, rate limiting; explore open-source alternatives (Llama 3, Mistral) |
| Poor question quality | High | Medium | Manual review for first 100 tests, feedback loop for improvements, fine-tuning |
| Low user adoption | High | Medium | Beta testing with target cohort, referral incentives, focus on West African student communities |
| Scalability issues under load | Medium | Low | Load testing before launch, auto-scaling infrastructure, database optimization |
| Data privacy breach | High | Low | Security audit, penetration testing, compliance with GDPR/data protection laws |
| Competitor launches similar product | Medium | Medium | Focus on underserved markets (West Africa), unique features (RAG quality, shareability) |
| ChromaDB performance degradation | Medium | Low | Monitor query latency, implement fallback to traditional search, consider alternatives (Pinecone, Weaviate) |

---

## Future Features (Post-MVP)

### Advanced Study Tools
- **AI Tutor Chat:** Contextual explanations for wrong answers, Socratic questioning
- **Video Integration:** Generate questions from YouTube lectures, MOOCs
- **Collaborative Study Rooms:** Real-time co-studying with friends, shared flashcard decks
- **Note-Taking:** Markdown editor with AI-powered summarization
- **Mind Maps:** Auto-generate visual concept maps from materials

### Adaptive Learning
- **Personalized Difficulty:** Adjust question difficulty based on performance
- **Learning Paths:** AI recommends study sequence based on weak areas
- **Predictive Analytics:** Estimate exam readiness, suggest optimal study schedule
- **Multi-Modal Learning:** Support for images, diagrams in questions

### Institutional Features
- **Teacher Dashboards:** Create classes, assign tests, track student progress
- **LMS Integration:** Canvas, Moodle, Google Classroom plugins
- **Bulk Operations:** Upload multiple documents, batch test creation
- **Analytics for Educators:** Class performance insights, common misconceptions

### Gamification
- **Streaks:** Daily study streak tracking
- **Leaderboards:** Compete with friends or globally
- **Achievements:** Badges for milestones (100 cards reviewed, 50 tests taken)
- **Challenges:** Weekly themed quizzes

### Mobile App (Phase 2)
- **Offline Mode:** Download tests/flashcards for offline study
- **Push Notifications:** Remind to review due flashcards
- **Widget:** Quick access to daily flashcards from home screen
- **Platform:** React Native for iOS + Android (share business logic with web)

---

## Monetization Strategy (Future)

### Freemium Model
**Free Tier:**
- 5 document uploads/month
- 20 test generations/month
- 100 flashcards
- Basic analytics

**Pro Tier ($9/month or $80/year):**
- Unlimited documents, tests, flashcards
- Advanced analytics and insights
- Priority support
- Early access to new features
- No branding on shared tests

**Student Tier ($4/month with .edu email):**
- All Pro features at discounted rate
- Targeted at university students

### B2B Licensing
- **Schools/Universities:** $500-5000/year based on student count
- **Tutoring Centers:** White-label solution
- **Corporate Training:** Compliance and onboarding test generation

### API Access (Future)
- **Developer Tier:** $99/month for API access to RAG pipeline
- **Enterprise:** Custom pricing for high-volume usage

---

## Go-to-Market Strategy

### Pre-Launch (Weeks 1-12)
- Build landing page with waitlist
- Create social media presence (Twitter, Instagram, TikTok)
- Engage with student communities on Reddit, Discord
- Partner with student influencers in West Africa

### Beta Launch (Weeks 13-20)
- Invite 100 beta users from waitlist
- Gather feedback via in-app surveys, user interviews
- Iterate based on feedback
- Create case studies from successful users

### Public Launch (Week 21+)
- Launch on Product Hunt, Hacker News
- Press outreach to education tech publications
- Referral program (invite 3 friends, get 1 month Pro free)
- Content marketing (blog posts on study techniques, RAG technology)

### Growth Tactics
- **SEO:** Target keywords like "AI study tools", "generate practice tests", "flashcard maker"
- **Partnerships:** Collaborate with universities, online course platforms
- **Community Building:** Student ambassador program, Discord community
- **Localization:** Offer interface in French, Arabic for West African markets

---

## Compliance & Legal

### Terms of Service
- User-generated content ownership
- Acceptable use policy (no cheating, plagiarism detection tools)
- Limitation of liability
- Dispute resolution

### Privacy Policy
- Data collection practices (minimal, explicit consent)
- Third-party sharing (LLM providers, analytics)
- User rights (access, deletion, portability)
- Cookie policy

### Intellectual Property
- Users retain ownership of uploaded documents
- DUPI has license to process documents for service provision
- AI-generated content ownership clarification

### Content Moderation
- Automated filtering for inappropriate content
- User reporting mechanism
- Manual review for flagged content

---

## Team & Roles (Future Scaling)

### MVP Phase (Solo/Small Team)
- **Full-Stack Developer:** Adesina Sodiq (you)
- **Advisors:** Mentors from tech community, university professors

### Growth Phase
- **Frontend Developer:** React specialist
- **Backend Developer:** Node.js/API expert
- **ML Engineer:** RAG optimization, model fine-tuning
- **Product Manager:** Feature prioritization, user research
- **Designer:** UI/UX, brand identity

### Scaling Phase
- **Sales/Marketing:** Growth hacking, partnerships
- **Customer Success:** User onboarding, support
- **DevOps Engineer:** Infrastructure scaling, reliability

---

## Appendix

### Glossary
- **RAG (Retrieval-Augmented Generation):** Technique combining document retrieval with LLM generation for grounded responses
- **Spaced Repetition:** Learning technique that schedules reviews based on memory retention
- **Embedding:** Numerical vector representation of text enabling semantic similarity search
- **UUID:** Universally Unique Identifier for database primary keys
- **SM-2:** SuperMemo 2 algorithm for spaced repetition scheduling
- **ChromaDB:** Open-source vector database optimized for LLM applications

### Tech Stack Alternatives Considered

| Component | Chosen | Alternative | Reason for Choice |
|-----------|---------|-------------|-------------------|
| Frontend Framework | React | Vue, Svelte | Ecosystem maturity, hiring pool, TypeScript support |
| State Management | Zustand | Redux, Jotai | Simplicity, minimal boilerplate |
| Backend | Node.js + Express | Python + FastAPI, Go | Full-stack JS consistency |
| Vector DB | ChromaDB | Pinecone, Weaviate | Open-source, cost-effective for MVP |
| Relational DB | PostgreSQL | MySQL, MongoDB | ACID, pgvector extension |
| ORM | Prisma | TypeORM, Sequelize | Type safety, migrations, modern DX |
| LLM Provider | Claude/GPT-4 | Llama 3, Gemini | Quality for educational content, large context |

### Useful Resources
- **OpenAI Embeddings Guide:** https://platform.openai.com/docs/guides/embeddings
- **LangChain.js Docs:** https://js.langchain.com/docs/
- **SM-2 Algorithm:** https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Prisma Docs:** https://www.prisma.io/docs
- **ChromaDB Docs:** https://docs.trychroma.com

### Environment Variables

**Frontend (.env.local):**
```bash
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
```

**Backend (.env):**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dupi

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# LLM
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=dupi-documents
AWS_REGION=us-east-1

# ChromaDB
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Email (SendGrid/Resend)
EMAIL_API_KEY=...
EMAIL_FROM=noreply@dupi.app

# Monitoring
SENTRY_DSN=...
```

### Project Structure

```
dupi/
|-- node_modules/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/         # shadcn components
│   │   │   │   ├── auth/
│   │   │   │   ├── tests/
│   │   │   │   └── flashcards/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── lib/
│   │   │   └── utils/
│   │   ├── public/
│   │   └── package.json
│   └── api/                    # Node.js backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── utils/
│       │   ├── workers/        # Bull queue workers
│       │   └── server.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   ├── shared/                 # Shared types, validation
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── schemas/        # Zod schemas
│   │   │   └── constants/
│   │   └── package.json
│   └── config/                 # Shared configs
│       ├── eslint-config/
│       ├── typescript-config/
│       └── tailwind-config/
├── docs/
│   ├── PRD.md                  # This document
│   ├── API.md                  # API documentation
│   └── ARCHITECTURE.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

### Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 8, 2026 | Initial PRD creation | Adesina Sodiq |

---

**Document Status:** Living Document  
**Next Review Date:** March 8, 2026  
**Approvers:** Project Lead

---

*This PRD will evolve through development cycles, user feedback, and market changes. All stakeholders should review updates and provide input during iteration planning.*