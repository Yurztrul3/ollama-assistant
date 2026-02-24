# Ollama Assistant for Visual Studio Code

![Ollama Assistant](https://raw.githubusercontent.com/Yurztrul3/ollama-assistant/main/images/ollama-icon.png)

An extension that integrates Ollama AI into Visual Studio Code, allowing you to interact with local AI models directly from your editor.

## Features

- **Local AI Integration**: Connect to your local Ollama instance
- **Model Selection**: Choose from all available Ollama models
- **Workspace Context**: Include workspace files in your prompts
- **Enhanced Response Display**: Clean, formatted responses in a dedicated panel
- **Easy Access**: Simple command to start chatting with AI

## Requirements

- Visual Studio Code 1.109.0 or higher
- Ollama installed and running locally (https://ollama.com/)

## Installation

1. Install Ollama locally:
   - Download from [ollama.com](https://ollama.com/)
   - Follow installation instructions for your operating system
   - Start Ollama service: `ollama serve`

2. Install this extension in VS Code:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Ollama Assistant"
   - Click Install

## Usage

1. Open VS Code
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Type "Ollama Chat" and select the command
4. Choose an AI model from your local Ollama installation
5. Enter your prompt
6. Optionally, choose to include workspace files in the context
7. View the AI response in a dedicated panel

## Command

- **Ollama Chat**: Start a conversation with your local AI model

## Extension Settings

This extension contributes the following settings:

- `ollama-assistant.model`: Default model to use (default: "llama3")
- `ollama-assistant.host`: Ollama server host (default: "localhost")
- `ollama-assistant.port`: Ollama server port (default: "11434")

## Example Use Cases

- **Code Review**: "Review this function and suggest improvements"
- **Documentation**: "Explain how this code works"
- **Debugging Help**: "What could be wrong with this code?"
- **Learning**: "Explain this concept in simple terms"
- **Workspace Context**: Include your project files for more relevant responses

## Requirements

Before using this extension, make sure you have:
1. Ollama installed and running locally
2. At least one AI model downloaded (e.g., `ollama run llama3`)

## Extension Commands

### Ollama Chat
Starts a conversation with your local Ollama AI model.

### Ollama Chat with Workspace Context
Starts a conversation with your local Ollama AI model and includes your current workspace files in the prompt.

## Known Issues

- Requires Ollama to be running locally
- Large workspace files may slow down response times
- Network issues with local Ollama server will cause connection errors

## Release Notes

### 1.0.0
- Initial release
- Basic Ollama integration
- Workspace file inclusion feature
- Enhanced response display

### 1.0.1
- Improved error handling
- Better response formatting
- Performance optimizations

## Contributing

This is an open source project. Contributions are welcome!

1. Fork it
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a new Pull Request

## License

MIT License

Copyright (c) 2026 John Gliha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

For support, please open an issue on the GitHub repository or contact the maintainer.

---
*Made with ❤️ for developers*
