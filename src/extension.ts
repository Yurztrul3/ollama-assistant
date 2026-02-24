// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Define TypeScript interfaces for Ollama API responses
interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

interface OllamaTagsResponse {
  models: OllamaModel[];
}

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
  context: number[];
  timings: {
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
  };
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // Register the Ollama Chat command
  let disposable = vscode.commands.registerCommand('ollama-assistant.ollamaChat', async function () {
    try {
      // Fetch available models from Ollama
      const modelsResponse = await fetch('http://localhost:11434/api/tags');
      
      if (!modelsResponse.ok) {
        throw new Error(`Failed to fetch models: ${modelsResponse.status} ${modelsResponse.statusText}`);
      }
      
      // Properly type the JSON response
      const modelsData = await modelsResponse.json() as OllamaTagsResponse;
      
      if (!modelsData || !modelsData.models || modelsData.models.length === 0) {
        vscode.window.showErrorMessage('No models found on Ollama. Please pull a model first.');
        return;
      }

      // Show model selection
      const modelNames = modelsData.models.map(model => model.name);
      const selectedModel = await vscode.window.showQuickPick(modelNames, {
        placeHolder: 'Select a model to use',
        canPickMany: false
      });

      if (!selectedModel) {
        return;
      }

      // Get user input
      const prompt = await vscode.window.showInputBox({
        prompt: `Enter your prompt for ${selectedModel}`,
        placeHolder: 'e.g., Explain quantum computing in simple terms'
      });

      if (!prompt) {
        return;
      }

      // Get workspace files for context
      const workspaceFiles = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
      
      // Show option to include workspace files
      const includeWorkspace = await vscode.window.showQuickPick([
        { label: 'No, just the prompt', description: 'Use only your prompt' },
        { label: 'Yes, include workspace files', description: 'Include files from your workspace' }
      ], {
        placeHolder: 'Would you like to include workspace files in the context?',
        canPickMany: false
      });

      if (!includeWorkspace) {
        return;
      }

      let fullPrompt = prompt;
      
      if (includeWorkspace.label === 'Yes, include workspace files') {
        // Get selected files
        const selectedFiles = await vscode.window.showQuickPick(
          workspaceFiles.map(file => ({
            label: file.fsPath,
            description: file.fsPath.replace(vscode.workspace.rootPath || '', '').substring(1)
          })),
          {
            placeHolder: 'Select files to include (or none to skip)',
            canPickMany: true
          }
        );

        if (selectedFiles && selectedFiles.length > 0) {
          // Read file contents
          const fileContents: string[] = [];
          for (const file of selectedFiles) {
            try {
              const uri = vscode.Uri.file(file.label);
              const document = await vscode.workspace.openTextDocument(uri);
              fileContents.push(`\n--- File: ${file.label} ---\n${document.getText()}`);
            } catch (error) {
              console.error(`Failed to read file ${file.label}:`, error);
              fileContents.push(`\n--- File: ${file.label} (could not read) ---\n`);
            }
          }

          if (fileContents.length > 0) {
            const contextContent = fileContents.join('\n\n');
            fullPrompt = `${prompt}\n\nContext from workspace files:\n${contextContent}`;
          }
        }
      }

      // Show loading message
      const loading = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      loading.text = '$(loading~spin) Querying Ollama. ..';
      loading.show();

      // Call Ollama API with selected model and full prompt
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: fullPrompt,
          stream: false
        })
      });

      // Hide loading
      loading.dispose();

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      // Properly type the JSON response
      const data = await response.json() as OllamaGenerateResponse;
      
      // Display the response in a new window
      const resultPanel = vscode.window.createWebviewPanel(
        'ollamaResult',
        `Ollama Response - ${selectedModel}`,
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );

      resultPanel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .response { 
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              white-space: pre-wrap;
              font-family: monospace;
            }
            .prompt { 
              background-color: #e8f4f8;
              padding: 15px;
              border-radius: 4px;
              margin-bottom: 20px;
              font-family: monospace;
              font-size: 14px;
            }
            .header { 
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Ollama Response</h2>
            <p><strong>Model:</strong> ${selectedModel}</p>
          </div>
          <div class="prompt">
            <strong>Prompt:</strong><br>${prompt.replace(/\n/g, '<br>')}
          </div>
          <div class="response">
            ${data.response.replace(/\n/g, '<br>')}
          </div>
        </body>
        </html>
      `;
      
    } catch (error) {
      console.error('Ollama chat error:', error);
      vscode.window.showErrorMessage(`Error communicating with Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
