# Lunch Decision Tool

A location-based web application that helps office teams quickly decide where to eat lunch by suggesting nearby options filtered by group preferences, dietary requirements, and visit history.

## 🎯 Project Purpose

This project serves as a **teaching aid** demonstrating how to transform a Product Requirements Document (PRD) into a comprehensive, implementation-ready documentation set using Cursor's AI-powered development workflow.

## 📚 The Workflow: PRD → Documentation → Implementation

This project showcases a powerful development workflow:

1. **Start with a PRD** - A clear, structured Product Requirements Document
2. **Create Cursor Rules** - Define how the AI should interpret and expand the PRD
3. **Generate Comprehensive Documentation** - Let Cursor create detailed implementation docs
4. **Build with Vibe-Coding** - Use the documentation to guide AI-assisted development

### The Documentation Pyramid

```
                    ┌─────────────────┐
                    │   PRD (Input)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Cursor Rules   │
                    │  (Generator)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│ Implementation │  │  Data Model    │  │  API Specs      │
│     Plan       │  │                 │  │                 │
└────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│ Frontend Docs  │  │ Backend Docs    │  │  UI/UX Specs    │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## 📁 Project Structure

```
lunch-chooser/
├── docs/
│   ├── lunch-tool-prd.md          # Original PRD (input)
│   ├── implementation.md          # Master implementation plan
│   ├── data_model.md              # Complete database schema
│   ├── api_specifications.md      # API endpoint documentation
│   ├── project_structure.md       # Folder structure & conventions
│   ├── uiux_doc.md                # Design system & UI specs
│   ├── frontend/
│   │   ├── pages/                 # Page specifications
│   │   └── shared_components/     # Component documentation
│   └── backend/
│       ├── entities/              # Entity CRUD documentation
│       └── api_endpoints/         # Endpoint specifications
├── .cursor/
│   └── rules/
│       └── implementation-plan-generator.mdc  # Cursor rule for doc generation
└── README.md                      # This file
```

## 🚀 How It Works

### Step 1: The PRD

The project starts with [`docs/lunch-tool-prd.md`](docs/lunch-tool-prd.md), a well-structured PRD that defines:
- Core problem and purpose
- Feature requirements (phased approach)
- User workflows
- Technical considerations
- Data model concepts

### Step 2: The Cursor Rule

The [`implementation-plan-generator.mdc`](.cursor/rules/implementation-plan-generator.mdc) rule instructs Cursor on how to:
- Analyze the PRD systematically
- Extract features, entities, and pages
- Research appropriate tech stack
- Create comprehensive documentation structure
- Generate implementation stages with checkboxes

### Step 3: Generated Documentation

When prompted with the PRD and rule, Cursor generated:

#### Core Documentation
- **`implementation.md`** - Complete implementation plan with 6 stages, tech stack recommendations, and resource links
- **`data_model.md`** - Full database schema with PostgreSQL/PostGIS, relationships, indexes, and validation rules
- **`api_specifications.md`** - Complete API documentation with request/response formats, authentication, and error handling
- **`project_structure.md`** - Detailed folder structure, naming conventions, and file organization
- **`uiux_doc.md`** - Design system, user flows, responsive design, and accessibility requirements

#### Frontend Documentation
- **5 page specifications** - Home, Restaurants, Lunch Group, Profile, Restaurant Detail
- **7 shared component docs** - Navigation, Header, Cards, Filters, etc.

#### Backend Documentation
- **5 entity documents** - User, Restaurant, Lunch Group, Vote, Visit History (with full CRUD)
- **3 API endpoint groups** - User, Restaurant, Lunch Group endpoints

### Step 4: Ready for Implementation

All documentation is interconnected and provides:
- ✅ Clear implementation stages with checkboxes
- ✅ Complete CRUD operations for all entities
- ✅ Detailed page specifications
- ✅ API endpoint documentation
- ✅ Design system and UI/UX guidelines
- ✅ Tech stack recommendations with documentation links

## 🛠️ Technology Stack

Based on the PRD analysis, the recommended stack includes:

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma
- **External APIs**: Google Places API
- **Deployment**: Vercel

See [`docs/implementation.md`](docs/implementation.md) for complete tech stack justification and documentation links.

## 📖 Key Learnings

### What Makes This Work

1. **Structured PRD** - A well-organized PRD with clear phases, features, and data models
2. **Detailed Cursor Rules** - Rules that guide the AI through systematic analysis
3. **Comprehensive Output** - The rule generates interconnected documentation covering all aspects
4. **Implementation Ready** - The docs provide everything needed to start building

### The Power of Vibe-Coding

With comprehensive documentation in place, you can:
- Ask Cursor to implement specific stages from `implementation.md`
- Reference entity docs when building CRUD operations
- Use page specs to guide component development
- Follow API specs for endpoint implementation
- Apply UI/UX guidelines for consistent design

## 🎓 Teaching Points

This project demonstrates:

1. **Documentation as Code** - Documentation is version-controlled and evolves with the project
2. **AI-Assisted Planning** - Using AI to expand high-level requirements into detailed specs
3. **Systematic Approach** - Breaking down a PRD into analyzable components
4. **Implementation Readiness** - Documentation that's actually useful for development
5. **Vibe-Coding Workflow** - Using AI tools effectively with proper context

## 📝 Next Steps

To use this project:

1. **Review the PRD** - Understand the original requirements
2. **Examine the Cursor Rule** - See how it structures the analysis
3. **Explore the Documentation** - See how the PRD was expanded
4. **Start Implementation** - Use the docs to guide development with Cursor

## 🔗 Documentation Links

### Quick Start
- [Setup Guide](docs/SETUP.md) - Get started quickly with setup instructions

### Core Documentation
- [Product Requirements Document](docs/lunch-tool-prd.md)
- [Implementation Plan](docs/implementation.md)
- [Data Model](docs/data_model.md)
- [API Specifications](docs/api_specifications.md)
- [Project Structure](docs/project_structure.md)
- [UI/UX Documentation](docs/uiux_doc.md)

### Setup & Configuration
- [Supabase Setup](docs/supabase-setup.md) - Database setup guide
- [Database Setup](docs/database-setup.md) - Alternative local PostgreSQL setup
- [Google Places API Setup](docs/google-places-api-setup.md) - API configuration
- [NextAuth v5 Setup](docs/NEXTAUTH_V5_SETUP.md) - Authentication configuration

### Progress & Status
- [Stage 2 Progress](docs/STAGE2_PROGRESS.md) - Development progress tracking
- [Stage 2 Complete](docs/STAGE2_COMPLETE.md) - Completed features summary

## 📄 License

This project is created for educational purposes as a teaching aid.

## 🙏 Acknowledgments

This project demonstrates the power of combining:
- **Clear Requirements** (PRD)
- **Structured AI Guidance** (Cursor Rules)
- **Comprehensive Documentation** (Generated Specs)
- **AI-Assisted Development** (Vibe-Coding with Cursor)

---

**Note**: This project is currently in the documentation phase. Implementation follows the stages outlined in [`docs/implementation.md`](docs/implementation.md).

