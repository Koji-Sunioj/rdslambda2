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

module.exports = { checkSameUser };
