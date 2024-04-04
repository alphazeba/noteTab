export function searchFilterFunction(tab, searchTerm) {
    return tab.title.toLowerCase().includes(searchTerm.toLowerCase());
}