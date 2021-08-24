// setting variables
const getTable = (tableName => {
    return game.tables.entities.find(t => t.name === tableName);
});

const getJournal = (journalName => {
    return game.journal.entities.find(j => j.name === journalName);
});

const journalToString = (journal => {
    return `@JournalEntry[${journal.id}]{${journal.name}}`;
});

const writeChatMessage = (msgObj => {
    let msg = `The party has been traveling for ${msgObj.daysTraveled} days...\n\n`
              + `${msgObj.marchingOrder}\n---\n`
              + `${msgObj.lighting}\n---\n`;
    let footer = '';
    
    if(msgObj.encounterHappens){
        if(msgObj.terrainEncounter != null){
            msg += `${msgObj.terrainEncounter}\n---\n`;
            footer += ` | ${msgObj.terrainLink} | `;
        }
        if(msgObj.creatureEncounter != null){
            msg += `${msgObj.creatureEncounter}\n---\n`;
            footer += ` | ${msgObj.creatureLink} | `;
        }
        msg += ``
    } else {
        msg += 'The group is met with no encounters.';
    }
    return msg += footer;
});

let daysTraveled = new Roll(`1d6`).roll().total + 1;
let encounterMarchingOrder = getTable('Ch02-Encounter-Setup-Space-Marching-Order').roll().results[0].text;
let encounterLighting = getTable('Ch02-Encounter-Setup-Illumination').roll().results[0].text;
let terrainTable = getTable('Ch02-RE-Terrain-Types');
let creatureTable = getTable('Ch02-CE-Creature-Types');
let chatData = {
    content: '',
    whisper: game.users.entities.filter(u => u.isGM).map(u => u._id)
  };

let output = {
    daysTraveled: daysTraveled,
    encounterHappens: false,
    marchingOrder: encounterMarchingOrder,
    lighting: encounterLighting,
    terrainEncounter: null,
    creatureEncounter: null,
    terrainLink: null,
    creatureLink: null
}

// roll to check for wandering monster
let result = new Roll(`1d7`).roll().total;

console.log(`ROLL: ${result}`);

if(result == 1 || result == 2) {
    // terrain encounter
    let terrainEncounterJournal = getJournal(terrainTable.roll().results[0].text);
    console.log(terrainEncounterJournal);
    output.encounterHappens = true;
    output.terrainEncounter = terrainEncounterJournal.data.content;
    output.terrainLink = journalToString(terrainEncounterJournal);
} else if(result == 3 || result == 4) {
    // creature encounter
    let creatureEncounterJournal = getJournal(creatureTable.roll().results[0].text);
    console.log(creatureEncounterJournal);
    output.encounterHappens = true;
    output.creatureEncounter = creatureEncounterJournal.data.content;
    output.creatureLink = journalToString(creatureEncounterJournal);
} else if(result >= 5 && result <= 7) {
    // terrain and creature encounter
    let terrainEncounterJournal = getJournal(terrainTable.roll().results[0].text);
    console.log(terrainEncounterJournal);
    output.encounterHappens = true;
    output.terrainEncounter = terrainEncounterJournal.data.content;
    output.terrainLink = journalToString(terrainEncounterJournal);
    let creatureEncounterJournal = getJournal(creatureTable.roll().results[0].text);
    console.log(creatureEncounterJournal);
    output.encounterHappens = true;
    output.creatureEncounter = creatureEncounterJournal.data.content;
    output.creatureLink = journalToString(creatureEncounterJournal);
} else {
    console.log(result);
}

chatData.content += writeChatMessage(output);
ChatMessage.create(chatData, {});