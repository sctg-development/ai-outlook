# AI Outlook Add-in

This project is an add-in for Outlook web that integrates Groq AI or Sambanova AI and Meta Llama model capabilities into your email experience. It allows users to leverage the power of Groq's AI in their daily email interactions.

## Table of Contents

- [AI Outlook Add-in](#ai-outlook-add-in)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Development](#development)
  - [License](#license)
  - [Privacy Policy](#privacy-policy)
  - [Contributing](#contributing)
  - [Support](#support)

## Overview

The AI Outlook Add-in enhances your email workflow by providing AI-powered assistance directly within your Outlook web interface. By leveraging the OpenAI v1 API, this add-in offers intelligent features to help you compose, analyze, and manage your emails more efficiently.

**Project Repository:** [https://github.com/sctg-development/ai-outlook](https://github.com/sctg-development/ai-outlook)

**Deployed Add-in:** [https://outlook.addin.pp.ua/](https://outlook.addin.pp.ua/manifest.json)

## Features

- AI-powered email composition suggestions
- Automated email summarization
- Prompt easy configurable in src/config.json
- Model configuration in src/config.json
- Language translation integration
- Compatible with Groq AI and Sambanova AI ([via AI-Proxy-Cloudflare](https://github.com/sctg-development/ai-proxy-cloudflare))

## Prerequisites

Before you can use the AI Outlook Add-in, you'll need:

1. Access to your company's Microsoft 365 admin console
2. A Groq AI developer API key (obtain one from [Groq's developer portal](https://console.groq.com))

## Installation

To install the AI Outlook Add-in, follow these steps:

1. Download the latest release (nightly) ZIP file from the [project's GitHub releases section](https://github.com/sctg-development/ai-outlook/releases).
2. Log in to your company's Microsoft 365 admin console.
3. Navigate to Settings > Integrated applications.
4. Click on "Load customized applications" (or a similar option for adding custom add-ins).
5. Upload the ZIP file you downloaded in step 1.
6. Follow any additional prompts to complete the installation process.

Note: The exact steps may vary slightly depending on your organization's Microsoft 365 configuration. If you encounter any issues, please contact your IT administrator for assistance.

## Usage

After installation:

1. Open Outlook on the web and sign in to your account.
2. Open an email or start composing a new message.
3. Look for the AI Outlook Add-in called **AI emailer** icon in the Outlook ribbon.
4. Click on the icon to open the add-in pane.
5. Enter your Groq AI developer API key when prompted (this is a one-time setup).
6. Use the add-in features as needed in your email workflow:
   - For composition assistance, select the text you want to improve and use the relevant feature.
   - For email summarization, open the email you want to summarize and use the summarization feature.
   - For translation, select the text to translate and choose the target language.

Refer to the in-app instructions for more detailed usage guidelines.

## Development

To set up the development environment:

1. Clone the repository: `git clone https://github.com/sctg-development/groq-outlook.git`
2. Install dependencies: `npm install`
3. Sign in Office 365: `npm run signin`
4. Start the development server: `npm start`

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3). For more details, see the [LICENSE](LICENSE.md) file in the project repository.

## Privacy Policy

Please refer to the [PRIVACY.md](PRIVACY.md) file for information on data collection, usage, and privacy practices related to the Groq Outlook Add-in.

## Contributing

We welcome contributions to the Groq Outlook Add-in! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions about the Groq Outlook Add-in, please [open an issue](https://github.com/sctg-development/groq-outlook/issues) on our GitHub repository.

---

This project is not affiliated with or endorsed by Microsoft, Meta or Groq. It is an independent add-in developed to enhance the Outlook web experience using Groq's AI capabilities and Meta Llama models.
