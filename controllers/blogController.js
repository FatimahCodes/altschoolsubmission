const Blog = require("Modules/blogModel.js");
const calculateReadingTime = require("utils/calculationReadingTimes.js");

// Get All Published Blogs (Paginated, Searchable, and Sortable)
exports.getAllPublishedBlogs = async (req, res) => {
  const { page = 1, limit = 20, search, sortBy = "timestamp" } = req.query;

  const query = { state: "published" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const blogs = await Blog.find(query)
    .populate("author", "first_name last_name email")
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json(blogs);
};

// Create Blog
exports.createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  const reading_time = calculateReadingTime(body);

  const blog = await Blog.create({
    title,
    description,
    tags,
    body,
    author: req.user._id,
    reading_time,
  });

  res.status(201).json(blog);
};

// Update Blog State
exports.updateBlogState = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  blog.state = req.body.state || blog.state;
  await blog.save();
  res.status(200).json(blog);
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  await blog.delete();
  res.status(204).send();
};
