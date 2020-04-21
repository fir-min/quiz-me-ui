require("dotenv").config();
//const basePath = "http://localhost:5000/qm";
const basePath =
  "https://3bnboarae1.execute-api.us-east-1.amazonaws.com/production/qm";

const post = async (path, body, headers) => {
  console.log("req body");
  console.log(body);
  console.log(headers);

  try {
    const res = await fetch(path, {
      method: "post",
      body: JSON.stringify(body),
      headers: headers,
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
      headers: headers,
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const put = async (path, body, headers) => {
  try {
    const res = await fetch(path, {
      method: "put",
      body: JSON.stringify(body),
      headers: headers,
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
      headers: headers,
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const QuizMeService = {
  login: async (req) => {
    return await post(`${basePath}/login`, req.body, {
      "Content-Type": "application/json",
    });
  },

  register: async (req) => {
    return await post(`${basePath}/register`, req.body, {
      "Content-Type": "application/json",
    });
  },

  getUserQuizzes: async (req) => {
    return await get(`${basePath}/users/${req.userId}/quizzes`, {
      Authorization: req.token,
    });
  },

  getUserFlashcardDecks: async (req) => {
    return await get(`${basePath}/users/${req.userId}/flashcard-decks`, {
      Authorization: req.token,
    });
  },

  createQuiz: async (req) => {
    return await post(`${basePath}/quizzes`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  createFlashcardDeck: async (req) => {
    return await post(`${basePath}/flashcard-decks`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  createQuestion: async (req) => {
    return await post(`${basePath}/questions`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  createFlashcard: async (req) => {
    return await post(`${basePath}/flashcards`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  editQuiz: async (req) => {
    return await put(`${basePath}/quizzes`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  editFlashcardDeck: async (req) => {
    return await put(`${basePath}/flashcard-deck`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  getQuiz: async (req) => {
    return await get(`${basePath}/quizzes/${req.quiz_id}`, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  getFlashcardDeck: async (req) => {
    return await get(`${basePath}/flashcard-decks/${req.flashcard_deck_id}`, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  getQuizzes: async (req) => {
    return await get(`${basePath}/quizzes`, {});
  },

  getFlashcardDecks: async (req) => {
    return await get(`${basePath}/flashcard-decks`, {});
  },

  deleteQuiz: async (req) => {
    return await del(`${basePath}/quizzes/${req.quiz_id}`, {
      Authorization: req.token,
    });
  },

  editQuestion: async (req) => {
    return await put(`${basePath}/questions`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  editFlashcard: async (req) => {
    return await put(`${basePath}/flashcards`, req.body, {
      Authorization: req.token,
      "Content-Type": "application/json",
    });
  },

  deleteQuestion: async (req) => {
    return await del(`${basePath}/questions/${req.question_id}`, {
      Authorization: req.token,
    });
  },

  deleteFlashcard: async (req) => {
    return await del(`${basePath}/flashcards/${req.flashcard_id}`, {
      Authorization: req.token,
    });
  },

  deleteFlashcardDeck: async (req) => {
    return await del(`${basePath}/flashcard-decks/${req.flashcard_deck_id}`, {
      Authorization: req.token,
    });
  },
};

export default QuizMeService;
