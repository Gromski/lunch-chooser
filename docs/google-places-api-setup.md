# Google Places API Setup Guide

This guide covers setting up the Google Places API for restaurant discovery in the Lunch Chooser application.

## Prerequisites

- Google Cloud Platform (GCP) account
- Billing enabled on GCP project (Places API requires billing)

## Step 1: Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: `lunch-chooser` (or your preferred name)
5. Click "Create"

## Step 2: Enable Places API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API (New)"
4. Click "Enable"

**Note**: You may also want to enable:
- **Geocoding API** - For converting addresses to coordinates
- **Maps JavaScript API** - If you plan to use maps in the UI

## Step 3: Create API Key

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key (you'll need it in the next step)

## Step 4: Restrict API Key (Recommended for Production)

For security, restrict your API key:

1. Click on the API key you just created
2. Under "API restrictions", select "Restrict key"
3. Choose "Places API (New)" (and any other APIs you enabled)
4. Under "Application restrictions":
   - For development: Select "None" or "IP addresses" and add your development IPs
   - For production: Select "HTTP referrers" and add your domain:
     ```
     https://yourdomain.com/*
     http://localhost:3000/* (for local development)
     ```
5. Click "Save"

## Step 5: Configure Environment Variables

Add your API key to `.env.local`:

```env
GOOGLE_PLACES_API_KEY="your-api-key-here"
```

**Important**: Never commit your API key to version control. The `.env.local` file is already in `.gitignore`.

## Step 6: Verify Setup

You can test the API key by making a test request:

```bash
curl "https://places.googleapis.com/v1/places:searchText" \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: YOUR_API_KEY" \
  -d '{
    "textQuery": "restaurant near me"
  }'
```

## API Usage and Quotas

### Pricing (as of 2024)
- Places API (New) charges per request
- First $200/month in API usage is free (Google Cloud Free Tier)
- Review current pricing: [Places API Pricing](https://cloud.google.com/maps-platform/pricing)

### Rate Limits
- Default quota: 1,000 requests per day (can be increased)
- Consider implementing caching to reduce API calls

### Best Practices

1. **Cache Restaurant Data**: Store restaurant data in your database and refresh every 24 hours
2. **Use SearchText API**: For searching restaurants by location and text query
3. **Batch Requests**: When possible, batch multiple requests
4. **Monitor Usage**: Set up billing alerts in GCP Console

## API Endpoints We'll Use

### 1. Search Text (Find Restaurants)
```
POST https://places.googleapis.com/v1/places:searchText
```
- Used to find restaurants near a location
- Supports filtering by text query, location, and radius

### 2. Get Place Details
```
GET https://places.googleapis.com/v1/places/{place_id}
```
- Used to get detailed information about a specific restaurant
- Includes opening hours, reviews, photos, etc.

### 3. Get Place Photo
```
GET https://places.googleapis.com/v1/{name}/media/{photoReference}/maxWidthPx={maxWidth}
```
- Used to get restaurant photos

## Implementation Notes

The Google Places API integration will be implemented in:
- `src/lib/google-places.ts` - API client functions
- `src/app/api/v1/restaurants/search/route.ts` - Search endpoint

## Security Considerations

1. **Never expose API keys in client-side code**: Always make API calls from server-side (API routes)
2. **Restrict API keys**: Use HTTP referrer restrictions for production
3. **Monitor usage**: Set up billing alerts and monitor API usage regularly
4. **Rotate keys**: Regularly rotate API keys if compromised

## Troubleshooting

### API Key Invalid Error

- Verify the API key is correct in `.env.local`
- Check that Places API is enabled in your GCP project
- Verify API key restrictions allow your IP/domain

### Quota Exceeded

- Check your API usage in GCP Console
- Implement caching to reduce API calls
- Request quota increase if needed

### 403 Forbidden

- Verify billing is enabled on your GCP project
- Check API key restrictions
- Ensure Places API is enabled

## Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Places API (New) Guide](https://developers.google.com/maps/documentation/places/web-service/overview)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)



