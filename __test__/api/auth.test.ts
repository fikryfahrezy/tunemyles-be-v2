import fs from 'fs';
import sequelize from '../../src/databases/sequelize';
import { getUser, updateUser, createUserImg } from '../../src/api/repositories/UserRepository';
import {
  userRegistration,
  resetUserPassword,
  verifyUserToken,
} from '../../src/api/routes/auth/service';
import {
  setUpServer,
  registerPayload,
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyForgotToken,
  resetPassword,
  registration,
  registerThenLogin,
  registerThenForgotPass,
} from '../component';

beforeAll(() => sequelize.authenticate());

afterAll(() => sequelize.close());

describe('Register', () => {
  test('Success', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();

    const { status, headers, body } = await register(server, payload);

    expect(status).toBe(201);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, `phone_number` Already Exist', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const phoneNumber = Date.now().toString();
    await userRegistration({ ...payload, phone_number: phoneNumber });

    const newPayload = {
      ...payload,
      username: Math.random().toString(36).substring(2),
      phone_number: phoneNumber,
    };
    const { status, headers, body } = await register(server, newPayload);

    expect(status).toBe(400);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `username` Already Exist', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const { username } = payload;
    await userRegistration(payload);
    const newPayload = {
      ...payload,
      username,
      phone_number: Date.now().toString(),
    };

    const { status, headers, body } = await register(server, newPayload);

    expect(status).toBe(400);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, Empty `full_name`', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const fullName = '';

    const { status, headers, body } = await register(server, { ...payload, full_name: fullName });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, Empty `address`', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const address = '';

    const { status, headers, body } = await register(server, { ...payload, address });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `full_name` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const fullName = 'x';

    const { status, headers, body } = await register(server, { ...payload, full_name: fullName });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `full_name` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const fullName = Array(257).toString();

    const { status, headers, body } = await register(server, { ...payload, full_name: fullName });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `username` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const username = Math.random().toString(36).substring(7);

    const { status, headers, body } = await register(server, { ...payload, username });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `username` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const username = Array(22).toString();

    const { status, headers, body } = await register(server, { ...payload, username });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `phone_number` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const phoneNumber = '1234';

    const { status, headers, body } = await register(server, {
      ...payload,
      phone_number: phoneNumber,
    });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `phone_number` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const phoneNumber = '123456789012345';

    const { status, headers, body } = await register(server, {
      ...payload,
      phone_number: phoneNumber,
    });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `address` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const address = 'addr';

    const { status, headers, body } = await register(server, { ...payload, address });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `address` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const payload = registerPayload();
    const address = Array(1002).toString();

    const { status, headers, body } = await register(server, { ...payload, address });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No Data Provided', async () => {
    const { appServer, server } = await setUpServer();

    const { status, headers, body } = await register(server, {});

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});

describe('Login', () => {
  test('Success', async () => {
    const { appServer, server } = await setUpServer();
    const { username, password } = await registration();

    const { status, headers, body } = await login(server, {
      username,
      password,
    });

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, Wrong `password`', async () => {
    const { appServer, server } = await setUpServer();
    const { username } = await registration();
    const password = 'wrong-password';

    const { status, headers, body } = await login(server, {
      username,
      password,
    });

    expect(status).toBe(400);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, User Not Registered', async () => {
    const { appServer, server } = await setUpServer();
    const username = 'this-username-doesnt-exist';
    const password = 'just-random-password';

    const { status, headers, body } = await login(server, {
      username,
      password,
    });

    expect(status).toBe(400);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No `username` Provided', async () => {
    const { appServer, server } = await setUpServer();

    const { status, headers, body } = await login(server, { username: 'username' });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No `password` Provided', async () => {
    const { appServer, server } = await setUpServer();

    const { status, headers, body } = await login(server, { password: 'password' });

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});

describe('Get Profile', () => {
  test('Success', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();

    const { status, headers, body } = await getProfile(server, token);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, Wrong API Key', async () => {
    const { appServer, server } = await setUpServer();
    const authorization = 'this-is-wrong-token';

    const { status, headers, body } = await getProfile(server, authorization);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, API Key Not Given', async () => {
    const { appServer, server } = await setUpServer();
    const authorization = undefined;

    const { status, headers, body } = await getProfile(server, authorization);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});

describe('Update Profile', () => {
  test('Success, Add New Profile Image', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const file = fs.createReadStream('./__test__/image-test.png');
    const updatePayload = {
      token,
      fields: {
        full_name: 'New Full Name',
        address: 'New Address',
        phone_number: Date.now().toString(),
      },
      files: [{ file, field: 'avatar' }],
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Success, Update Profile Image', async () => {
    const { appServer, server } = await setUpServer();
    const { token, username } = await registerThenLogin();
    const [{ id: userId }, { id: imgId }] = await Promise.all([
      getUser('USERNAME', username),
      createUserImg(`${username}-not-valid.jpg`),
    ]);
    await updateUser(userId, { id_photo: imgId });
    const file = fs.createReadStream('./__test__/image-test.png');
    const updatePayload = {
      token,
      fields: {
        full_name: 'New Full Name',
        address: 'New Address',
        phone_number: Date.now().toString(),
        password: 'newpassword',
      },
      files: [{ file, field: 'avatar' }],
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, `full_name` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        full_name: 'x',
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `full_name` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        full_name: Array(257).toString(),
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `phone_number` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        phone_number: '1234',
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `phone_number` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        phone_number: '123456789012345',
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `address` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        address: 'addr',
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `address` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        address: Array(1002).toString(),
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `password` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        password: 'pass',
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `password` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const { token } = await registerThenLogin();
    const updatePayload = {
      token,
      fields: {
        password: Array(257).toString(),
      },
    };

    const { status, headers, body } = await updateProfile(server, updatePayload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, Wrong API Key', async () => {
    const { appServer, server } = await setUpServer();
    const authorization = 'this-is-wrong-token';

    const { status, headers, body } = await updateProfile(server, {
      token: authorization,
    });

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, API Key Not Given', async () => {
    const { appServer, server } = await setUpServer();

    const { status, headers, body } = await updateProfile(server);

    expect(status).toBe(403);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});

describe('Forgot Password', () => {
  test('Success', async () => {
    const { appServer, server } = await setUpServer();
    const { phone_number } = await registerThenLogin();
    const payload = { phone_number };

    const { status, headers, body } = await forgotPassword(server, payload);

    expect(status).toBe(201);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, `phone_number` Not Registered', async () => {
    const { appServer, server } = await setUpServer();
    const payload = { phone_number: '6991224220261' };

    const { status, headers, body } = await forgotPassword(server, payload);

    expect(status).toBe(404);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No `phone_number` Provided', async () => {
    const { appServer, server } = await setUpServer();

    const { status, headers, body } = await forgotPassword(server, {});

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});

describe('Verify Forgot Password Token', () => {
  test('Success', async () => {
    const { appServer, server } = await setUpServer();
    const { verification_token } = await registerThenForgotPass();
    const { status, headers, body } = await verifyForgotToken(server, verification_token);

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, Token Invalid', async () => {
    const { appServer, server } = await setUpServer();
    const wrongToken = 'this-token-not-exist';

    const { status, headers, body } = await verifyForgotToken(server, wrongToken);

    expect(status).toBe(404);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No Token Provided', async () => {
    const { appServer, server } = await setUpServer();

    const { status, headers, body } = await verifyForgotToken(server);

    expect(status).toBe(404);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});

describe('Reset Password', () => {
  test('Success', async () => {
    const { appServer, server } = await setUpServer();
    const { username, verification_token } = await registerThenForgotPass();
    await verifyUserToken({ token: verification_token });
    const payload = {
      token: verification_token,
      new_password: 'newpassword',
    };
    await resetUserPassword(payload);

    const { status, headers, body } = await login(server, {
      username: username,
      password: payload.new_password,
    });

    expect(status).toBe(200);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(true);

    appServer.close();
  });

  test('Fail, `token` Invalid', async () => {
    const { appServer, server } = await setUpServer();
    const payload = {
      token: 'this-token-not-exists',
      new_password: 'newpassword',
    };

    const { status, headers, body } = await resetPassword(server, payload);

    expect(status).toBe(404);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `password` too Short', async () => {
    const { appServer, server } = await setUpServer();
    const { verification_token } = await registerThenForgotPass();
    await verifyUserToken({ token: verification_token });
    const payload = {
      token: verification_token,
      new_password: 'short',
    };

    const { status, headers, body } = await resetPassword(server, payload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, `new_password` too Long', async () => {
    const { appServer, server } = await setUpServer();
    const { verification_token } = await registerThenForgotPass();
    await verifyUserToken({ token: verification_token });
    const payload = {
      token: verification_token,
      new_password: Array(257).toString(),
    };

    const { status, headers, body } = await resetPassword(server, payload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No `token` Provided', async () => {
    const { appServer, server } = await setUpServer();
    const payload = { new_password: 'newpassword' };

    const { status, headers, body } = await resetPassword(server, payload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });

  test('Fail, No `new_password` Provided', async () => {
    const { appServer, server } = await setUpServer();
    const payload = { token: 'this-token-not-exists' };

    const { status, headers, body } = await resetPassword(server, payload);

    expect(status).toBe(422);
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.success).toBe(false);

    appServer.close();
  });
});
