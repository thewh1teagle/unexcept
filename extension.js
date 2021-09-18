const vscode = require('vscode');

/**
 * Folds regions of default level and all their inner regions up to level 7.
 * @param resourceUri
 */

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'unexcept.activate',
			foldAllCodeBlocks
		),
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				foldAllCodeBlocks();
			}
		}),
		vscode.workspace.onDidSaveTextDocument((editor) => {
			if (editor) {
				foldAllCodeBlocks();
			}
		}),
	);
}

function linesToCollapse(content) {
	var lines = [];
	lineCounter = 0
	for (let line of content.split("\n")){
		if (line.includes("catch") || line.includes("except") || line.includes("err != nil")){
			lines.push(lineCounter);
		}
		lineCounter++;
	}
	return lines;
}

function foldAllCodeBlocks() {
	if (vscode.window.activeTextEditor) {
		var lineNumbers = linesToCollapse(vscode.window.activeTextEditor.document.getText())
		for (let lineNumber of lineNumbers){
			vscode.commands.executeCommand('editor.fold', {selectionLines: [lineNumber], direction: "down"});
		}
	}
}

exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};