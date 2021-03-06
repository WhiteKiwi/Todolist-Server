const Sentry = require('@sentry/node');
const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const configs = require('../configs');
const { HTTP_STATUS_CODE } = require('../utils/constants');

const userRepository = new UserRepository();
module.exports = {
	// GET /users
	getUser: async (req, res) => {
		const user = await userRepository.readByUserID(req.user.userID);
		if (user)
			res.json(user);
		else
			res.status(HTTP_STATUS_CODE.NotFound).json({ message: 'Not Found' });
	},
	// POST /users
	postUser: async (req, res) => {
		const { userID, password, nickname } = req.body;
		if ([userID, password, nickname].includes(undefined)) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		const isSuccess = await userRepository.create(userID, password, nickname);
		if (isSuccess)
			res.status(HTTP_STATUS_CODE.Created).json({});
		else {
			Sentry.captureMessage(`유저 생성 실패 for ID: ${userID}, Nickname: ${nickname}`);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	},
	// PATCH /users
	patchUser: (req, res) => {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// DELETE /users
	deleteUser: async (req, res) => {
		const password = req.body.password;
		if (password == undefined) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		// TODO: 30일 이후 자동삭제 구현
		const isSuccess = await userRepository.delete(req.user.userID, password);
		if (isSuccess) {
			// TODO: Token 거부리스트 구현
			res.status(HTTP_STATUS_CODE.NoContent).json({});
		} else {
			res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Incorrect Password' });
		}
	},
	// GET /users/verify-user-id - User ID 중복 여부 검사
	verifyUserID: async (req, res) => {
		const userID = req.query.userID;
		if (userID == undefined) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		const isOK = await userRepository.verifyUserID(userID);
		res.json({ isOK });
	},
	// GET /users/verify-nickname - 닉네임 중복 여부 검사
	verifyNickname: async (req, res) => {
		const nickname = req.query.nickname;
		if (nickname == undefined) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		const isOK = await userRepository.verifyNickname(nickname);
		res.json({ isOK });
	},
	// PATCH /users/password - Password 변경 API
	patchUserPassword: async (req, res) => {
		const { oldPassword, newPassword } = req.body;
		if ([oldPassword, newPassword].includes(undefined)) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		const isSuccess = await userRepository.updatePassword(req.user.userID, oldPassword, newPassword);
		if (isSuccess) {
			res.status(HTTP_STATUS_CODE.NoContent).json({});
		} else {
			res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Incorrect Password' });
		}
	},
	// GET /users/sign-in - Sign In API
	signIn: async (req, res) => {
		const { userID, password } = req.body;
		if ([userID, password].includes(undefined)) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		const user = await userRepository.verify(userID, password);
		if (user) {
			let payload = {
				uuid: user.uuid,
				userID: user.userID,
				nickname: user.nickname
			};
			let token = jwt.sign(payload, configs.JWT.SECRET, { expiresIn: '7d' });

			// TODO: refresh Token도 구현하기
			// TODO: Mongo DB에 Session 저장 및 검증
			res.json({
				'accessToken': token,
				'refreshToken': ''
			});
		} else {
			res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Incorrect Information' });
		}
	},
	// GET /users/sign-out - 로그아웃
	signOut: (req, res) => {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// GET /users/token - refresh access token
	refresh: (req, res) => {
		// TODO: token refresh API 구현
		res.send('Comming Soon');
	}
};
