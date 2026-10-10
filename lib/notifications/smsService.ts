// SMS and Notification service abstraction for MED-BRIDGE
// Supports Mock Provider (for demo & offline development) and Real Provider (Twilio/Gupshup/Fast2SMS)

export type NotificationChannel = 'SMS' | 'WHATSAPP' | 'IN_APP';

export type DeliveryStatus = 
  | 'PENDING' 
  | 'SENT' 
  | 'DELIVERED' 
  | 'FAILED' 
  | 'RETRY_SCHEDULED' 
  | 'RETRY_EXHAUSTED';

export interface NotificationPayload {
  recipientPhone: string;
  recipientName: string;
  prescriptionId: string;
  doctorName: string;
  summaryText?: string;
  medicinesCount?: number;
}

export interface NotificationResult {
  id: string;
  channel: NotificationChannel;
  recipientPhone: string;
  status: DeliveryStatus;
  messageText: string;
  timestamp: string;
  provider: 'MOCK_SANDBOX' | 'FAST2SMS' | 'TWILIO' | 'GUPSHUP';
  costRupees?: number;
  providerReference?: string;
  note?: string;
}

export interface NotificationProvider {
  name: string;
  sendPrescriptionAlert(payload: NotificationPayload): Promise<NotificationResult>;
  getDeliveryStatus(notificationId: string): Promise<DeliveryStatus>;
}

// 1. Privacy-conscious Mock Provider for Demo Mode
export class MockNotificationProvider implements NotificationProvider {
  name = 'MOCK_SANDBOX';

  async sendPrescriptionAlert(payload: NotificationPayload): Promise<NotificationResult> {
    // Generate official SMS template
    // Note: Privacy protected by default - reference number only, no sensitive diagnoses in SMS text
    const messageText = `MED-BRIDGE: Dr. ${payload.doctorName} has issued your e-prescription (Ref: ${payload.prescriptionId}). Access securely or show this code at any registered pharmacy: https://medbridge.in/p/${payload.prescriptionId} (Emergency: 1800-MED-BRIDGE)`;

    // Simulate realistic network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 600));

    // In demo mode, simulate 95% instant success delivery
    const isSuccess = !payload.recipientPhone.endsWith('000'); // If number ends in 000, simulate failure for testing

    return {
      id: `NOTIF-${Math.floor(100000 + Math.random() * 900000)}`,
      channel: 'SMS',
      recipientPhone: payload.recipientPhone,
      status: isSuccess ? 'DELIVERED' : 'FAILED',
      messageText,
      timestamp: new Date().toISOString(),
      provider: 'MOCK_SANDBOX',
      costRupees: 0.12,
      providerReference: `MOCK_TXN_${Date.now().toString(36).toUpperCase()}`,
      note: isSuccess 
        ? 'Simulated SMS dispatch. Delivered via virtual DLT gateway.' 
        : 'Simulated carrier rejection (DND / invalid number).',
    };
  }

  async getDeliveryStatus(_notificationId: string): Promise<DeliveryStatus> {
    return 'DELIVERED';
  }
}

// 2. Production Ready SMS Provider (when credentials configured in env)
export class RealSmsProvider implements NotificationProvider {
  name = 'FAST2SMS';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendPrescriptionAlert(payload: NotificationPayload): Promise<NotificationResult> {
    const messageText = `MED-BRIDGE: Your doctor (${payload.doctorName}) has issued prescription ${payload.prescriptionId}. Present this code to your pharmacist.`;
    
    try {
      // If server-side fetch available
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'v3',
          sender_id: 'TXTIND',
          message: messageText,
          language: 'english',
          flash: 0,
          numbers: payload.recipientPhone,
        }),
      });

      const data = await response.json();
      const isDelivered = data.return === true;

      return {
        id: `NOTIF-${Date.now()}`,
        channel: 'SMS',
        recipientPhone: payload.recipientPhone,
        status: isDelivered ? 'SENT' : 'FAILED',
        messageText,
        timestamp: new Date().toISOString(),
        provider: 'FAST2SMS',
        providerReference: data.request_id || undefined,
      };
    } catch (err: any) {
      return {
        id: `NOTIF-${Date.now()}`,
        channel: 'SMS',
        recipientPhone: payload.recipientPhone,
        status: 'FAILED',
        messageText,
        timestamp: new Date().toISOString(),
        provider: 'FAST2SMS',
        note: `Error connecting to provider: ${err?.message || 'Network error'}`,
      };
    }
  }

  async getDeliveryStatus(_notificationId: string): Promise<DeliveryStatus> {
    return 'SENT';
  }
}

// Factory to get active notification provider
export function getNotificationProvider(): NotificationProvider {
  const realApiKey = process.env.SMS_API_KEY || process.env.NEXT_PUBLIC_SMS_API_KEY;
  if (realApiKey && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    return new RealSmsProvider(realApiKey);
  }
  return new MockNotificationProvider();
}
