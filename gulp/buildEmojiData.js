const fs = require('fs');

/**
 * Copy the emoji.json in the emoji-datasource package
 *
 * This strips out lots of data we don't need resulting in a smaller
 * bundle size for our users.
 */
const buildEmojiData = (done) => {
  const emojis = require('emoji-datasource');
  const output = [];

  // We discard all the fields in the JSON except for those below to reduce
  // the file size of the bundle.
  const fields = [
    'name',
    'short_names',
    'category',
    'sort_order',
    'unified',
    'skin_variations',
  ];

  // Values of `unified` for emojis to strip from the bundle.
  // We do this because some clients dont find this appropriate
  // for the workplace.
  const blacklisted = [
    '1F595', // middle finger
  ];

  emojis.forEach((emoji) => {
    if (blacklisted.indexOf(emoji.unified) > -1) {
      return;
    }

    const record = {};
    fields.forEach((field) => {
      if (typeof emoji[field] !== 'undefined') {
        record[field] = emoji[field];
      }
    });
    output.push(record);
  });

  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }

  fs.writeFileSync('./dist/emoji.json', JSON.stringify(output));
  done();
};

module.exports = buildEmojiData;
