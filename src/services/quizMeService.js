require("dotenv").config();
const basePath = "http://localhost:5000/qm";

const doPost = async(path, body, headers) => {
    try {
        const res = await fetch(path, {
            method: "post",
            body: JSON.stringify(body),
            headers: headers
        });
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const doGet = async(path, headers) => {
    try {
        const res = await fetch(path, {
            method: "get",
            headers: headers
        });
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const QuizMeService = {
    login: async req => {
        return await doPost(`${basePath}/login`, req.body, {
            "Content-Type": "application/json"
        });
    },

    register: async req => {
        return await doPost(`${basePath}/register`, req.body, {
            "Content-Type": "application/json"
        });
    },

    getUserQuizzes: async(req) => {
        return await doGet(`${basePath}/users/${req.userId}/quizzes`, {
            Authorization: req.token
        });
    },

    createQuiz: async(req) => {
        return await doPost(`${basePath}/quizzes`, req.body, {
            Authorization: req.token
        });
    }
};

export default QuizMeService;