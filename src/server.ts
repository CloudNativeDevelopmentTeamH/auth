import app from './infrastructure/api/index.js';
import config from './infrastructure/utils/config';

app.listen(config.port, () => {
  return console.log(`Express is listening at http://localhost:${config.port}`);
});
