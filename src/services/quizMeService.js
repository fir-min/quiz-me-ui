require("dotenv").config();
const basePath = "http://localhost:5000/qm";

const post = async (path, body, headers) => {
  console.log("req body");
  console.log(body);
  console.log(headers);
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

const get = async (path, headers) => {
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

const put = async (path, headers) => {
  try {
    const res = await fetch(path, {
      method: "put",
      headers: headers
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const del = async (path, headers) => {
  try {
    const res = await fetch(path, {
      method: "delete",
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
    return await post(`${basePath}/login`, req.body, {
      "Content-Type": "application/json"
    });
  },

  register: async req => {
    return await post(`${basePath}/register`, req.body, {
      "Content-Type": "application/json"
    });
  },

  getUserQuizzes: async req => {
    return await get(`${basePath}/users/${req.userId}/quizzes`, {
      Authorization: req.token
    });
  },

  getUserFlashcardDecks: async req => {
    return await get(`${basePath}/users/${req.userId}/flashcard-decks`, {
      Authorization: req.token
    });
  },

  createQuiz: async req => {
    return await post(`${basePath}/quizzes`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json"
    });
  },

  deleteQuiz: async req => {
    return await del(`${basePath}/quizzes/${req.quiz_id}`, {
      Authorization: req.token
    });
  },

  deleteFlashcardDeck: async req => {
    return await del(`${basePath}/flashcard-decks/${req.flashcard_deck_id}`, {
      Authorization: req.token
    });
  }
};

export default QuizMeService;
