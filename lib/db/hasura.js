async function query(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function updateState(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(
    _set: {watched: $watched, favourited: $favourited}, 
    where: {
      userId: {_eq: $userId}, 
      videoId: {_eq: $videoId}
    }) {
    returning {
      favourited,
      userId,
      watched,
      videoId
    }
  }
}
`;
  try {
    const res = await query(
      operationsDoc,
      'updateStats',
      { favourited, userId, watched, videoId },
      token
    );
    return res;
  } catch (err) {
    console.log(err.message || 'failed to fetch data from db');
  }
}

export async function addState(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
  mutation addState($favourited: Int!, $userId: 
  String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {favourited: $favourited, 
    userId: $userId, watched: $watched, videoId: $videoId}
    ) {
      favourited
      id
      userId
    }
  }
`;

  try {
    const res = await query(
      operationsDoc,
      'addState',
      { favourited, userId, watched, videoId },
      token
    );
    return res;
  } catch (err) {
    console.log(err.message || 'failed to fetch data from db');
  }
}

export async function VideoIdForUserExists(token, userId, videoId) {
  const operationsDoc = `
  query VideoIdForUserExists($userId: String!, $videoId: String!) {
    stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
      id
      userId
      videoId
      favourited
      watched
    }
  }
`;
  try {
    const res = await query(
      operationsDoc,
      'VideoIdForUserExists',
      { userId, videoId },
      token
    );
    return res?.data?.stats; // true if exists false when not exists
  } catch (err) {
    console.log(err.message || 'failed to fetch data from db');
  }
  return false;
}

export const userExists = async (token, issuer) => {
  const operationsDoc = `
  query userExists($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
    }
  }`;

  try {
    const res = await query(operationsDoc, 'userExists', { issuer }, token);
    return res?.data?.users?.length === 0 ? false : true;
  } catch (err) {
    console.log(err.message || 'failed to fetch data from db');
  }
  return false;
};

export const createUser = async (token, metaData) => {
  const operationsDoc = `
  mutation createUser($issuer: String!,$publicAddress: String!,$email: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;
  try {
    const { issuer, publicAddress, email } = metaData;
    const res = await query(
      operationsDoc,
      'createUser',
      { issuer, publicAddress, email },
      token
    );
    return res;
  } catch (err) {
    console.log(err.message || 'failed to fetch data from db');
  }
};

export const getWatchedVideos = async (issuer, token) => {
  const operationsDoc = `
  query getWatchedVideos($issuer: String) {
    stats(where: {watched: {_eq: true}, userId: {_eq: $issuer}}) {
      videoId
    }
  }
`;
  try {
    const res = await query(
      operationsDoc,
      'getWatchedVideos',
      { issuer },
      token
    );
    return res?.data?.stats;
  } catch (err) {
    console.log(err.message || 'failed to fetch data from db');
  }
};
