const { Pool } = require("pg");

const checkSameUser = async (pool, user_email, id) => {
  const checkCommand =
    "select \
        case when user_email = $1 then 1 else 0 end as same_user\
        from complaints\
        where id = $2;";
  const values = [user_email, id];
  const query = await pool.query(checkCommand, values);
  const isSameUser = Boolean(query.rows[0].same_user);
  return isSameUser;
};

module.exports = { checkSameUser };
