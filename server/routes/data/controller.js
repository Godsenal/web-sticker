const { updateField } = require('../../utils/database');

exports.update_post = (req, res) => {
  const { username } = req.decoded;
  const { field, value } = req.body;
  
  const success = () => res.json({
    success: true,
  });
  const error = (err) => res.status(503).json({
    error: err.message,
  });

  updateField(username, field, value)
    .then(success)
    .catch(error);
}
exports.update_sticker 