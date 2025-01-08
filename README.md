# AI Outlook Add-in

Welcome to the AI Outlook Add-in, a powerful tool that integrates Groq AI and Sambanova AI capabilities into Microsoft Outlook web, enhancing your email experience. This project aims to provide users with AI-powered assistance in their daily email interactions, making email management more efficient and productive.

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩**

## Status
  
  ![GitHub release](https://img.shields.io/github/v/release/sctg-development/ai-outlook)
  ![GitHub last commit](https://img.shields.io/github/last-commit/sctg-development/ai-outlook)
  ![GitHub issues](https://img.shields.io/github/issues/sctg-development/ai-outlook)
  ![GitHub stars](https://img.shields.io/github/stars/sctg-development/ai-outlook)

## Help Wanted

Give us a **star** if you like the project. We are looking for contributors to help us improve the project. If you are interested, please check the [Contributing](#contributing) section.

## Table of Contents

- [AI Outlook Add-in](#ai-outlook-add-in)
  - [Star the project](#star-the-project)
  - [Status](#status)
  - [Help Wanted](#help-wanted)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Screenshot](#screenshot)
  - [Prerequisites](#prerequisites)
  - [Installation on Microsoft 365](#installation-on-microsoft-365)
  - [Installation on Outlook Web (manifest.json not supported)](#installation-on-outlook-web-manifestjson-not-supported)
  - [Usage](#usage)
  - [Development](#development)
  - [Customization](#customization)
  - [License](#license)
  - [Privacy Policy](#privacy-policy)
  - [Contributing](#contributing)
  - [Support](#support)
  - [Thanks](#thanks)

## Overview

The AI Outlook Add-in enhances your email workflow by providing AI-powered assistance directly within your Outlook web interface. By leveraging the OpenAI v1 API, this add-in offers intelligent features to help you compose, analyze, and manage your emails more efficiently.

**Project Repository:** [https://github.com/sctg-development/ai-outlook](https://github.com/sctg-development/ai-outlook)

**Deployed Add-in:** [https://outlook.addin.pp.ua/](https://outlook.addin.pp.ua/manifest.json)
**Deployed Add-in (GitHub Pages):** [https://sctg-development.github.io/ai-outlook](https://sctg-development.github.io/ai-outlook)

## Features

- AI-powered email composition suggestions
- Automated email summarization
- Prompt easy configurable in src/config.ts
- Model configuration in src/config.ts
- Language translation integration
- Compatible with Groq AI and Sambanova AI ([via AI-Proxy-Cloudflare due to CORS](https://github.com/sctg-development/ai-proxy-cloudflare))

## Screenshot

<img width="936" alt="Capture d’écran 2024-10-10 à 18 25 10" src="https://github.com/user-attachments/assets/07041511-626f-465e-ba12-3d6bd54b3b2c">
<img width="1086" alt="Capture d’écran 2024-10-09 à 12 33 19" src="https://github.com/user-attachments/assets/3802ebe4-cf2e-4ee2-ba41-45dc27d94ddc">
<img width="979" alt="Capture d’écran 2024-10-10 à 18 25 47" src="https://github.com/user-attachments/assets/1c905169-3897-452d-ac13-c8b35520948c">

## Prerequisites

Before you can use the AI Outlook Add-in, you'll need:

1. Access to your company's Microsoft 365 admin console
2. A Groq AI developer API key (obtain one from [Groq's developer portal](https://console.groq.com))
3. For SambaNova AI, obtain an API key from [SambaNova's developer portal](https://console.sambanova.ai) you also need a proxy for bypassing the lack of CORS headers in the sambanova API. You can use our [AI-Proxy-Cloudflare](https://github.com/sctg-development/ai-proxy-cloudflare) for this purpose.

## Installation on Microsoft 365

To install the AI Outlook Add-in, follow these steps:

1. Download the latest release (nightly) ZIP file from the [project's GitHub releases section](https://github.com/sctg-development/ai-outlook/releases).
   1. Note release_*.zip use Cloudflare Pages for hosting the add-in.
   2. Note release_github_pages_*.zip use GitHub Pages for hosting the add-in.
2. Log in to your company's Microsoft 365 admin console.
3. Navigate to Settings > Integrated applications.
4. Click on "Load customized applications" (or a similar option for adding custom add-ins).
5. Upload the ZIP file you downloaded in step 1.
6. Follow any additional prompts to complete the installation process.

Note: The exact steps may vary slightly depending on your organization's Microsoft 365 configuration. If you encounter any issues, please contact your IT administrator for assistance.

## Installation on Outlook Web (manifest.json not supported)

To install the AI Outlook Add-in on Outlook web if you cannot use a zip or xml file, follow these steps:

1. Open Outlook on the web and sign in to your account.
2. Download the latest [manifest.xml](https://outlook.addin.pp.ua/manifest.xml) or build yours.  
3. Navigate to Settings > Integrated applications.
4. Click on "Load customized applications" (or a similar option for adding custom add-ins).
5. Upload the XML file you downloaded in step 2.
6. Follow any additional prompts to complete the installation process.

Note: The icon may not appear in the ribbon immediately after installation. If you don't see it, try refreshing the page or restarting your browser.

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

1. Clone the repository: `git clone https://github.com/sctg-development/ai-outlook.git`
2. Install dependencies: `npm install`
3. Sign in Office 365: `npm run signin`
4. Start the development server: `npm start`

## Customization

You can customize the AI Outlook Add-in by modifying the `src/config.ts` file.  
You'll also need to update the `manifest.json` file to reflect your deployment settings.  

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3). For more details, see the [LICENSE](LICENSE.md) file in the project repository.

## Privacy Policy

Please refer to the [PRIVACY.md](PRIVACY.md) file for information on data collection, usage, and privacy practices related to the Groq Outlook Add-in.

## Contributing

We welcome contributions to the AI Outlook Add-in! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions about the AI Outlook Add-in, please [open an issue](https://github.com/sctg-development/ai-outlook/issues) on our GitHub repository.

---

This project is not affiliated with or endorsed by Microsoft, Meta, SambaNova or Groq. It is an independent add-in developed to enhance the Outlook web experience using Groq's AI capabilities and Meta Llama models.

## Thanks

Thank you to Groq for giving us access for free to their AI API. We are grateful for their support and collaboration.

[![Powered by Groq for fast inference.](https://groq.com/wp-content/uploads/2024/03/PBG-mark1-color.svg)](https://groq.com)
