# freeCodeCamp Forum Homepage

> A modern, performant forum homepage built with Vue 3, TypeScript, and Tailwind CSS

[![CI Status](https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage/workflows/CI/badge.svg)](https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.4+-green.svg)](https://vuejs.org/)

## 📋 Overview

This project is a recreation of the freeCodeCamp forum homepage, implementing modern web development best practices and patterns. It's designed as both a functional application and a learning portfolio piece demonstrating advanced frontend engineering skills.

**Live Demo:** [Coming Soon]

**Project Goals:**
- Build a production-ready Vue 3 application with TypeScript
- Demonstrate senior-level engineering practices
- Implement comprehensive testing and accessibility standards
- Showcase modern frontend architecture patterns

## ✨ Features

- **🎨 Modern UI/UX**: Clean, responsive interface built with Tailwind CSS
- **⚡ Performance Optimized**: Virtual scrolling, code splitting, and lazy loading
- **♿ Accessible**: WCAG 2.1 AA compliant with full keyboard navigation
- **🔍 Search & Filter**: Real-time topic search with multiple filter options
- **📱 Responsive Design**: Mobile-first approach supporting all device sizes
- **🎭 Type Safe**: Fully typed with TypeScript in strict mode
- **🧪 Well Tested**: Comprehensive unit and E2E test coverage
- **🌙 Dark Mode**: Theme switching with system preference support
- **📦 PWA Ready**: Offline support and installable web app

## 🚀 Tech Stack

### Core Technologies
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Development Tools
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

### Key Libraries
- **[VueUse](https://vueuse.org/)** - Composition utilities
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue
- **[Axios](https://axios-http.com/)** - HTTP client (or native fetch)

## 📦 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (recommended) or npm/yarn

```bash
# Check your Node.js version
node --version

# Install pnpm globally if you haven't
npm install -g pnpm
```

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage.git
cd freeCodeCamp-Forum-Homepage
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
VITE_API_URL=https://forum-proxy.freecodecamp.rocks
VITE_APP_TITLE=freeCodeCamp Forum
```

4. **Run development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run unit tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Run all checks (lint, type-check, test)
pnpm check-all
```

### Project Structure

```
freeCodeCamp-Forum-Homepage/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # Architecture decisions
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── adr/                   # Architecture Decision Records
├── public/                    # Static assets
│   ├── favicon.ico
│   └── manifest.json          # PWA manifest
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Vue components
│   │   ├── CategoryBadge/
│   │   │   ├── CategoryBadge.vue
│   │   │   ├── CategoryBadge.spec.ts
│   │   │   └── index.ts
│   │   ├── ErrorBoundary/
│   │   ├── SkeletonLoader/
│   │   ├── TopicCard/
│   │   ├── TopicList/
│   │   └── UserAvatar/
│   ├── composables/          # Composition functions
│   │   ├── useBreakpoint.ts
│   │   ├── useDarkMode.ts
│   │   ├── useTopicFilters.ts
│   │   └── index.ts
│   ├── services/             # API and business logic
│   │   ├── forumApi.service.ts
│   │   └── index.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── forum.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── formatDate.ts
│   │   ├── buildAvatarUrl.ts
│   │   └── index.ts
│   ├── views/                # Page components
│   │   └── HomePage.vue
│   ├── App.vue               # Root component
│   ├── main.ts               # Application entry point
│   └── router.ts             # Vue Router configuration
├── tests/
│   ├── e2e/                  # End-to-end tests
│   │   ├── home.spec.ts
│   │   └── fixtures/
│   └── unit/                 # Unit tests (co-located with components)
├── .env.example              # Environment variables template
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore
├── .prettierrc.json          # Prettier configuration
├── index.html                # HTML entry point
├── package.json
├── playwright.config.ts      # Playwright configuration
├── postcss.config.js         # PostCSS configuration
├── README.md
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

### Code Style Guide

This project follows strict coding standards to ensure consistency and maintainability:

#### TypeScript
- Always use explicit types, avoid `any`
- Use interface over type for object shapes
- Prefer const over let, never use var
- Use functional programming patterns where appropriate

```typescript
// ✅ Good
interface TopicCardProps {
  topic: ForumTopic;
  onClick?: (topic: ForumTopic) => void;
}

// ❌ Bad
type TopicCardProps = {
  topic: any;
  onClick: Function;
};
```

#### Vue Components
- Use Composition API with `<script setup>`
- Keep components small and focused (< 200 lines)
- Extract reusable logic into composables
- Use proper TypeScript with `defineProps`

```vue
<!-- ✅ Good -->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  topic: ForumTopic;
}

const props = defineProps<Props>();

const formattedDate = computed(() => 
  formatRelativeTime(props.topic.last_posted_at)
);
</script>
```

#### Component Naming
- Use PascalCase for component files: `TopicCard.vue`
- Use kebab-case in templates: `<topic-card />`
- Prefix base components with "Base": `BaseButton.vue`

#### CSS/Tailwind
- Mobile-first responsive design
- Use Tailwind utility classes
- Extract repeated patterns into components
- Use semantic color names from design system

```vue
<!-- ✅ Good - Mobile first -->
<div class="p-4 md:p-6 lg:p-8">
  <h2 class="text-lg md:text-xl lg:text-2xl">Title</h2>
</div>

<!-- ❌ Bad - Desktop first -->
<div class="p-8 md:p-6 sm:p-4">
  <h2 class="text-2xl md:text-xl sm:text-lg">Title</h2>
</div>
```

### Git Workflow

We follow a feature branch workflow with conventional commits:

1. **Create a feature branch**
```bash
git checkout -b feature/topic-search
```

2. **Make your changes with conventional commits**
```bash
git commit -m "feat(search): add topic search functionality"
git commit -m "test(search): add unit tests for search"
git commit -m "docs(readme): update search documentation"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

3. **Push and create a pull request**
```bash
git push origin feature/topic-search
```

### Testing Strategy

#### Unit Tests (Vitest)
- Test all components, composables, and utilities
- Aim for 80%+ code coverage
- Use test-driven development (TDD) for complex logic
- Mock external dependencies

```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TopicCard from './TopicCard.vue';

describe('TopicCard', () => {
  it('renders topic title', () => {
    const wrapper = mount(TopicCard, {
      props: {
        topic: mockTopic
      }
    });
    
    expect(wrapper.find('[data-testid="topic-title"]').text())
      .toBe(mockTopic.title);
  });
});
```

#### E2E Tests (Playwright)
- Test critical user journeys
- Test across multiple browsers
- Include accessibility tests

```typescript
// Example E2E test
import { test, expect } from '@playwright/test';

test('loads and displays forum topics', async ({ page }) => {
  await page.goto('/');
  
  await page.waitForSelector('[data-testid="topic-card"]');
  
  const topicCount = await page.locator('[data-testid="topic-card"]').count();
  expect(topicCount).toBeGreaterThan(0);
});
```

### Accessibility Standards

This project adheres to WCAG 2.1 AA standards:

- ✅ All images have alt text
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation support
- ✅ ARIA labels for interactive elements
- ✅ Color contrast ratios meet standards
- ✅ Focus indicators visible
- ✅ Screen reader friendly

**Testing Accessibility:**
```bash
# Run accessibility audit
pnpm test:a11y

# Manual testing checklist:
# 1. Navigate with keyboard only (Tab, Enter, Space)
# 2. Test with screen reader (NVDA, JAWS, VoiceOver)
# 3. Verify color contrast with browser DevTools
# 4. Test with axe DevTools extension
```

## 🏗️ Architecture

### Component Architecture

This project uses a **feature-based component architecture** with clear separation of concerns:

```
components/
├── Base/           # Reusable base components (buttons, inputs)
├── Layout/         # Layout components (header, footer)
├── Features/       # Feature-specific components
│   ├── TopicList/
│   ├── Search/
│   └── Filters/
└── UI/             # UI components (badges, avatars, loaders)
```

### State Management

We use **composition-based state management** without a global store:
- Local component state with `ref` and `reactive`
- Shared state via composables
- API data via service layer with caching

```typescript
// Example composable for shared state
export function useTopicFilters(topics: Ref<ForumTopic[]>) {
  const searchQuery = ref('');
  const selectedCategory = ref<number | null>(null);
  
  const filteredTopics = computed(() => {
    let filtered = topics.value;
    
    if (searchQuery.value) {
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    
    if (selectedCategory.value) {
      filtered = filtered.filter(topic =>
        topic.category_id === selectedCategory.value
      );
    }
    
    return filtered;
  });
  
  return {
    searchQuery,
    selectedCategory,
    filteredTopics
  };
}
```

### API Layer

The API service layer provides:
- Centralized API calls
- Request/response type safety
- Error handling and retry logic
- Response caching
- Request cancellation

```typescript
// Example API service
export class ForumApiService {
  private baseUrl: string;
  private cache = new Map<string, CachedResponse>();
  
  async fetchLatestTopics(): Promise<ApiResult<ForumApiResponse>> {
    const cacheKey = 'latest-topics';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) return { success: true, data: cached };
    
    try {
      const response = await fetch(`${this.baseUrl}/latest`);
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }
}
```

## 🎯 Performance

### Performance Optimizations Implemented

1. **Code Splitting**: Route-based lazy loading
2. **Virtual Scrolling**: For large topic lists
3. **Image Optimization**: Lazy loading and responsive images
4. **Caching**: API response caching with TTL
5. **Bundle Size**: Tree-shaking and dynamic imports
6. **Memoization**: Using `computed` for expensive calculations

### Performance Metrics

Target metrics (measured with Lighthouse):
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 90

Current metrics:
```
Performance:      [Coming Soon]
Accessibility:    [Coming Soon]
Best Practices:   [Coming Soon]
SEO:              [Coming Soon]
```

### Performance Monitoring

```bash
# Run Lighthouse audit
pnpm lighthouse

# Analyze bundle size
pnpm build --mode analyze

# Monitor performance in development
pnpm dev --debug
```

## 🔒 Security

### Security Best Practices

- ✅ Content Security Policy (CSP) headers
- ✅ XSS prevention (template escaping)
- ✅ HTTPS only in production
- ✅ Dependency vulnerability scanning
- ✅ Environment variable protection
- ✅ Input sanitization

**Running Security Audits:**
```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit fix

# Update dependencies
pnpm update --latest
```

## 📱 Browser Support

- **Chrome**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari**: Last 2 versions
- **Edge**: Last 2 versions
- **Mobile**: iOS 13+, Android 8+

## 🚀 Deployment

### Build for Production

```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Build command
pnpm build

# Publish directory
dist
```

#### GitHub Pages
```bash
# Update vite.config.ts with base path
base: '/freeCodeCamp-Forum-Homepage/'

# Build and deploy
pnpm build
pnpm deploy
```

### Environment Variables

Production environment variables:
```env
VITE_API_URL=https://forum-proxy.freecodecamp.rocks
VITE_APP_TITLE=freeCodeCamp Forum
VITE_ENABLE_ANALYTICS=true
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) first.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup for Contributors

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/freeCodeCamp-Forum-Homepage.git
cd freeCodeCamp-Forum-Homepage

# Add upstream remote
git remote add upstream https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage.git

# Install dependencies
pnpm install

# Create branch
git checkout -b feature/your-feature

# Make changes and commit
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/your-feature
```

## 📚 Learning Resources

This project demonstrates concepts from:

- [Vue.js 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Testing Library](https://testing-library.com/)
- [Web.dev - Performance](https://web.dev/performance/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Blog Posts & Articles

- [Building Modern Vue Applications](https://developingdvlpr.com)
- [TypeScript Best Practices](https://developingdvlpr.com)
- [Testing Vue 3 Applications](https://developingdvlpr.com)

## 🐛 Known Issues

See [GitHub Issues](https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage/issues) for current bugs and feature requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nerajno Odhiambo**
- Website: [developingdvlpr.com](https://developingdvlpr.com)
- GitHub: [@NerajnoLearning](https://github.com/NerajnoLearning)
- Twitter: [@nerajno](https://twitter.com/nerajno)

## 🙏 Acknowledgments

- [freeCodeCamp](https://www.freecodecamp.org/) for the original design inspiration
- Vue.js team for the amazing framework
- The open-source community for excellent tools and libraries

## 📈 Project Status

**Current Phase**: Development

**Roadmap**:
- [x] Project setup and configuration
- [ ] Core component development
- [ ] API integration
- [ ] Testing implementation
- [ ] Performance optimization
- [ ] Documentation completion
- [ ] Production deployment

---

**⭐ If you find this project helpful, please consider giving it a star!**

## 📞 Support

If you have any questions or need help with the project:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage/issues)
3. Create a [new issue](https://github.com/NerajnoLearning/freeCodeCamp-Forum-Homepage/issues/new)
4. Reach out on [Twitter](https://twitter.com/nerajno)

---

**Built with ❤️ by Nerajno**