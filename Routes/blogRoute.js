const express = require("express");
const {
  getAllPublishedBlogs,
  createBlog,
  updateBlogState,
  deleteBlog,
} = require("./controllers/blogController");
const { authenticate } = require("./middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllPublishedBlogs);
router.post("/", authenticate, createBlog);
router.patch("/:id/state", authenticate, updateBlogState);
router.delete("/:id", authenticate, deleteBlog);

module.exports = router;
