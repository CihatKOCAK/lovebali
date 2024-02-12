// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

const settings = require("./baliconfig.json");
const startTexts = require("./sentences/texts.json");
const motivationsTexts = require("./sentences/motivation.json");
const deletingTexts = require("./sentences/deletingCode.json");
const homorTexts = require("./sentences/humor.json");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function activate(context) {
  console.log('Congratulations, your extension "motivation" is now active!');

  let disposableStart = vscode.commands.registerCommand(
    "loveBali.start",
    function () {
      vscode.window
        .showInformationMessage(
          startTexts[settings.language]["startText"],
          startTexts[settings.language]["letsStart"]
        )
        .then((selection) => {
          if (selection === startTexts[settings.language]["letsStart"]) {
            vscode.commands.executeCommand("open.more.info");
          }
        });
    }
  );

  let disposableMoreInfo = vscode.commands.registerCommand(
    "open.more.info",
    function () {
      // import moreInfo.json file
      const moreInfoTexts = require("./sentences/texts.json");

      vscode.window
        .showInformationMessage(
          moreInfoTexts[settings.language]["moreInfoText"],
          moreInfoTexts[settings.language]["letsGo"]
        )
        .then((selection) => {
          if (selection === moreInfoTexts[settings.language]["letsGo"]) {
            vscode.commands.executeCommand("loveBali.end");
          }
        });
    }
  );

  let disposableEnd = vscode.commands.registerCommand(
    "loveBali.end",
    function () {
      // import end.json file
      const endTexts = require("./sentences/texts.json");

      vscode.window.showInformationMessage(
        endTexts[settings.language]["endText"]
      );
    }
  );

  let timer_Thinker;
  let timer2_AfkControl;
  let timer3_Humor;
  let backspaceCounter = 0;

  // Listen for text changes
  vscode.workspace.onDidChangeTextDocument(() => {
    console.log("Text changed!");
    // Reset the timer every time text changes
    clearTimeout(timer_Thinker);
    clearTimeout(timer2_AfkControl);
    // Start the timer for 2 minutes
    timer_Thinker = setTimeout(() => {
      // get last object key
      let motivationsTextsLength = Object.keys(
        motivationsTexts[settings.language]
      ).length;
      vscode.window.showInformationMessage(
        motivationsTexts[settings.language][
          getRandomInt(motivationsTextsLength)
        ]
      );
    }, settings["noCodingMessageTimeMin"] * 60 * 1000);

    timer2_AfkControl = setTimeout(() => {
      vscode.window.showInformationMessage(
        startTexts[settings.language]["afk"]
      );
    }, settings["noCodingMessageTimeMax"] * 60 * 1000);
  });

  // Listen for backspace key
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.contentChanges[0].text === "") {
      // get last object key
      backspaceCounter++;
      if (backspaceCounter > settings["deletingCodeMessageTime"]) {
        let deletingTextsLength = Object.keys(
          deletingTexts[settings.language]
        ).length;
        let text =
          deletingTexts[settings.language][getRandomInt(deletingTextsLength)];
        console.log(text);
        vscode.window.showInformationMessage(text);
      }
	  backspaceCounter = 0;
    }
  });

  timer3_Humor = setTimeout(() => {
	let humorTextsLength = Object.keys(homorTexts[settings.language]).length;
	vscode.window.showInformationMessage(
	  homorTexts[settings.language][getRandomInt(humorTextsLength)]
	);
  }, settings["humorMessageTime"] * 60 * 1000);

  context.subscriptions.push(disposableStart);
  context.subscriptions.push(disposableMoreInfo);
  context.subscriptions.push(disposableEnd);
}

// This method is called when your extension is deactivated
function deactivate() {
  console.log("Your extension 'motivation' is now deactivated!");

  //say goodbye
  const goodbyeTexts = require("./sentences/texts.json");
  vscode.window.showInformationMessage(
    goodbyeTexts[settings.language]["goodbyeText"]
  );
}

module.exports = {
  activate,
  deactivate,
};
