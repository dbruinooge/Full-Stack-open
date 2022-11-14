const dummy = (blogs) => {
  return 1;
}

const totalLikes = (posts) => {
  return posts.map(post => post.likes).reduce((sum, num) => sum + num);
}

const favoriteBlog = (blogs) => {
  let copy = blogs.slice();
  copy.sort((a, b) => b.likes - a.likes);
  return copy[0];
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}