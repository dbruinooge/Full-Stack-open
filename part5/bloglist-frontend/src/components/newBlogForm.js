const newBlogForm = ({
    handleNewBlog,
    title,
    setTitle,
    author,
    setAuthor,
    url,
    setUrl,
  }) => (
  <form onSubmit={handleNewBlog}>
    <div>
      title:
      <input 
      type="text"
      value={title}
      name="Title"
      onChange={({target}) => setTitle(target.value)}
      />
    </div>
    <div>
      author:
      <input
      type="text"
      value={author}
      name="Author"
      onChange={({target}) => setAuthor(target.value)}
      />
    </div>
    <div>
      url:
      <input
      type="text"
      value={url}
      name="Url"
      onChange={({target}) => setUrl(target.value)}
      />
      <button type="submit">create</button>
    </div>
  </form>
)

export default newBlogForm;