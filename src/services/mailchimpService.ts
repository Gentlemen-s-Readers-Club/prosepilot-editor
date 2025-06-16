interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
}

interface SubscribeResponse {
  success: boolean;
  message: string;
  error?: string;
}

class MailchimpService {
  private config: MailchimpConfig;

  constructor(config: MailchimpConfig) {
    this.config = config;
  }

  async subscribe(email: string, firstName?: string, lastName?: string): Promise<SubscribeResponse> {
    try {
      // For client-side integration, we'll use Mailchimp's embedded form approach
      // This is more secure than exposing API keys in the frontend
      const response = await fetch(`https://${this.config.serverPrefix}.api.mailchimp.com/3.0/lists/${this.config.audienceId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName || '',
            LNAME: lastName || '',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to subscribe');
      }

      const data = await response.json();
      
      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
      };
    } catch (error) {
      console.error('Mailchimp subscription error:', error);
      
      // Handle specific Mailchimp error cases
      if (error instanceof Error) {
        if (error.message.includes('Member Exists')) {
          return {
            success: false,
            message: 'This email is already subscribed to our newsletter.',
            error: 'ALREADY_SUBSCRIBED',
          };
        }
        
        if (error.message.includes('Invalid Resource')) {
          return {
            success: false,
            message: 'Please enter a valid email address.',
            error: 'INVALID_EMAIL',
          };
        }
      }

      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
        error: 'UNKNOWN_ERROR',
      };
    }
  }

  // Alternative method using Mailchimp's embedded form (more secure for client-side)
  getEmbeddedFormUrl(): string {
    // This would be your Mailchimp signup form URL
    // You can get this from your Mailchimp dashboard
    return `https://${this.config.serverPrefix}.list-manage.com/subscribe?u=${this.config.audienceId}&id=${this.config.audienceId}`;
  }
}

// Create a singleton instance
// You'll need to configure these values from your environment variables
const mailchimpService = new MailchimpService({
  apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY || '',
  serverPrefix: import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX || '',
  audienceId: import.meta.env.VITE_MAILCHIMP_AUDIENCE_ID || '',
});

export { mailchimpService, MailchimpService };
export type { SubscribeResponse, MailchimpConfig }; 