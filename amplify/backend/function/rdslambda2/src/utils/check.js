const { verifyToken } = require("./token");

const checkSameUser = async (pool, user_email, id) => {
  const checkCommand =
    "select \
        case when user_email = $1 then 'same' else 'different' end as same_user\
        from complaints\
        where id = $2;";
  const values = [user_email, id];
  const query = await pool.query(checkCommand, values);
  const { same_user } = query.rows[0];
  return same_user;
};

const checkRequester = async (headers, id, pool) => {
  const { user_email, type } = await verifyToken(headers);
  const isSameUser = await checkSameUser(pool, user_email, id);
  return `${type} ${isSameUser}`;
};

module.exports = { checkSameUser, checkRequester };
