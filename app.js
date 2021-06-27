const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

//changed directory name to templates because that is whwer main.html lives
const OUTPUT_DIR = path.resolve(__dirname, "templates");
const outputPath = path.join(OUTPUT_DIR, "main.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

//empty array to be filled with team member info
let teamMembers = [];
//This is to allow only one manager
let addManager = true;

//keep questions as variable to call and manipulate based on role later
const questions = {
    //manager questions
    Manager: [
        {
            type: 'input',
            name: 'name',
            message: "What is the manager's name?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter a name for the manager." }
            },
        },

        {
            type: 'input',
            name: 'id',
            message: "What is the manager's ID?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an ID for the manager." }
            },
        },

        {
            type: 'input',
            name: 'email',
            message: "What is the manager's email?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an email for the manager." }
            },
        },

        {
            type: 'input',
            name: 'officeNumber',
            message: "What is the manager's office number?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an office number for the manager." }
            },
        },

        {
            type: 'list',
            name: 'addTeam',
            message: "Would you like to add another employee?",
            choices: ["yes", "no"]
        },
    ],

    //intern questions with additional school question
    Intern: [
        {
            type: 'input',
            name: 'name',
            message: "What is the intern's name?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter a name for the intern." }
            },
        },

        {
            type: 'input',
            name: 'id',
            message: "What is the intern's ID?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an ID for the intern." }
            },
        },

        {
            type: 'input',
            name: 'email',
            message: "What is the intern's email?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an email for the intern." }
            },
        },

        {
            type: 'input',
            name: 'school',
            message: "What school does the intern attend?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter a school/university for the intern." }
            },
        },

        {
            type: 'list',
            name: 'addTeam',
            message: "Would you like to add another employee?",
            choices: ["yes", "no"]
        },
    ],

    //engineer questions with additional github question
    Engineer: [
        {
            type: 'input',
            name: 'name',
            message: "What is the engineer's name?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter a name for the engineer." }
            },
        },

        {
            type: 'input',
            name: 'id',
            message: "What is the engineer's ID?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an ID for the engineer." }
            },
        },

        {
            type: 'input',
            name: 'email',
            message: "What is the engineer's email?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter an email for the engineer." }
            },
        },

        {
            type: 'input',
            name: 'github',
            message: "What is the engineer's GitHub username?",
            validate: (value) => {
                if (value) {
                    return true;
                } else { return "You must enter a GitHub username for the engineer." }
            },
        },

        {
            type: 'list',
            name: 'addTeam',
            message: "Would you like to add another employee?",
            choices: ["yes", "no"]
        },
    ],
}

//start up question to confirm role
const memberSelect = [
    {
        type: 'list',
        name: 'memberSelect',
        message: 'Please select the role of the employee you wish to submit information for.',
        choices: ["Manager", "Engineer", "Intern"],
    }
];

//main function to put together team
function addMember() {
    inquirer.prompt(memberSelect)
        .then(answer => {
            // console.log(answer.memberType);

            if (answer.memberSelect === "Manager") {
                if (addManager) {
                    inquirer.prompt(questions.Manager)
                        .then(answer => {
                            //save employee info
                            const manager = new Manager
                                (
                                    answer.name,
                                    answer.id,
                                    answer.email,
                                    answer.officeNumber
                                );

                            //add info to team array if manager doesn't exist
                            teamMembers.push(manager);
                            addManager = false;
                            if (answer.addTeam === "yes") {
                                addMember();
                            } else {
                                generateDoc();
                            }
                        });
                } else {
                    //only 1 manager
                    console.log("There is a manager already!")
                    addMember();
                }


            } else if (answer.memberSelect === "Engineer") {
                inquirer.prompt(questions.Engineer)
                    .then(answer => {
                        //save ee info
                        const engineer = new Engineer
                            (
                                answer.name,
                                answer.id,
                                answer.email,
                                answer.github
                            );
                        //add info to team array
                        teamMembers.push(engineer);
                        if (answer.addTeam === "yes") {
                            addMember();
                        } else {
                            generateDoc();
                        };
                    });

            } else if (answer.memberSelect === "Intern") {
                inquirer.prompt(questions.Intern)
                    .then(answer => {
                        //save ee info
                        const intern = new Intern
                            (
                                answer.name,
                                answer.id,
                                answer.email,
                                answer.school
                            );
                        //add info to team array
                        teamMembers.push(intern);
                        if (answer.addTeam === "yes") {
                            addMember();
                        } else {
                            generateDoc();
                        };
                    });
            };
        });
};


addMember();

function generateDoc() {
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
    process.exit(0);
}