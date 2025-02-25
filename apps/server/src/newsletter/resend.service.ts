// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class ResendService implements OnModuleInit {
//   // private readonly resend: Resend;
//   private readonly apiKey: string;
//   private readonly audienceId: string;

//   constructor(private readonly configService: ConfigService) {
//     const apiKey = this.configService.get<string>('mailer.resend.apiKey');
//     const audienceId = this.configService.get<string>(
//       'mailer.resend.audienceId',
//     );

//     // if (!apiKey || !audienceId) {
//     //   throw new Error(
//     //     'Missing Resend configuration (RESEND_API_KEY or RESEND_AUDIENCE_ID)',
//     //   );
//     // }

//     this.apiKey = apiKey;
//     this.audienceId = audienceId;
//     // this.resend = new Resend(this.apiKey);
//   }

//   async onModuleInit() {
//     // Validate connection on startup by checking the API key
//     try {
//       const response = await fetch('https://api.resend.com/audiences', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${this.apiKey}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to connect to Resend: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error('Failed to initialize Resend client:', error);
//       throw error;
//     }
//   }

//   async addContactToAudience(
//     email: string,
//     firstName: string,
//     interests: string,
//   ) {
//     try {
//       // Using the REST API directly since the SDK doesn't expose contacts API yet
//       const response = await fetch(
//         `https://api.resend.com/audiences/${this.audienceId}/contacts`,
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${this.apiKey}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             email,
//             firstName,
//             unsubscribed: false,
//             data: {
//               interests,
//             },
//           }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to add contact: ${response.statusText}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error adding contact to Resend audience:', error);
//       return false;
//     }
//   }

//   async removeContactFromAudience(email: string) {
//     try {
//       // Using the REST API directly since the SDK doesn't expose contacts API yet
//       const response = await fetch(
//         `https://api.resend.com/audiences/${this.audienceId}/contacts/${email}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${this.apiKey}`,
//           },
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to remove contact: ${response.statusText}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error removing contact from Resend audience:', error);
//       return false;
//     }
//   }
// }
