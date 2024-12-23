const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Your Express app
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer, token, userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    first_name: 'Fatimah',
    last_name: 'Aliyu',
    email: 'FatimahAliyu@gmail.com',
    password: 'password123',
  });

  userId = user._id;

  const res = await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'fatimah@gmail.com',
      password: 'password123',
    });

  token = res.body.token;
});

describe('Blog API', () => {
  it('should create a new blog', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Blog',
        body: 'This is the body of the blog.',
        tags: ['test', 'blogging'],
        description: 'A test blog',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('My First Blog');
    expect(res.body.state).toBe('draft');
  });

  it('should fetch published blogs (public)', async () => {
    await Blog.create({
      title: 'Published Blog',
      body: 'Content for public blog',
      tags: ['public'],
      description: 'A public blog',
      author: userId,
      state: 'published',
    });

    const res = await request(app).get('/api/blogs');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single published blog and update read count', async () => {
    const blog = await Blog.create({
      title: 'Read Count Test',
      body: 'Content for read count test',
      tags: ['read-count'],
      description: 'A test for read count',
      author: userId,
      state: 'published',
    });

    const res = await request(app).get(`/api/blogs/${blog._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.read_count).toBe(1);
  });

  it('should update the blog state to published', async () => {
    const blog = await Blog.create({
      title: 'Draft Blog',
      body: 'Content for draft',
      tags: ['draft'],
      description: 'A draft blog',
      author: userId,
    });

    const res = await request(app)
      .patch(`/api/blogs/${blog._id}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' });

    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe('published');
  });

  it('should delete a blog', async () => {
    const blog = await Blog.create({
      title: 'Blog to Delete',
      body: 'Content to delete',
      tags: ['delete'],
      description: 'Delete this blog',
      author: userId,
    });

    const res = await request(app)
      .delete(`/api/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
