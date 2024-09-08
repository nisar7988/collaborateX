const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const socketidToStream = [];
const users = {};
const socketToRoom = {};
module.exports = {
  emailToSocketIdMap,
  socketidToEmailMap,
  socketidToStream,
  users,
  socketToRoom
};
