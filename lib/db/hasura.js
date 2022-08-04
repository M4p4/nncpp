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
