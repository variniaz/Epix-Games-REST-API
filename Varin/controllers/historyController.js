const { History, User } = require("../models");

module.exports = {
createHistory: async (req, res) => {
  try {
    let { user_id, game_name, hours_played, xp_user } = req.body;
    let user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      res.status(404).json({
        status: "error",
        errors: `user with id ${user_id} is doesn't exist!`,
      });
      return;
    }
    let newHistory = await History.create({
      user_id,
      game_name,
      hours_played,
      xp_user,
    });

    res.status(201).json({
      status: "success",
      message: "succesfully create data",
      data: newHistory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      errors: err,
    });
  }
},

getHistorys: async (req, res) => {
  try {
    let historys = await History.findAll();

    res.status(200).json({
      status: "success",
      message: "succesfully get all data",
      data: historys,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      errors: err,
    });
  }
},

getHistory: async (req, res) => {
  try {
    const history_id = req.params.id;

    let history = await History.findOne({
      where: {
        id: history_id,
      },
      include: "historyOwner",
    });

    if (!history) {
      res.status(404).json({
        status: "error",
        message: "cant find history with id " + history_id,
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "succesfully get detail data",
      data: history,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      errors: err,
    });
  }
},

updateHistory: async (req, res) => {
  try {
    const history_id = req.params.id;
    const { user_id, game_name, hours_played, xp_user } = req.body;

    let query = {
      where: {
        id: history_id,
      },
    };

    let updated = await History.update(
      {
        user_id,
        game_name,
        hours_played,
        xp_user,
      },
      query
    );

    res.status(200).json({
      status: "success",
      message: "succesfully update data",
      data: updated,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      errors: err,
    });
  }
},

deleteHistory: async (req, res) => {
  try {
    const history_id = req.params.id;

    let deleted = await History.destroy({
      where: {
        id: history_id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "succesfully delete data",
      data: deleted,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      errors: err,
    });
  }
}
}
