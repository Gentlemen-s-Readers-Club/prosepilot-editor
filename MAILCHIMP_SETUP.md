# Mailchimp Integration Setup

This guide will help you set up the Mailchimp integration for the newsletter subscription form.

## Prerequisites

1. A Mailchimp account
2. An audience (mailing list) created in Mailchimp

## Configuration Steps

### 1. Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Go to **Account** → **Extras** → **API Keys**
3. Click **Create A Key**
4. Copy the generated API key

### 2. Get Your Server Prefix

The server prefix is the part after the dash in your API key. For example:
- If your API key is `abc123-us1`, your server prefix is `us1`
- If your API key is `def456-us2`, your server prefix is `us2`

### 3. Get Your Audience ID

1. Go to **Audience** → **Settings** → **Audience name and defaults**
2. Copy the **Audience ID** (it looks like a long string of letters and numbers)

### 4. Set Up Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_MAILCHIMP_API_KEY=your_mailchimp_api_key_here
VITE_MAILCHIMP_SERVER_PREFIX=us1
VITE_MAILCHIMP_AUDIENCE_ID=your_audience_id_here
```

Replace the placeholder values with your actual Mailchimp credentials.

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to a page with the SubscribeForm component
3. Try subscribing with a test email address
4. Check your Mailchimp audience to see if the subscription was successful

## Security Notes

- Never commit your `.env` file to version control
- The API key is exposed to the client-side, so consider using a backend proxy for production applications
- For production, you might want to use Mailchimp's embedded forms or server-side integration for better security

## Troubleshooting

### Common Issues

1. **"Invalid API Key" error**: Double-check your API key and server prefix
2. **"Audience not found" error**: Verify your audience ID is correct
3. **CORS errors**: This might indicate a server prefix issue

### Alternative Integration Methods

If you encounter issues with the API integration, you can also use Mailchimp's embedded forms:

1. Go to **Audience** → **Signup forms** → **Embedded forms**
2. Copy the form URL
3. Use the `getEmbeddedFormUrl()` method in the service

## Support

If you continue to have issues, refer to the [Mailchimp API documentation](https://mailchimp.com/developer/marketing/api/) or contact Mailchimp support. 