/*
  Detects whether a pasted entry is a DOI or a plain URL,
  and builds the link that the search button should open.
*/

const SEARCH = {
  // Matches DOIs like "10.1038/s41586-020-2649-2"
  // also handles ones pasted as a full doi.org URL
  DOI_REGEX: /^10\.\d{4,9}\/\S+$/i,

  detectType(rawValue) {
    const value = rawValue.trim();

    // Pasted as a doi.org link
    const doiUrlMatch = value.match(/doi\.org\/(10\.\S+)/i);
    if (doiUrlMatch) {
      return { type: "doi", value: doiUrlMatch[1] };
    }

    if (this.DOI_REGEX.test(value)) {
      return { type: "doi", value: value };
    }

    // Otherwise treat as a plain link; add https:// if missing
    let url = value;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    return { type: "link", value: url };
  },

  // The URL the "Search" button should open
  getOpenUrl(entry) {
    if (entry.type === "doi") {
      return "https://doi.org/" + entry.value;
    }
    return entry.value;
  },
};
