// Here we can define the remote entry points for our remotes
const remoteMap = {
  remote: `${process.env.ANALYTICS_REMOTE_URL}/_next/static/__LOCATION__/remoteEntry.js`,
};

module.exports = remoteMap;
