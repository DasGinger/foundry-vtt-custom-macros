// all summonable beasts must be in a folder named "Summons" in the actor directory
const summonsFolderName = 'Summons';
let summonsFolder = game.folders.getName(summonsFolderName);

try{
    if(canvas.tokens.controlled.length == 0){
        throw "You must select your character's token before using this macro.";
    } else {
        let target = canvas.tokens.controlled[0]
        let currentFormActorId = target.actor.data._id
        let currentFormActor = game.actors.get(currentFormActorId);
        let currentActorLevel = currentFormActor.data.data.details.level;
        let currentActorProfBonus = currentFormActor.data.data.prof;
        let updates = null;
        
        // Construct HTML for a drop down form that will include all "Summons" as options
        let selectSummons = '<form><div class="form-group"><label>Choose the beast: </label><select id="summonSelection">';
        summonsFolder.content.forEach((summon) => {
            let optSummon = '<option value="' + summon.data.name + '">' + summon.data.name + '</option>';
            selectSummons += optSummon;
        });
        selectSummons += '</select></div></form>'
        
        let t = new Dialog({
            title: "Choose your summon",
            content: selectSummons,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Summon!",
                    callback: () => {
                        let actorNewFormName = $('#summonSelection').find(":selected").val();
                        console.log(`${actorNewFormName} as been chosen!`);
                        
                        if(actorNewFormName == 'Wildfire Spirit') {
                            updates = {
                                'token': {"displayName": CONST.TOKEN_DISPLAY_MODES.HOVER},
                                'actor': {
                                    'data.attributes.hp' : {value: 5+(currentActorLevel*5), max: 5+(currentActorLevel*5)},
                                    'data.prof': currentActorProfBonus
                                }
                            }
                        }
        
                        warpgate.spawn(actorNewFormName, updates);
                    }
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                    callback: () => console.log("Summon cancelled")
                }
            },
            default: "two",
            render: html => console.log("Awaiting summon choice..."),
            close: html => console.log("")
        });
        t.render(true);
    }
} catch (e) {
    console.log(e);
}
