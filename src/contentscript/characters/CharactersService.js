import $ from "jquery";
import CharacterData from "../../data/CharacterData";
import CharacterFolderData from "../../data/CharacterFolderData";

class CharactersService {
    /**
     * Parse characters from my characters page and campaign page as a Array of CharacterData.
     */
    static parseCharacters(): CharacterData[] {
        const characters = [];
        $(".ddb-campaigns-character-card-wrapper").each((index, charWrapperEl) => {
            const jqcharWrapperEl = $(charWrapperEl);
            const name = jqcharWrapperEl.find(".ddb-campaigns-character-card-header-upper-character-info-primary").text();
            const [lvl, race, classes] = jqcharWrapperEl.find(".ddb-campaigns-character-card-header-upper-character-info-secondary").first().text().split("|");
            const viewUrl = jqcharWrapperEl.find(".ddb-campaigns-character-card-footer-links-item-view").attr("href");
            const [, , , , id] = viewUrl.split("/");

            // workaround for modal links - for some reason the stop to work when the char elements are moved on DOM
            jqcharWrapperEl.find("a.modal-link").attr("onclick", "Cobalt.Forms.handleModalLinks.apply(this, [event])");

            characters.push(new CharacterData(id, name, lvl, race, classes, jqcharWrapperEl[0]));
        });
        return characters;
    }

    /**
     * Return an array of characters that are not on folders.
     * @param {CharacterFoldersData} foldersData 
     * @param {CharacterData[]} allCharacters 
     */
    static charactersNotOnFolders(foldersData: CharacterFoldersData, allCharacters: CharacterData[]): CharacterData[] {
        if (!allCharacters || allCharacters === 0) {
            return [];
        }
        let idsOfCharsOnFolders = [];
        const folders = foldersData ? foldersData.folders : [];
        folders.forEach(folder => {
            idsOfCharsOnFolders = idsOfCharsOnFolders.concat(folder.characterIds);
        });
        return allCharacters.filter(character => idsOfCharsOnFolders.indexOf(character.id) === -1);
    }

    static moveFolder(folder: CharacterFolderData, delta: number, folders: CharacterFolderData[]) {
        const idx = folders.indexOf(folder);
        folders.splice(idx, 1);
        folders.splice(idx + delta, 0, folder);
    }
}

export default CharactersService;