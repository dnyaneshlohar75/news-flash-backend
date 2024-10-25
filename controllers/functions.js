const SummarizerManager = require('node-summarizer').SummarizerManager;

const toSummarizeText = (text) => {
  try {
    if (text != null) {
      const summarizerManager = new SummarizerManager(text, 5);

      let summarizeText = summarizerManager.getSummaryByFrequency().summary;
      return summarizeText;
    }
  } catch (error) {
    return "no summary";
  }

  return "no summary";
};

module.exports = toSummarizeText;
