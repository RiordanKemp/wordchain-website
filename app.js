
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

let openingStr = `Welcome to NAME PENDING (word chain??)!`;
let difficultyDetails = "\nHard Mode requires child words to be +-1 in length relative to their parent.";
let exitMessage = "Thanks for playing! Exiting now...";
let reset_message = "Resetting the round now..";
let word_doesnt_exist_error = "This word does not exist.";

var difficultyOn = false;

let directory_str = "dict_directory";

let alphabet_dict = {};
let words_dict = {};
let numb_dict = {};
let starting_words_set = new Set();
let already_used_words_set = new Set();
let valid_letters_dict = {};

//Dictionary CSV file: https://www.bragitoff.com/2016/03/english-dictionary-in-csv-format/

function normalMode(normalbutton){
    let hardbutton = document.getElementById("hardButton");
    let diffdesc = document.getElementById("difficultydesc");
    let diffexpl = document.getElementById("difficultyexpl");

    normalbutton.style.display = "none";
    hardbutton.style.display = "none";
    diffdesc.style.visibility = "hidden";
    diffexpl.innerHTML = "You chose to play on NORMAL difficulty.";
    document.getElementById("difficultyreader").innerHTML = "Difficulty: <font color=green><b>NORMAL</b></font>";

}

function hardMode(hardbutton){
    let normalbutton = document.getElementById("normalButton");
    let diffdesc = document.getElementById("difficultydesc");
    let diffexpl = document.getElementById("difficultyexpl");
    document.getElementById("difficultyreader").innerHTML = "Difficulty: <font color=red><b>HARD</b></font>";
    normalbutton.style.display = "none";
    hardbutton.style.display = "none";
    diffdesc.style.visibility = "hidden";
    diffexpl.innerHTML = "You chose to play on HARD difficulty.";

    document.getElementById("difficultyreader").innerHTML = window.difficultyOn;

    difficultyOn = true;

}

function difficulty() {
    let hardmodeBool = false;
    let input_difficulty = readlineSync.question("\nDo you want to play Hard Mode? (Y = Yes, 0 = Details, Other = No)");

    while (input_difficulty === "0") {
        console.log(difficultyDetails);
        input_difficulty = readlineSync.question("\nDo you want to play Hard Mode? (Y = Yes, 0 = Details, Other = No)");
    }

    if (input_difficulty.toLowerCase() === "y") {
        hardmodeBool = true;
        console.log(hardmodeEnabled);
    }

    return hardmodeBool;
}

function open_files() {
    let readers_list = [];

    let files = fs.readdirSync(directory_str);
    for (let file of files) {
        let filename = file;
        let file_path = path.join(directory_str, filename);
        let file_content = fs.readFileSync(file_path, 'utf8');
        let csv_reader = csv.parse(file_content, {
            delimiter: ',',
            skip_empty_lines: true
        });
        readers_list.push(csv_reader);
    }

    return readers_list;
}

function organize_dictionary(filereader_list) {
    for (let reader of filereader_list) {
        let line_count = 0;
        let letter_key;
        
        for (let line of reader) {
            line_count += 1;

            if (line_count === 1) {
                let line_str = line.join(' ');
                letter_key = line_str[0];
                //console.log("line str:", line_str, "line:", line);
                //console.log("line_str[0]:", line_str[0]);
                //console.log("letter key:", letter_key);
            }

            if (line_count % 2 === 1 && line_count !== 1) {
                let line_str = line.join(' ');
                let split_line = line_str.split(/\s+/);
                let word_key = split_line[0];
                word_key = word_key.replace(/[^a-zA-Z0-9]/g, '');
                let word_def = split_line.slice(1).join(' ');
                word_addition(word_key, word_def, letter_key);
            }
        }
    }
}

function word_addition(word_key, word_def, letter_key) {
    if (word_key.length < 3) {
        return;
    }

    if (!(letter_key in alphabet_dict)) {
        alphabet_dict[letter_key] = words_dict;
    }

    if (!(word_key in alphabet_dict[letter_key])) {
        alphabet_dict[letter_key][word_key] = word_def;
    } else {
        let marked_def = "1581199358571" + word_def;
        alphabet_dict[letter_key][word_key] += marked_def;
        numb_dict[word_key] = 1;
    }

    if (word_key.length > 8) {
        starting_words_set.add(word_key);
    }
}

function first_word(parent_word, difficultyOn) {
    console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~\nINITIAL WORD\nParent: ${parent_word}`);
    let input_str = readlineSync.question("\nConstruct a word using only letters from the Parent Word, or 0 + ENTER to reset the round:");

    while (input_str !== "0") {
        input_str = input_str.charAt(0).toUpperCase() + input_str.slice(1).toLowerCase();

        if (input_str === "0") {
            break;
        }

        if (!(input_str in words_dict)) {
            console.log(word_doesnt_exist_error);
            input_str = readlineSync.question("\nConstruct a word using only letters from the Parent Word, or 0 + ENTER to reset the round:");
            continue;
        }

        if (already_used_words_set.has(input_str)) {
            console.log("You already used this word.");
            input_str = readlineSync.question("\nConstruct a word using only letters from the Parent Word, or 0 + ENTER to reset the round:");
            continue;
        }

        let letter_use_dict = {};
        let character_limit_exceeded = false;
        let invalid_character_used = false;
        let overused_letter = "";
        let invalid_character = "";

        for (let letter in valid_letters_dict) {
            letter_use_dict[letter] = valid_letters_dict[letter];
        }

        for (let character of input_str) {
            character = character.toLowerCase();
            if (!(character in valid_letters_dict)) {
                invalid_character_used = true;
                invalid_character = character;
                break;
            }
            letter_use_dict[character] -= 1;
            if (letter_use_dict[character] < 0) {
                character_limit_exceeded = true;
                overused_letter = character;
            }
        }

        if (invalid_character) {
            console.log(`You used letter ${invalid_character}, which is not part of the parent word.`);
            input_str = readlineSync.question("\nConstruct a word using only letters from the Parent Word, or 0 + ENTER to reset the round:");
            continue;
        }

        if (character_limit_exceeded) {
            let overuse_count = valid_letters_dict[overused_letter] - letter_use_dict[overused_letter];
            console.log(`You used the letter ${overused_letter}, but the maximum is ${overuse_count}.`);
            input_str = readlineSync.question("\nConstruct a word using only letters from the Parent Word, or 0 + ENTER to reset the round:");
            continue;
        }

        let input_length = input_str.length;
        let parent_length = parent_word.length;
        let different_length = parent_length - input_length;
        if ((different_length > 1 || different_length < -1) && difficultyOn) {
            console.log(`This word should have ${parent_length - 1} to ${parent_length + 1} characters, but it has ${input_length} instead.`);
            input_str = readlineSync.question("\nConstruct a word using only letters from the Parent Word, or 0 + ENTER to reset the round:");
            continue;
        }

        already_used_words_set.add(input_str);
        return input_str;
    }

    return 0;
}

function child_word(parent_word, previous_word, difficultyOn) {
    let starting_letter = previous_word[previous_word.length - 1].toUpperCase();
    console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~\nCHILD WORD\nParent: ${parent_word}\nPREVIOUS: ${previous_word}`);
    let input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);

    while (input_str !== "0") {
        input_str = input_str.charAt(0).toUpperCase() + input_str.slice(1).toLowerCase();

        if (input_str === "0") {
            break;
        }

        if (!(input_str in words_dict)) {
            console.log(word_doesnt_exist_error);
            input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);
            continue;
        }

        if (already_used_words_set.has(input_str)) {
            console.log("You already used this word.");
            input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);
            continue;
        }

        let letter_use_dict = {};
        let character_limit_exceeded = false;
        let invalid_character_used = false;
        let overused_letter = "";
        let invalid_character = "";

        for (let letter in valid_letters_dict) {
            letter_use_dict[letter] = valid_letters_dict[letter];
        }

        for (let character of input_str) {
            character = character.toLowerCase();
            if (!(character in valid_letters_dict)) {
                invalid_character_used = true;
                invalid_character = character;
                break;
            }
            letter_use_dict[character] -= 1;
            if (letter_use_dict[character] < 0) {
                character_limit_exceeded = true;
                overused_letter = character;
            }
        }

        if (invalid_character) {
            console.log(`You used letter ${invalid_character}, which is not part of the parent word.`);
            input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);
            continue;
        }

        if (character_limit_exceeded) {
            let overuse_count = valid_letters_dict[overused_letter] - letter_use_dict[overused_letter];
            console.log(`You used the letter ${overused_letter}, but the maximum is ${overuse_count}.`);
            input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);
            continue;
        }

        let input_length = input_str.length;
        let parent_length = parent_word.length;
        let different_length = parent_length - input_length;
        if ((different_length > 1 || different_length < -1) && difficultyOn) {
            console.log(`This word should have ${parent_length - 1} to ${parent_length + 1} characters, but it has ${input_length} instead.`);
            input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);
            continue;
        }

        if (input_str[0] !== starting_letter) {
            console.log(`This word should start with ${starting_letter}, but it starts with ${input_str[0]} instead.`);
            input_str = readlineSync.question(`\nConstruct a word using only letters from the Parent Word and starting with ${starting_letter}, or 0 + ENTER to end the round:`);
            continue;
        }

        already_used_words_set.add(input_str);

        return ["1", input_str];
    }
    return ["0", input_str];
}

function main() {
    console.log(openingStr);
    let input_play = readlineSync.question("\nDo you want to play a game of NAME PENDING? (yes/no):");
    if (input_play.toLowerCase() === "no") {
        console.log(exitMessage);
        return;
    }

    while (input_play.toLowerCase() !== "no") {
        starting_words_set.clear();
        Object.keys(valid_letters_dict).forEach(key => delete valid_letters_dict[key]);
        already_used_words_set.clear();

        Object.keys(alphabet_dict).forEach(key => delete alphabet_dict[key]);
        Object.keys(words_dict).forEach(key => delete words_dict[key]);
        Object.keys(numb_dict).forEach(key => delete numb_dict[key]);

        difficultyOn = difficulty();

        let readers_list = open_files();

        organize_dictionary(readers_list);

        let starting_words_array = Array.from(starting_words_set);
        let parent_word = starting_words_array[Math.floor(Math.random() * starting_words_array.length)];

        while (true) {
            let input_str = readlineSync.question("You may choose a Parent Word for this round.  Press ENTER to choose randomly instead:");

            if (input_str === "") {
                break;
            }

            if (!(input_str.charAt(0).toUpperCase() + input_str.slice(1).toLowerCase() in words_dict)) {
                console.log(word_doesnt_exist_error);
                continue;
            } else {
                parent_word = input_str.charAt(0).toUpperCase() + input_str.slice(1).toLowerCase();
                break;
            }
        }

        console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~\nThis round's PARENT WORD will be: ${parent_word}.`);
        for (let character of parent_word) {
            character = character.toLowerCase();
            if (!(character in valid_letters_dict)) {
                valid_letters_dict[character] = 0;
            }
            valid_letters_dict[character] += 1;
        }

        already_used_words_set.add(parent_word);

        let letter = parent_word[0];
        let definition = alphabet_dict[letter][parent_word];

        if (parent_word in numb_dict) {
            definition = definition.split('1581199358571');
            definition = '\n ' + definition.join('\n ');
            console.log("This word has multiple definitions:\n", definition);
        } else {
            console.log("This word has one definition:\n", definition);
        }

        readlineSync.question("\nPress ENTER to continue.");

        let initial_word = first_word(parent_word, difficultyOn);
        if (initial_word === 0) {
            console.log(reset_message);
            continue;
        }

        let word_chain = [];
        let word_chain_length = 1;
        word_chain.push(initial_word);

        let [run_int, prior_word] = child_word(parent_word, initial_word, difficultyOn);
        if (run_int === "1") {
            word_chain_length += 1;
            word_chain.push(prior_word);
        }

        while (run_int === "1") {
            [run_int, prior_word] = child_word(parent_word, prior_word, difficultyOn);
            if (run_int === "1") {
                word_chain_length += 1;
                word_chain.push(prior_word);
            }
        }

        let word_chain_str = word_chain.join("---");
        console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~\nThe Parent Word: ${parent_word}\nYour Word Chain: ${word_chain_str}\nLength: ${word_chain.length}`);

        input_play = readlineSync.question("\nDo you want to play another round of NAME PENDING? (yes/no):");
        if (input_play.toLowerCase() === "no") {
            console.log(exitMessage);
            return;
        }
    }
}