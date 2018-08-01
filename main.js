#!/usr/bin/env node --harmony

var program = require("commander");

var fs = require("fs");
var path = require("path");

function printCurrentProfile() {
  fs.readFile(path.resolve(__dirname, "main.json"), function(err, data) {
    var jsonFile = JSON.parse(data);
    var currentProfile = jsonFile.profiles[jsonFile.currentProfile].fileName;
    fs.readFile(path.resolve(__dirname, currentProfile), function(err, data) {
      var ants = data.toString().split("[break]");
      var ant = ants[Math.floor(Math.random() * ants.length)];
      console.log(ant);
    });
  });
}

function printFeedback() {
  fs.readFile(path.resolve(__dirname, "feedback.txt"), function(err, data) {
    var feedbacks = data.toString().split("[break]");
    var feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    console.log(feedback);
  });
}

function setCurrentProfile(file) {
  fs.readFile(
    path.resolve(__dirname, "main.json"),
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        obj = JSON.parse(data); //now it an object
        obj.currentProfile = file; //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(
          path.resolve(__dirname, "main.json"),
          json,
          "utf8",
          function writeFileCallback(err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully swapped profile");
            }
          }
        ); // write it back
      }
    }
  );
}

function list() {
  fs.readFile(
    path.resolve(__dirname, "main.json"),
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Current Profile " + JSON.parse(data).currentProfile);
        console.log("Profiles " + JSON.stringify(JSON.parse(data).profiles));
      }
    }
  );
}
function logo() {
  fs.readFile(path.resolve(__dirname, "imanant.txt"), function(err, data) {
    var logo = data.toString();
    console.log(logo);
    console.log("1.8.0");
  });
}

program.command("print").action(function() {
  printCurrentProfile();
});

program
  .arguments("<pathToFile>")
  .command("add <pathToFile>")
  .description("Adds a file to the profiles")
  .action(function(pathToFile) {
    console.log("Add a file");
  });

program
  .command("set <file>")
  .description("Sets the file to the profiles")
  .option("-a, --all", "List all files and folders")
  .option("-l, --long", "")
  .action(function(file) {
    setCurrentProfile(file);
  });

program
  .command("list")
  .description("List avaiable profiles")
  .action(function() {
    list();
  });
  program
  .command("feedback")
  .description("Allows users to give feedback")
  .action(function() {
    printFeedback();
  });
program.on("command:*", function() {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});
program.option("-v, --Version", "Prints out the version number");

program.parse(process.argv);

if (program.Version) {
  logo();
}

if (program.args.length < 1 && !program.Version) {
  printCurrentProfile();
}
