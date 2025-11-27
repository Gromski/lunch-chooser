# Product Requirements Document: Lunch Decision Tool

## Purpose
Help office teams pick where to eat lunch by suggesting nearby options filtered by group preferences, dietary requirements, and recent visit history.

## Core Problem
Teams waste time debating lunch options. The tool should eliminate that friction whilst occasionally surfacing new places people haven't tried.

---

## Phase 1: MVP (Quick & Minimal)

### Must-Have Features

#### Location & Discovery
- Detect user's current location or let them set office location
- Pull nearby food options from Google Places API
- Show options within configurable radius or walk time
- Display basic info: name, type, distance, estimated walk time

#### Filtering
- Filter by food type (Italian, Asian, sandwiches, etc.)
- Filter by establishment type (sit-down, takeaway, café)
- Filter by distance/walk time

#### Display
- Show ranked list of options
- Simple, mobile-responsive interface
- Works on desktop browser and mobile

### Nice-to-Have (Phase 1)

#### Basic Profiles
- Simple user accounts
- Store dietary requirements (vegetarian, vegan, gluten-free, allergies)
- Manual entry of requirements if no account

#### Group Coordination
- Create a "lunch group" for today
- See who's joining
- Aggregate dietary requirements automatically
- Filter results to match everyone's needs

---

## Phase 2: Intelligence & History

### Must-Have Features

#### Visit Tracking
- Log where the group ate
- Flag options visited in last 7-14 days
- Exclude yesterday's choice automatically

#### Smart Ranking
- Boost places the group visits often
- Surface new options periodically
- Weight by group size suitability

#### Voting
- Show top 3-5 options
- Quick vote mechanism
- Auto-select winner or show results

### Nice-to-Have (Phase 2)

#### Enhanced Data
- Cache opening hours
- Show price indicators
- Pull ratings from multiple sources
- Basic menu information

#### Preferences Beyond Dietary
- "Today I want..." hot food, light meal, specific cuisine
- Must-haves vs. nice-to-haves distinction
- Weather-aware suggestions (hot/cold day preferences)

---

## Phase 3: Integrations & Polish

### Future Features

#### Platform Integration
- Slack bot for creating lunch groups
- WhatsApp integration
- Calendar integration for timing

#### Enhanced Intelligence
- Learn individual preferences over time
- Suggest based on weather, day of week
- Track which suggestions get accepted vs. rejected

#### Data Richness
- Menu previews
- Booking links (OpenTable integration)
- User-submitted photos and notes
- Price comparison

---

## Users & Workflows

### Primary User: Team Member

#### Daily Flow
1. Open tool (mobile or desktop)
2. See who else is getting lunch
3. Join the lunch group
4. Review suggested options (pre-filtered for group)
5. Vote on top choices
6. See where group is going

#### Profile Setup (One-Time)
1. Create account
2. Set dietary requirements
3. Optionally set food preferences
4. Set office location

### Secondary User: Occasional Coordinator

#### Manual Flow
1. Create lunch group
2. Add participants manually
3. Input any special requirements
4. Get filtered suggestions
5. Share with group

---

## Technical Considerations

### Data Sources
- Primary: Google Places API
- Future: TripAdvisor, OpenTable for enhanced data
- Cache static data (opening hours, location, type)
- Refresh dynamic data (ratings, availability) periodically

### Data Model

#### User Profile
- Name, email
- Dietary requirements (array)
- Food preferences (optional)
- Default location

#### Lunch Group (Session)
- Date
- Participants (array of users)
- Aggregated requirements
- Status (planning, voted, decided)

#### Restaurant/Establishment
- Name, location, type
- Food categories
- Distance from office
- Opening hours
- Cached rating
- Last visited (by this group)
- Visit frequency

#### Vote
- User, restaurant, lunch group
- Timestamp

---

## Success Metrics

### Primary
- Tool usage frequency (daily active groups)
- Time from "create group" to "decision made"
- Acceptance rate (votes cast vs. suggestions shown)

### Secondary
- New restaurant discovery rate
- User retention (weekly active users)
- Profile completion rate

### Qualitative
- Anecdotal feedback: "Did it stop the debate?"
- Surprise factor: "Did it suggest somewhere new you liked?"

---

## Out of Scope (For Now)

- Booking tables
- Ordering food through the tool
- Splitting bills
- Reviews and ratings (user-generated)
- Desktop notifications
- Multi-office support

---

## Open Questions

1. **Group size**: What's typical? 2-3 people or 8-10? This affects restaurant filtering.
2. **Office location**: Fixed, or do people work from different offices?
3. **Dietary requirements**: Should these be private or visible to the group?
4. **Authentication**: Email/password, or social login, or magic links?
5. **Walk time calculation**: Straight-line distance or actual walking routes?

---

## Implementation Notes

This PRD is designed for iterative development. Start with Phase 1 MVP features, validate with users, then progress to Phase 2 and Phase 3 based on actual usage patterns and feedback.

The tool should prioritise speed and simplicity in Phase 1. Users should be able to get a lunch suggestion in under 30 seconds from opening the app.
