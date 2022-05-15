// This file is fake code for the message queue client. Actually it maybe provided by the 3rd party in real project.

import axios from 'axios';

export const send = async (data) => {
  return axios.post('message-queue.url');
};
