const { Transform } = require('stream');
const { adlib } = require('adlib');
const template = require('../example-template');

module.exports = async function (req, res) {
  
  // Bookkeeping to ensure valid JSON
  let headerAdded = false;
  const header = '[';
  const footer = ']';

  // Transform to ensure valid JSON
  const formatter = new Transform({
    transform: (chunk, _encoding, callback) => {
      if (!headerAdded) {
        headerAdded = true;
        callback(null, `${header}${JSON.stringify(adlib(template, chunk))}`)
      } else {
        callback(null, `,${JSON.stringify(adlib(template, chunk))}`);
      }
    },
    flush: (callback) => callback(null, footer),
    objectMode: true
  });

  res.set('Content-Type', 'application/json');

  const searchRequest = {
    options: { 
      site: 'adopt-a-highway-programs-1-ma9bretiuzurfyev.hub.arcgis.com',
      fields: 'id,name,description,source'
    }
  };

  req.res.locals.searchRequest = searchRequest;

  try {
    const resultStream = await this.model.pullStream(req);
    resultStream
      .on('error', err => res.status(500).json({ message: err.message }))
      .pipe(formatter)
      .on('error', err => res.status(500).json({ message: err.message }))
      .pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
